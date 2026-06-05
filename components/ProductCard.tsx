"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);

  const stock = product.stock ?? 0;
  const isAvailable = product.available && stock > 0;

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      stock,
      available: product.available,
    });

    setAddedToCart(true);
    window.dispatchEvent(new CustomEvent("cart-updated"));

    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP;
    if (!phone) return;

    const message = `Hola, me interesa este producto: ${product.name}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-coffee/25 hover:shadow-[0_24px_60px_rgba(93,58,31,0.14)]">
      {/* Imagen */}
      <Link href={`/productos/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-cream via-white to-coffee/10">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-7 drop-shadow-[0_18px_26px_rgba(93,58,31,0.16)] transition-transform duration-500 group-hover:scale-[1.06] sm:p-8"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl">🧺</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_38%,rgba(93,58,31,0.08)_100%)]" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 rounded-full border border-border bg-white/95 px-5 py-2 text-xs font-bold text-coffee opacity-0 shadow-soft backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Ver detalle →
          </div>

          {product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-coffee px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_10px_22px_rgba(93,58,31,0.22)]">
              Destacado
            </span>
          )}

          <span
            className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm ${
              isAvailable
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {isAvailable ? "En stock" : "Agotado"}
          </span>
        </div>
      </Link>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Meta */}
        <div className="mb-4 flex min-h-7 flex-wrap items-center gap-2">
          {product.category && (
            <span className="rounded-full border border-coffee/15 bg-cream px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-coffee">
              {product.category}
            </span>
          )}

          <span className="rounded-full border border-border bg-white px-3 py-1 text-[10px] font-semibold text-text-secondary">
            Hecho a mano
          </span>
        </div>

        {/* Nombre */}
        <Link href={`/productos/${product.id}`} className="block">
          <h3 className="mb-3 line-clamp-2 text-xl font-black leading-snug text-text-dark transition-colors group-hover:text-coffee">
            {product.name}
          </h3>
        </Link>

        {/* Descripción */}
        {product.description && (
          <p className="line-clamp-2 min-h-12 flex-1 text-sm leading-6 text-text-secondary">
            {product.description}
          </p>
        )}

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Precio */}
        <div className="mt-auto">
          <div className="flex items-end justify-between gap-3 rounded-2xl bg-cream/70 px-4 py-3">
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.24em] text-coffee/70">
                Valor
              </p>

              <p className="text-3xl font-black leading-none tracking-tight text-coffee">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Agregar ${product.name} al carrito`}
              disabled={!isAvailable}
              className={`rounded-full px-4 py-3 text-sm font-black shadow-sm transition-all duration-300 active:scale-[0.98] ${
                addedToCart
                  ? "bg-green-600 text-white shadow-md"
                  : isAvailable
                    ? "bg-coffee text-white shadow-[0_12px_24px_rgba(93,58,31,0.2)] hover:bg-coffee-dark hover:shadow-[0_16px_30px_rgba(93,58,31,0.24)]"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
              }`}
            >
              {addedToCart ? "Añadido" : "Agregar"}
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              aria-label={`Consultar por WhatsApp sobre ${product.name}`}
              className="rounded-full border border-green-600 bg-white px-4 py-3 text-sm font-black text-green-700 shadow-sm transition-all duration-300 hover:bg-green-50 active:scale-[0.98]"
            >
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
