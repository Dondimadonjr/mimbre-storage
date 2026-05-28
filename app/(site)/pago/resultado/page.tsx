import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/admin'

type PaymentResultPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key]
  return Array.isArray(value) ? value[0] : value
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(
    value
  )
}

async function isPaidOrder(orderId: string | undefined) {
  if (!orderId || !isValidUuid(orderId)) {
    return false
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .eq('status', 'pagado')
    .maybeSingle()

  if (error) {
    console.error('Error validating payment result:', error)
    return false
  }

  return Boolean(data)
}

export default async function PaymentResultPage({
  searchParams,
}: PaymentResultPageProps) {
  const params = await searchParams
  const status = getSearchParam(params, 'status')
  const orderId = getSearchParam(params, 'orderId')
  const message = getSearchParam(params, 'message')

  const isSuccess = status === 'success' && (await isPaidOrder(orderId))

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream py-12">
      <div className="max-w-md w-full bg-white rounded-lg p-8 shadow-card">
        {isSuccess ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-text-dark mb-4">
              ¡Compra Exitosa!
            </h1>

            <p className="text-center text-text-secondary mb-6">
              Tu pago ha sido procesado correctamente. Pronto recibirás un email
              de confirmación.
            </p>

            {orderId && (
              <div className="bg-cream p-4 rounded-lg mb-6">
                <p className="text-sm text-text-secondary mb-1">
                  Número de Orden:
                </p>
                <p className="font-bold text-text-dark font-mono">{orderId}</p>
              </div>
            )}

            <p className="text-center text-sm text-text-secondary mb-8">
              Nos comunicaremos contigo pronto para coordinar el envío de tu
              pedido.
            </p>

            <Link
              href="/"
              className="block w-full py-3 bg-coffee text-white font-semibold rounded-lg text-center hover:bg-coffee-dark transition-colors"
            >
              Volver al Inicio
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-text-dark mb-4">
              Pago No Procesado
            </h1>

            <p className="text-center text-text-secondary mb-6">
              {message ||
                'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.'}
            </p>

            <div className="space-y-3">
              <Link
                href="/carrito"
                className="block w-full py-3 bg-coffee text-white font-semibold rounded-lg text-center hover:bg-coffee-dark transition-colors"
              >
                Volver al Carrito
              </Link>
              <Link
                href="/"
                className="block w-full py-3 border border-coffee text-coffee font-semibold rounded-lg text-center hover:bg-cream transition-colors"
              >
                Ir al Inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
