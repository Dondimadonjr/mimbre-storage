import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  createWebpayTransaction,
  validateAmount,
  generateBuyOrder,
  generateSessionId,
} from '@/lib/webpay'
import type { WebpayCreateRequest } from '@/types/order'
import type { Product } from '@/types/product'

type ProductPaymentData = Pick<
  Product,
  'id' | 'name' | 'price' | 'available' | 'stock'
>

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 })
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
}

export async function POST(request: NextRequest) {
  try {
    const body: WebpayCreateRequest = await request.json()

    if (!body.items || body.items.length === 0) {
      return badRequest('El carrito esta vacio')
    }

    if (
      !body.customer.name ||
      !body.customer.email ||
      !body.customer.phone ||
      !body.customer.address
    ) {
      return badRequest('Faltan datos del cliente')
    }

    const requestedItems = new Map<string, number>()

    for (const item of body.items) {
      if (!item.product_id || !isValidUuid(item.product_id)) {
        return badRequest('Uno o mas productos no son validos')
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return badRequest('La cantidad de cada producto debe ser mayor a cero')
      }

      requestedItems.set(
        item.product_id,
        (requestedItems.get(item.product_id) ?? 0) + item.quantity
      )
    }

    const productIds = Array.from(requestedItems.keys())

    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, available, stock')
      .in('id', productIds)
      .returns<ProductPaymentData[]>()

    if (productsError) {
      console.error('Error loading products for payment:', productsError)
      return NextResponse.json(
        { message: 'Error al validar los productos' },
        { status: 500 }
      )
    }

    if (!products || products.length !== productIds.length) {
      return badRequest('Uno o mas productos no existen')
    }

    const productsById = new Map(products.map((product) => [product.id, product]))

    for (const [productId, quantity] of requestedItems) {
      const product = productsById.get(productId)

      if (!product) {
        return badRequest('Uno o mas productos no existen')
      }

      if (!product.available) {
        return badRequest(`El producto "${product.name}" no esta disponible`)
      }

      if (product.stock < quantity) {
        return badRequest(`Stock insuficiente para "${product.name}"`)
      }

      if (!Number.isFinite(product.price) || product.price <= 0) {
        return NextResponse.json(
          { message: 'Error al validar el precio del producto' },
          { status: 500 }
        )
      }
    }

    const calculatedTotal = productIds.reduce((acc, productId) => {
      const product = productsById.get(productId)
      const quantity = requestedItems.get(productId) ?? 0

      return acc + (product?.price ?? 0) * quantity
    }, 0)

    const amountValidation = validateAmount(calculatedTotal)
    if (!amountValidation.valid) {
      return badRequest(amountValidation.message || 'El monto no es valido')
    }

    const buyOrder = generateBuyOrder()
    const sessionId = generateSessionId()

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

    const orderItems = productIds.map((productId) => {
      const product = productsById.get(productId)
      const quantity = requestedItems.get(productId) ?? 0

      return {
        order_id: order.id,
        product_id: productId,
        product_name: product?.name ?? '',
        unit_price: product?.price ?? 0,
        quantity,
        subtotal: (product?.price ?? 0) * quantity,
      }
    })

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

    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pago/retorno`

    const webpayResponse = await createWebpayTransaction(
      buyOrder,
      sessionId,
      calculatedTotal,
      returnUrl
    )

    const { error: paymentError } = await supabaseAdmin.from('payments').insert([
      {
        order_id: order.id,
        token: webpayResponse.token,
        buy_order: buyOrder,
        session_id: sessionId,
        amount: calculatedTotal,
        status: 'pendiente',
      },
    ])

    if (paymentError) {
      console.error('Error creating payment record:', {
        orderId: order.id,
        buyOrder,
        error: paymentError.message,
      })

      const { error: cancelOrderError } = await supabaseAdmin
        .from('orders')
        .update({ status: 'cancelado' })
        .eq('id', order.id)

      if (cancelOrderError) {
        console.error('Error marking order as cancelled after payment insert failure:', {
          orderId: order.id,
          buyOrder,
          error: cancelOrderError.message,
        })
      }

      return NextResponse.json(
        { message: 'Error al registrar el pago. Intenta nuevamente.' },
        { status: 500 }
      )
    }

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
