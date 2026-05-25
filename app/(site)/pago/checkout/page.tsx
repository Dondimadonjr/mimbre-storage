"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { clearCart, getCart, getCartTotals } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/types/cart";

type CheckoutFormData = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_commune: string;
  customer_region: string;
  customer_comment: string;
};

const initialFormData: CheckoutFormData = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  customer_address: "",
  customer_commune: "",
  customer_region: "",
  customer_comment: "",
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  return phone.replace(/\D/g, "").length >= 9;
}

export default function CheckoutPage() {
  const [items] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return getCart();
  });

  const totals = useMemo(() => {
    return getCartTotals(items);
  }, [items]);

  const [formData, setFormData] =
    useState<CheckoutFormData>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (items.length === 0) return "El carrito está vacío.";
    if (!formData.customer_name.trim()) return "El nombre es obligatorio.";
    if (!validateEmail(formData.customer_email)) return "El email no es válido.";
    if (!validatePhone(formData.customer_phone)) {
      return "El teléfono debe tener al menos 9 dígitos.";
    }
    if (!formData.customer_address.trim()) return "La dirección es obligatoria.";
    return null;
  };

  const redirectToWebpay = (url: string, token: string) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "token_ws";
    input.value = token;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const formError = validateForm();
    if (formError) {
      setError(formError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/webpay/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          customer: {
            name: formData.customer_name.trim(),
            email: formData.customer_email.trim(),
            phone: formData.customer_phone.trim(),
            address: formData.customer_address.trim(),
            commune: formData.customer_commune.trim(),
            region: formData.customer_region.trim(),
            comment: formData.customer_comment.trim(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la transacción.");
      }

      if (!data.url || !data.token) {
        throw new Error("Webpay no devolvió URL o token.");
      }

      clearCart();
      redirectToWebpay(data.url, data.token);
    } catch (err) {
      console.error("Error checkout:", err);
      setError(err instanceof Error ? err.message : "Error al procesar el pago.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] bg-cream px-4 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white p-8 text-center shadow-soft">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-coffee/10 text-4xl">
            🧺
          </div>

          <h1 className="mt-6 text-3xl font-bold text-text-dark">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-text-secondary">
            Agrega productos antes de continuar al pago.
          </p>

          <Link
            href="/#productos"
            className="mt-7 inline-flex rounded-full bg-coffee px-7 py-3 font-bold text-white transition hover:bg-coffee-dark"
          >
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/carrito"
          className="inline-flex rounded-full border border-coffee/20 bg-white px-4 py-2 text-sm font-semibold text-coffee transition hover:bg-white/70"
        >
          ← Volver al carrito
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-white p-6 shadow-soft lg:col-span-2"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-coffee">
              Checkout
            </p>

            <h1 className="mt-3 text-4xl font-bold text-text-dark">
              Datos para el pago
            </h1>

            <p className="mt-3 text-text-secondary">
              Completa tus datos para continuar al pago seguro con Webpay.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-dark">
                  Nombre completo *
                </label>
                <input
                  aria-label="text"
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-dark">
                    Email *
                  </label>
                  <input
                    aria-label="email"
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-dark">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    placeholder="+56972086522"
                    className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-dark">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  required
                  placeholder="Calle, número, departamento"
                  className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-dark">
                    Comuna
                  </label>
                  <input
                    type="text"
                    name="customer_commune"
                    value={formData.customer_commune}
                    onChange={handleChange}
                    placeholder="Ej: Santiago"
                    className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-dark">
                    Región
                  </label>
                  <select
                    aria-label="customer_region"
                    name="customer_region"
                    value={formData.customer_region}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Metropolitana">Metropolitana</option>
                    <option value="Valparaíso">Valparaíso</option>
                    <option value="O'Higgins">O&apos;Higgins</option>
                    <option value="Maule">Maule</option>
                    <option value="Ñuble">Ñuble</option>
                    <option value="Bío Bío">Bío Bío</option>
                    <option value="Araucanía">Araucanía</option>
                    <option value="Los Ríos">Los Ríos</option>
                    <option value="Los Lagos">Los Lagos</option>
                    <option value="Aysén">Aysén</option>
                    <option value="Magallanes">Magallanes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-dark">
                  Comentario opcional
                </label>
                <textarea
                  name="customer_comment"
                  value={formData.customer_comment}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Instrucciones especiales de entrega..."
                  className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-coffee px-6 py-4 font-bold text-white shadow-lg shadow-coffee/20 transition hover:bg-coffee-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Procesando..." : "Ir a pagar con Webpay"}
              </button>
            </div>
          </form>

          <aside className="h-fit rounded-3xl border border-border bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-bold text-text-dark">
              Resumen del pedido
            </h2>

            <div className="mt-6 space-y-4 border-b border-border pb-6">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-text-secondary">
                    {item.name} x {item.quantity}
                  </span>

                  <span className="font-semibold text-text-dark">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>

              <div className="flex justify-between text-text-secondary">
                <span>Envío</span>
                <span>A coordinar</span>
              </div>

              <div className="flex justify-between border-t border-border pt-4 text-lg font-bold text-text-dark">
                <span>Total</span>
                <span className="text-coffee">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            <p className="mt-5 rounded-2xl bg-coffee/10 p-4 text-sm text-text-secondary">
              Al continuar, serás redirigido al portal seguro de Webpay.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
