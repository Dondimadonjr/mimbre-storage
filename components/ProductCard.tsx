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
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#c8a87a]/25 bg-white shadow-[0_12px_32px_rgba(100,60,20,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c8a87a]/40 hover:shadow-[0_22px_55px_rgba(100,60,20,0.12)]">
      {/* Imagen */}
      <Link href={`/productos/${product.id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#fdf6ee] to-[#f3e6d0]">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-8 drop-shadow-[0_12px_20px_rgba(100,60,20,0.15)] transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl">🧺</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,transparent_40%,rgba(120,80,40,0.06)_100%)]" />

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 rounded-full bg-white/95 px-5 py-2 text-xs font-semibold text-[#6b3f1f] opacity-0 shadow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Ver detalle →
          </div>

          {product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-[#6b3f1f] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#fdf0e0] shadow-[0_10px_22px_rgba(70,45,25,0.22)]">
              Destacado
            </span>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        {/* Meta */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {product.category && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a0663a]">
              {product.category}
            </span>
          )}

          {product.category && <span className="text-[#c8a87a]/60">·</span>}

          {isAvailable ? (
            <span className="rounded-full border border-green-200 bg-[#edf7ef] px-2 py-0.5 text-[10px] font-medium text-green-700">
              En stock
            </span>
          ) : (
            <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">
              Agotado
            </span>
          )}

          <span className="rounded-full border border-[#c8a87a]/25 bg-[#fdf2e8] px-2 py-0.5 text-[10px] font-medium text-[#a0663a]">
            Hecho a mano
          </span>
        </div>

        {/* Nombre */}
        <Link href={`/productos/${product.id}`} className="block">
          <h3 className="mb-2 line-clamp-2 text-[1.18rem] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#6b3f1f]">
            {product.name}
          </h3>
        </Link>

        {/* Descripción */}
        {product.description && (
          <p className="line-clamp-3 flex-1 text-[13.5px] leading-[1.7] text-gray-500">
            {product.description}
          </p>
        )}

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#c8a87a]/25 to-transparent" />

        {/* Precio */}

        <div className="mt-auto">
        <div className="flex items-end justify-between gap-3">
            <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.24em] text-[#a0663a]">
                Valor
            </p>

            <p className="text-[1.75rem] font-black leading-none tracking-tight text-[#6b3f1f]">
                {formatCurrency(product.price)}
            </p>
            </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
            <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`rounded-full px-4 py-3 text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
                addedToCart
                ? "bg-green-600 text-white shadow-md"
                : isAvailable
                ? "bg-[#6b3f1f] text-[#fdf0e0] shadow-[0_8px_18px_rgba(100,60,20,0.16)] hover:bg-[#582f12]"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
            >
            {addedToCart ? "Añadido" : "Agregar"}
            </button>

            <button
            type="button"
            onClick={handleWhatsApp}
            className="rounded-full bg-[#0ea54a] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(22,163,74,0.13)] transition-all duration-300 hover:bg-[#0c8e3f] active:scale-[0.98]"
            >
            WhatsApp
            </button>
        </div>
        </div>
      </div>
    </article>
  );
}
