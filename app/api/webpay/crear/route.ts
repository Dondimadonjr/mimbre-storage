import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  createWebpayTransaction,
  validateAmount,
  generateBuyOrder,
  generateSessionId,
} from '@/lib/webpay'
import type { WebpayCreateRequest } from '@/types/order'

export async function POST(request: NextRequest) {
  try {
    const body: WebpayCreateRequest = await request.json()

    // Validar que el carrito no esté vacío
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { message: 'El carrito está vacío' },
        { status: 400 }
      )
    }

    // Validar datos del cliente
    if (
      !body.customer.name ||
      !body.customer.email ||
      !body.customer.phone ||
      !body.customer.address
    ) {
      return NextResponse.json(
        { message: 'Faltan datos del cliente' },
        { status: 400 }
      )
    }

    // Validar monto
    const amountValidation = validateAmount(body.total)
    if (!amountValidation.valid) {
      return NextResponse.json(
        { message: amountValidation.message },
        { status: 400 }
      )
    }

    // Recalcular total en el servidor (seguridad)
    const calculatedTotal = body.items.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0
    )

    if (calculatedTotal !== body.total) {
      return NextResponse.json(
        { message: 'El total no coincide. Recargá la página.' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Generar buy_order y session_id únicos
    const buyOrder = generateBuyOrder()
    const sessionId = generateSessionId()

    // Crear orden en Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          customer_name: body.customer.name,
          customer_email: body.customer.email,
          customer_phone: body.customer.phone,
          customer_address: body.customer.address,
          customer_commune: body.customer.commune || null,
          customer_region: body.customer.region || null,
          customer_comment: body.customer.comment || null,
          total: calculatedTotal,
          status: 'pendiente',
          buy_order: buyOrder,
          session_id: sessionId,
        },
      ])
      .select()
      .single()

    if (orderError || !order) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { message: 'Error al crear la orden' },
        { status: 500 }
      )
    }

    // Crear items de la orden
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal: item.unit_price * item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return NextResponse.json(
        { message: 'Error al crear items de la orden' },
        { status: 500 }
      )
    }

    // Crear transacción con Transbank
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pago/retorno`

    const webpayResponse = await createWebpayTransaction(
      buyOrder,
      sessionId,
      calculatedTotal,
      returnUrl
    )

    // Guardar token en la base de datos para auditoría
    await supabaseAdmin.from('payments').insert([
      {
        order_id: order.id,
        token: webpayResponse.token,
        buy_order: buyOrder,
        session_id: sessionId,
        amount: calculatedTotal,
        status: 'pendiente',
      },
    ])

    return NextResponse.json({
      url: webpayResponse.url,
      token: webpayResponse.token,
      buy_order: buyOrder,
      session_id: sessionId,
    })
  } catch (error) {
    console.error('Error in webpay/crear:', error)
    return NextResponse.json(
      { message: 'Error al procesar el pago' },
      { status: 500 }
    )
  }
}
