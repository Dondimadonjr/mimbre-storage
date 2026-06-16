import Link from "next/link";

import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PaymentResultPageProps = {
  searchParams: Promise<{
    status?: string;
    orderId?: string;
    orderid?: string;
    order_id?: string;
    orderld?: string;
    message?: string;
  }>;
};

export default async function PaymentResultPage({
  searchParams,
}: PaymentResultPageProps) {
  const params = await searchParams;

  const status = String(params.status ?? "").trim().toLowerCase();

  const orderId = String(
    params.orderId ??
      params.orderid ??
      params.order_id ??
      params.orderld ??
      ""
  ).trim();

  let isPaidOrder = false;

  if (status === "success" && orderId) {
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .maybeSingle();

    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("id, order_id, status, response_code")
      .eq("order_id", orderId)
      .maybeSingle();

    const orderStatus = String(order?.status ?? "").trim().toLowerCase();
    const paymentStatus = String(payment?.status ?? "").trim().toLowerCase();
    const paymentResponseCode = Number(payment?.response_code);

    isPaidOrder =
      orderStatus === "pagado" ||
      (paymentStatus === "pagado" && paymentResponseCode === 0);
  }

  if (isPaidOrder) {
    return (
      <section className="min-h-[75vh] bg-cream px-4 py-20">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-soft">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
            ✓
          </div>

          <h1 className="mt-8 text-3xl font-bold text-text-dark">
            ¡Compra exitosa!
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            Tu pago ha sido procesado correctamente. Guardamos tu pedido y, si
            corresponde, recibirás la confirmación en tu correo.
          </p>

          <div className="mt-8 rounded-2xl bg-cream p-5 text-left">
            <p className="text-sm text-text-secondary">Número de orden:</p>
            <p className="mt-2 break-all font-mono font-bold text-text-dark">
              {orderId}
            </p>
          </div>

          <p className="mt-8 text-text-secondary">
            Nos comunicaremos contigo pronto para coordinar el envío o retiro de
            tu pedido.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex w-full justify-center rounded-full bg-coffee px-6 py-4 font-bold text-white transition hover:bg-coffee-dark"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[75vh] bg-cream px-4 py-20">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl text-red-600">
          ×
        </div>

        <h1 className="mt-8 text-3xl font-bold text-text-dark">
          Pago no procesado
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-text-secondary">
          Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
        </p>

        <div className="mt-8 space-y-4">
          <Link
            href="/carrito"
            className="inline-flex w-full justify-center rounded-full bg-coffee px-6 py-4 font-bold text-white transition hover:bg-coffee-dark"
          >
            Volver al carrito
          </Link>

          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-full border border-coffee px-6 py-4 font-bold text-coffee transition hover:bg-coffee hover:text-white"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}