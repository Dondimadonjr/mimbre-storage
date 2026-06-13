import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendOrderPaidEmails } from '@/lib/emails/orderEmails'
import { confirmWebpayTransaction } from '@/lib/webpay'
import type { Order, OrderItem, WebpayConfirmRequest } from '@/types/order'

type OrderItemStockData = {
  product_id: string
  quantity: number
}

type ProductStockData = {
  id: string
  stock: number
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

async function discountOrderStock(orderId: string) {
  const { data: orderItems, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId)
    .returns<OrderItemStockData[]>()

  if (itemsError) {
    console.error('Error loading order items for stock discount:', itemsError)
    return
  }

  if (!orderItems || orderItems.length === 0) {
    console.error('No order items found for stock discount:', { orderId })
    return
  }

  for (const item of orderItems) {
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, stock')
      .eq('id', item.product_id)
      .maybeSingle<ProductStockData>()

    if (productError || !product) {
      console.error('Error loading product for stock discount:', {
        productId: item.product_id,
        error: productError,
      })
      continue
    }

    const nextStock = Math.max(Number(product.stock) - Number(item.quantity), 0)

    const { error: updateStockError } = await supabaseAdmin
      .from('products')
      .update({ stock: nextStock })
      .eq('id', product.id)

    if (updateStockError) {
      console.error('Error updating product stock after payment:', {
        productId: product.id,
        error: updateStockError,
      })
    }
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

    // Actualizar orden
    const orderUpdate = supabaseAdmin
      .from('orders')
      .update({ status: paymentStatus })
      .eq('id', payment.order_id)

    if (paymentStatus === 'pagado') {
      orderUpdate.neq('status', 'pagado')
    }

    const { data: updatedOrder, error: orderError } = await orderUpdate
      .select('id, status')
      .maybeSingle()

    if (orderError) {
      console.error('Error updating order:', orderError)
    }

    const shouldSendEmails =
      paymentStatus === 'pagado' &&
      currentOrder.status !== 'pagado' &&
      Boolean(updatedOrder)

    if (
      paymentStatus === 'pagado' &&
      currentOrder.status !== 'pagado' &&
      updatedOrder
    ) {
      await discountOrderStock(payment.order_id)
    }

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

    if (
      shouldSendEmails
    ) {
      const emailData = await loadOrderEmailData(payment.order_id)

      if (emailData) {
        await sendOrderPaidEmails(emailData)
      }
    }

    return NextResponse.json({
      orderId: payment.order_id,
      status: paymentStatus,
      message:
        paymentStatus === 'pagado'
          ? 'Pago realizado exitosamente'
          : 'El pago fue rechazado',
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
