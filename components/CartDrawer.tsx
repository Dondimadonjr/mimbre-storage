"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  clearCart,
  decreaseQuantity,
  getCart,
  getCartTotals,
  increaseQuantity,
  removeFromCart,
} from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/types/cart";

interface CartDrawerProps {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return getCart();
  });

  const [totals, setTotals] = useState(() => {
    if (typeof window === "undefined") {
      return { subtotal: 0, total: 0 };
    }

    return getCartTotals(getCart());
  });

  const refreshCart = (updatedCart?: CartItem[]) => {
    const cart = updatedCart ?? getCart();
    setItems(cart);
    setTotals(getCartTotals(cart));
  };

  const handleIncrease = (productId: string) => {
    const updated = increaseQuantity(productId);
    refreshCart(updated);
  };

  const handleDecrease = (productId: string) => {
    const updated = decreaseQuantity(productId);
    refreshCart(updated);
  };

  const handleRemove = (productId: string) => {
    const updated = removeFromCart(productId);
    refreshCart(updated);
  };

  const handleClear = () => {
    if (confirm("¿Deseas vaciar el carrito?")) {
      clearCart();
      refreshCart([]);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar carrito"
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-white p-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coffee">
              Carrito
            </p>
            <h2 className="text-xl font-bold text-text-dark">Tu compra</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            title="Cerrar carrito"
            className="rounded-full p-2 text-text-dark transition hover:bg-cream"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="grid grid-cols-[80px_1fr_auto] gap-4 rounded-2xl border border-border bg-cream/50 p-3"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-white">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        🧺
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={`/productos/${item.product_id}`}
                      onClick={onClose}
                      className="line-clamp-2 text-sm font-bold text-text-dark transition hover:text-coffee"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-1 font-bold text-coffee">
                      {formatCurrency(item.price)}
                    </p>

                    <div className="mt-3 flex w-fit items-center overflow-hidden rounded-full border border-border bg-white">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item.product_id)}
                        aria-label={`Disminuir cantidad de ${item.name}`}
                        title={`Disminuir cantidad de ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center font-bold text-coffee transition hover:bg-cream"
                      >
                        −
                      </button>

                      <span className="w-8 text-center text-sm font-semibold text-text-dark">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleIncrease(item.product_id)}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        title={`Aumentar cantidad de ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center font-bold text-coffee transition hover:bg-cream"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.product_id)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                    title={`Eliminar ${item.name}`}
                    className="h-fit rounded-full p-2 text-red-600 transition hover:bg-red-50"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m-9 0h12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border bg-white p-5">
              <div className="space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>Envío:</span>
                  <span>A coordinar</span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-lg font-bold text-text-dark">
                    Total:
                  </span>
                  <span className="text-3xl font-bold text-coffee">
                    {formatCurrency(totals.total)}
                  </span>
                </div>
              </div>

              <Link
                href="/pago/checkout"
                onClick={onClose}
                className="mt-5 block w-full rounded-full bg-coffee px-6 py-3 text-center font-bold text-white shadow-lg shadow-coffee/20 transition hover:bg-coffee-dark"
              >
                Proceder al pago
              </Link>

              <button
                type="button"
                onClick={handleClear}
                className="mt-3 w-full rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Vaciar carrito
              </button>

              <Link
                href="/#productos"
                onClick={onClose}
                className="mt-3 block w-full rounded-full border border-coffee px-6 py-3 text-center font-bold text-coffee transition hover:bg-cream"
              >
                Continuar comprando
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-coffee/10 text-4xl">
                🧺
              </div>

              <h3 className="mt-6 text-2xl font-bold text-text-dark">
                Carrito vacío
              </h3>

              <p className="mt-2 text-text-secondary">
                Todavía no tienes productos agregados.
              </p>

              <Link
                href="/#productos"
                onClick={onClose}
                className="mt-7 inline-flex rounded-full bg-coffee px-7 py-3 font-bold text-white transition hover:bg-coffee-dark"
              >
                Ver productos
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}