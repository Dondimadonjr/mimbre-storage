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
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-coffee/30 hover:shadow-[0_28px_70px_rgba(93,58,31,0.16)] sm:rounded-[28px]">
      {/* Imagen */}
      <Link href={`/productos/${product.id}`} className="focus-ring block">
        <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-cream via-white to-coffee/10">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-3.5 drop-shadow-[0_14px_20px_rgba(93,58,31,0.13)] transition-transform duration-700 group-hover:scale-[1.035] sm:p-8 sm:drop-shadow-[0_18px_26px_rgba(93,58,31,0.16)]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl">🧺</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_38%,rgba(93,58,31,0.08)_100%)]" />

          <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 translate-y-2 rounded-full border border-border bg-white/95 px-4 py-2 text-xs font-bold text-coffee opacity-0 shadow-soft backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-4 sm:block sm:px-5">
            Ver detalle →
          </div>

          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-coffee px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-[0_10px_22px_rgba(93,58,31,0.22)] transition duration-300 group-hover:-translate-y-0.5 sm:left-4 sm:top-4 sm:px-3 sm:text-[10px]">
              Destacado
            </span>
          )}

          <span
            className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm transition duration-300 group-hover:-translate-y-0.5 sm:right-4 sm:top-4 sm:px-3 sm:text-[10px] ${
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
      <div className="flex flex-1 flex-col p-3 sm:p-6">
        {/* Meta */}
        <div className="mb-2 flex min-h-6 flex-wrap items-center gap-1.5 sm:mb-4 sm:min-h-7 sm:gap-2">
          {product.category && (
            <span className="rounded-full border border-coffee/15 bg-cream px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-coffee sm:px-3 sm:text-[10px] sm:tracking-[0.2em]">
              {product.category}
            </span>
          )}

          <span className="rounded-full border border-border bg-white px-2.5 py-1 text-[9px] font-semibold text-text-secondary sm:px-3 sm:text-[10px]">
            Hecho a mano
          </span>
        </div>

        {/* Nombre */}
        <Link href={`/productos/${product.id}`} className="focus-ring block rounded-xl">
          <h3 className="mb-1 line-clamp-2 text-[1.05rem] font-black leading-snug text-text-dark transition-colors group-hover:text-coffee sm:mb-3 sm:text-xl">
            {product.name}
          </h3>
        </Link>

        {/* Descripción */}
        {product.description && (
          <p className="line-clamp-2 flex-1 text-[0.82rem] leading-5 text-text-secondary sm:min-h-12 sm:text-sm sm:leading-6">
            {product.description}
          </p>
        )}

        <div className="my-2.5 h-px bg-linear-to-r from-transparent via-border to-transparent sm:my-5" />

        {/* Precio */}
        <div className="mt-auto">
          <div className="flex items-end justify-between gap-3 rounded-2xl bg-cream/70 px-3 py-2 sm:px-4 sm:py-3">
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.24em] text-coffee/70">
                Valor
              </p>

              <p className="text-[1.55rem] font-black leading-none tracking-tight text-coffee sm:text-3xl">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Agregar ${product.name} al carrito`}
              disabled={!isAvailable}
              className={`focus-ring rounded-full px-3 py-2.5 text-sm font-black shadow-sm transition-all duration-300 active:scale-[0.98] sm:px-4 sm:py-3 ${
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
              className="focus-ring rounded-full border border-green-600 bg-white px-3 py-2.5 text-sm font-black text-green-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-md active:scale-[0.98] sm:px-4 sm:py-3"
            >
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
