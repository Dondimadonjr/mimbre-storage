"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";

import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  getCartTotals,
} from "@/lib/cart";

import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/types/cart";

const EMPTY_CART_SNAPSHOT: CartItem[] = [];

function subscribeCart(callback: () => void) {
  window.addEventListener("cart:updated", callback);
  window.addEventListener("cart-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("cart:updated", callback);
    window.removeEventListener("cart-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getCartSnapshot() {
  if (typeof window === "undefined") return EMPTY_CART_SNAPSHOT;
  return getCart();
}

function getServerCartSnapshot() {
  return EMPTY_CART_SNAPSHOT;
}

export default function CartPage() {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const totals = useMemo(() => getCartTotals(items), [items]);

  const totalProductos = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const handleIncrease = (productId: string) => {
    increaseQuantity(productId);
  };

  const handleDecrease = (productId: string) => {
    decreaseQuantity(productId);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleClear = () => {
    const confirmClear = window.confirm("¿Deseas vaciar el carrito?");

    if (!confirmClear) return;

    clearCart();
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-cream/80 via-white to-cream/50 py-10 sm:py-14">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-4 py-2 text-sm font-bold text-coffee shadow-sm">
              <ShoppingBag className="h-4 w-4" />
              Carrito de compras
            </p>

            <h1 className="text-3xl font-black tracking-tight text-text-dark sm:text-4xl">
              Tu Carrito
            </h1>

            <p className="mt-2 text-sm text-text-secondary sm:text-base">
              {items.length > 0
                ? `${totalProductos} producto${totalProductos === 1 ? "" : "s"} en tu carrito`
                : "Aún no has agregado productos"}
            </p>
          </div>

          <Link
            href="/"
            className="w-fit rounded-full border border-coffee/30 bg-white px-5 py-2.5 text-sm font-bold text-coffee shadow-sm transition hover:bg-coffee hover:text-white"
          >
            Seguir comprando
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-4xl border border-border bg-white p-4 shadow-soft transition hover:border-coffee/20 hover:shadow-[0_20px_50px_rgba(93,58,31,0.1)] sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <Link
                        href={`/productos/${item.product_id}`}
                        className="relative h-52 w-full shrink-0 overflow-hidden rounded-[1.35rem] border border-border bg-linear-to-br from-cream via-white to-coffee/10 sm:h-32 sm:w-32"
                      >
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 112px"
                            className="object-contain p-4 drop-shadow-[0_12px_18px_rgba(93,58,31,0.12)] transition duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-coffee/40">
                            <ShoppingBag className="h-10 w-10" />
                          </div>
                        )}
                      </Link>

                      <div className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <Link href={`/productos/${item.product_id}`}>
                            <h2 className="line-clamp-2 text-xl font-black leading-snug text-text-dark transition hover:text-coffee">
                              {item.name}
                            </h2>
                          </Link>

                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                            Precio unitario
                          </p>

                          <p className="mt-1 text-xl font-black text-coffee">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                          <div className="flex items-center overflow-hidden rounded-full border border-border bg-cream/70 shadow-inner">
                            <button
                              type="button"
                              onClick={() => handleDecrease(item.product_id)}
                              aria-label={`Disminuir cantidad de ${item.name}`}
                              className="flex h-10 w-10 items-center justify-center text-lg font-black text-coffee transition hover:bg-white"
                            >
                              −
                            </button>

                            <span className="min-w-11 bg-white px-2 text-center text-sm font-black text-text-dark">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleIncrease(item.product_id)}
                              aria-label={`Aumentar cantidad de ${item.name}`}
                              className="flex h-10 w-10 items-center justify-center text-lg font-black text-coffee transition hover:bg-white"
                            >
                              +
                            </button>
                          </div>

                          <div className="rounded-2xl bg-cream/70 px-4 py-2 text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                              Subtotal
                            </p>

                            <p className="mt-1 font-black text-text-dark">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.product_id)}
                            aria-label={`Eliminar ${item.name} del carrito`}
                            className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-4xl border border-border bg-white/95 p-6 shadow-soft lg:sticky lg:top-24">
              <h2 className="text-2xl font-black text-text-dark">Resumen</h2>

              <div className="mt-6 space-y-4 rounded-3xl bg-cream/60 p-5">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Productos</span>
                  <span className="font-bold text-text-dark">{totalProductos}</span>
                </div>

                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-bold text-text-dark">{formatCurrency(totals.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Envío</span>
                  <span className="font-bold text-text-dark">A coordinar</span>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
                <span className="text-base font-bold text-text-dark">
                  Total
                </span>

                <span className="text-3xl font-black tracking-tight text-coffee">
                  {formatCurrency(totals.total)}
                </span>
              </div>

              <Link
                href="/pago/checkout"
                className="mt-6 block w-full rounded-full bg-coffee px-6 py-4 text-center font-black text-white shadow-[0_14px_30px_rgba(93,58,31,0.22)] transition hover:bg-coffee-dark"
              >
                Proceder al pago
              </Link>

              <button
                type="button"
                onClick={handleClear}
                className="mt-3 w-full rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                Vaciar carrito
              </button>

              <p className="mt-4 text-center text-xs leading-relaxed text-text-secondary">
                El envío y la disponibilidad final se pueden confirmar en el
                checkout.
              </p>
            </aside>
          </div>
        ) : (
          <div className="rounded-4xl border border-border bg-white px-6 py-20 text-center shadow-soft">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cream text-coffee/50 shadow-inner">
              <ShoppingBag className="h-12 w-12" />
            </div>

            <h2 className="text-2xl font-black text-text-dark">
              Carrito vacío
            </h2>

            <p className="mx-auto mt-3 max-w-md text-text-secondary">
              Todavía no tienes productos agregados. Revisa el catálogo y suma
              tus favoritos.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full bg-coffee px-7 py-3 font-black text-white shadow-[0_14px_30px_rgba(93,58,31,0.18)] transition hover:bg-coffee-dark"
            >
              Ver productos
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
