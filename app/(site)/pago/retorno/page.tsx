'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { clearCart } from '@/lib/cart'

function PaymentReturnLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee mx-auto mb-4" />
        <p className="text-text-secondary">Procesando tu pago...</p>
      </div>
    </div>
  )
}

function PaymentReturnContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmPayment = async () => {
      const tokenWs = searchParams.get("token_ws");

      if (!tokenWs) {
        sessionStorage.removeItem("mimbre_webpay_pending");
        window.location.replace("/pago/resultado?status=error");
        return;
      }

      try {
        const response = await fetch("/api/webpay/confirmar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_ws: tokenWs }),
        });

        const data = await response.json();

        if (response.ok && data.status === "pagado" && data.orderId) {
          sessionStorage.removeItem("mimbre_webpay_pending");
          clearCart();
          window.dispatchEvent(new Event("cart-updated"));
          window.dispatchEvent(new Event("cart:updated"));

          const resultUrl = `/pago/resultado?status=success&orderId=${encodeURIComponent(
            String(data.orderId)
          )}`;

          window.location.replace(resultUrl);
          return;
        }

        sessionStorage.removeItem("mimbre_webpay_pending");

        const errorMessage = data?.message || "Pago no procesado";

        window.location.replace(
          `/pago/resultado?status=error&message=${encodeURIComponent(
            errorMessage
          )}`
        );
      } catch (error) {
        console.error("Error confirming payment:", error);
        sessionStorage.removeItem("mimbre_webpay_pending");
        window.location.replace("/pago/resultado?status=error");
      }
    };

    confirmPayment();
  }, [searchParams]);

  return <PaymentReturnLoading />;
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<PaymentReturnLoading />}>
      <PaymentReturnContent />
    </Suspense>
  )
}
