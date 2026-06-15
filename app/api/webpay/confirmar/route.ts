import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendOrderPaidEmails } from '@/lib/emails/orderEmails'
import { confirmWebpayTransaction } from '@/lib/webpay'
import type { Order, OrderItem, WebpayConfirmRequest } from '@/types/order'

type ConfirmPaidOrderRpcResult = {
  success: boolean
  message: string
  order_id: string
  previous_status: string
  new_status: string
  items_count: number
  discounted_items: number
}

async function loadOrderEmailData(orderId: string) {
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single<Order>()

  if (orderError || !order) {
    console.error('Error loading order for paid email:', orderError)
    return null
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .returns<OrderItem[]>()

  if (itemsError) {
    console.error('Error loading order items for paid email:', itemsError)
    return null
  }

  return {
    order,
    items: items || [],
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WebpayConfirmRequest = await request.json()

    if (!body.token_ws) {
      return NextResponse.json(
        { message: 'Token no proporcionado' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Confirmar transacción con Transbank
    const webpayResponse = await confirmWebpayTransaction(body.token_ws)

    // Buscar la orden por buy_order y session_id
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('order_id')
      .eq('token', body.token_ws)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError)
      return NextResponse.json(
        { message: 'Pago no encontrado' },
        { status: 404 }
      )
    }

    const { data: currentOrder, error: currentOrderError } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('id', payment.order_id)
      .single()

    if (currentOrderError || !currentOrder) {
      console.error('Order not found for payment confirmation:', currentOrderError)
      return NextResponse.json(
        { message: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Determinar estado del pago
    const paymentStatus =
      webpayResponse.responseCode === 0 ? 'pagado' : 'rechazado'

    // Actualizar pago
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: paymentStatus,
        buy_order: webpayResponse.buyOrder,
        session_id: webpayResponse.orderId,
        amount: webpayResponse.amount,
        authorization_code: webpayResponse.authorizationCode,
        payment_type_code: webpayResponse.paymentTypeCode,
        response_code: webpayResponse.responseCode,
        installments_number: webpayResponse.installmentsNumber,
        transaction_date: webpayResponse.transactionDate,
        raw_response: webpayResponse.raw,
      })
      .eq('token', body.token_ws)

    if (updateError) {
      console.error('Error updating payment:', updateError)
    }

    if (paymentStatus === 'rechazado') {
      const { error: orderError } = await supabaseAdmin
        .from('orders')
        .update({ status: paymentStatus })
        .eq('id', payment.order_id)
        .neq('status', 'pagado')

      if (orderError) {
        console.error('Error updating rejected order:', orderError)
      }

      return NextResponse.json({
        orderId: payment.order_id,
        status: paymentStatus,
        message: 'El pago fue rechazado',
        responseCode: webpayResponse.responseCode,
      })
    }

    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
      'confirm_paid_order_and_discount_stock',
      { p_order_id: currentOrder.id }
    )

    if (rpcError) {
      console.error('Error confirming paid order with stock RPC:', {
        orderId: currentOrder.id,
        message: rpcError.message,
        code: rpcError.code,
      })

      return NextResponse.json(
        {
          orderId: payment.order_id,
          status: 'error',
          message:
            'El pago fue aprobado, pero no se pudo confirmar el stock del pedido. Te contactaremos para resolverlo.',
          responseCode: webpayResponse.responseCode,
        },
        { status: 500 }
      )
    }

    const rpcResult = Array.isArray(rpcData)
      ? (rpcData[0] as ConfirmPaidOrderRpcResult | undefined)
      : (rpcData as ConfirmPaidOrderRpcResult | null)

    if (!rpcResult?.success) {
      console.error('Paid order stock RPC returned unsuccessful result:', {
        orderId: currentOrder.id,
        message: rpcResult?.message,
        previousStatus: rpcResult?.previous_status,
        newStatus: rpcResult?.new_status,
      })

      return NextResponse.json(
        {
          orderId: payment.order_id,
          status: 'error',
          message:
            'El pago fue aprobado, pero hubo un problema al confirmar el stock del pedido. Te contactaremos para resolverlo.',
          responseCode: webpayResponse.responseCode,
        },
        { status: 409 }
      )
    }

    const shouldSendEmails =
      rpcResult.previous_status !== 'pagado' &&
      rpcResult.new_status === 'pagado'

    if (shouldSendEmails) {
      const emailData = await loadOrderEmailData(payment.order_id)

      if (emailData) {
        await sendOrderPaidEmails(emailData)
      }
    }

    return NextResponse.json({
      orderId: payment.order_id,
      status: paymentStatus,
      message:
        rpcResult.previous_status === 'pagado'
          ? 'Pago ya confirmado'
          : 'Pago realizado exitosamente',
      responseCode: webpayResponse.responseCode,
    })
  } catch (error) {
    console.error('Error in webpay/confirmar:', error)
    return NextResponse.json(
      { message: 'Error al confirmar el pago' },
      { status: 500 }
    )
  }
}
