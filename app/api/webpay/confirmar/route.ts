import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { confirmWebpayTransaction } from '@/lib/webpay'
import type { WebpayConfirmRequest } from '@/types/order'

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

    // Determinar estado del pago
    const paymentStatus =
      webpayResponse.responseCode === 0 ? 'pagado' : 'rechazado'

    // Actualizar orden
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .update({ status: paymentStatus })
      .eq('id', payment.order_id)

    if (orderError) {
      console.error('Error updating order:', orderError)
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
