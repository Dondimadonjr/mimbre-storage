"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/format";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

type ProductDetailClientProps = {
  id: string;
};

const benefits = [
  {
    title: "Hecho a mano",
    description: "Cada pieza conserva el detalle del oficio artesanal.",
    icon: (
      <path
        d="M7 11.5 12 6l5 5.5M8.5 13.5 12 10l3.5 3.5M6 17h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Fibras naturales",
    description: "Materiales cálidos seleccionados para el hogar.",
    icon: (
      <path
        d="M19 5c-7.5.4-12 4.6-12 10.4 0 2.1 1.4 3.6 3.5 3.6C15.9 19 19.4 13 19 5Z M7.5 17.5c2.7-4.6 6-7.3 10-9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Compra coordinada",
    description: "Te contactamos para confirmar entrega o retiro.",
    icon: (
      <path
        d="M4 7h10v8H4zM14 10h3l3 3v2h-6zM7 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Asesoría cercana",
    description: "Resolvemos dudas por WhatsApp antes de comprar.",
    icon: (
      <path
        d="M5 12.5A7 7 0 0 1 16.9 7.6a7 7 0 0 1-8.5 10.9L5 19l.7-3.1A7 7 0 0 1 5 12.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const stock = product?.stock ?? 0;
  const maxQuantity = Math.max(1, stock);
  const isPurchasable = Boolean(product?.available && stock > 0);
  const selectedQuantity = Math.min(quantity, maxQuantity);
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || "56972086522";

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        const loadedProduct = data as Product;
        setProduct(loadedProduct);

        if (!loadedProduct.category) {
          setRelatedProducts([]);
          return;
        }

        const { data: relatedData, error: relatedError } = await supabase
          .from("products")
          .select("*")
          .eq("available", true)
          .eq("category", loadedProduct.category)
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (relatedError) {
          console.error("Error loading related products:", relatedError);
          setRelatedProducts([]);
        } else {
          setRelatedProducts((relatedData as Product[]) || []);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !isPurchasable) return;

    const safeQuantity = Math.min(selectedQuantity, stock);

    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: safeQuantity,
      image_url: product.image_url,
      stock,
      available: product.available,
    });

    setAddedToCart(true);
    window.dispatchEvent(new CustomEvent("cart-updated"));
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 h-9 w-28 animate-pulse rounded-full bg-white/80" />
          <div className="grid gap-4 rounded-4xl border border-border bg-white/80 p-3.5 shadow-soft sm:p-6 lg:grid-cols-2 lg:gap-8">
            <div className="aspect-4/3 animate-pulse rounded-[1.75rem] bg-coffee/12 lg:aspect-auto lg:min-h-130" />
            <div className="space-y-4 p-1 sm:p-3">
              <div className="h-7 w-32 animate-pulse rounded-full bg-cream" />
              <div className="h-10 w-4/5 animate-pulse rounded-2xl bg-cream" />
              <div className="h-24 animate-pulse rounded-3xl bg-cream" />
              <div className="h-28 animate-pulse rounded-3xl bg-cream" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-4xl border border-border bg-white p-8 text-center shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-coffee">
            Producto
          </p>
          <h1 className="mt-3 text-3xl font-black text-text-dark">
            Producto no encontrado
          </h1>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-coffee px-5 py-3 text-sm font-black text-white transition duration-300 hover:bg-coffee-dark"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const stockLabel = !isPurchasable
    ? "Sin stock"
    : stock <= 5
      ? "Últimas unidades"
      : "Disponible";
  const stockClass = !isPurchasable
    ? "border-red-200 bg-red-50 text-red-600"
    : stock <= 5
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-green-200 bg-green-50 text-green-700";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Me interesa ${product.name} - ${formatCurrency(product.price)}`
  )}`;

  return (
    <main className="section-reveal overflow-hidden bg-cream px-4 pb-10 pt-4 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="focus-ring mb-3 inline-flex items-center rounded-full border border-border bg-white/80 px-3.5 py-2 text-sm font-black text-coffee shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-coffee-dark active:scale-[0.98] sm:mb-5"
        >
          ← Volver
        </Link>

        <section className="relative overflow-hidden rounded-4xl border border-border bg-white/90 p-3 shadow-[0_22px_70px_rgba(49,39,31,0.09)] backdrop-blur sm:rounded-[2.5rem] sm:p-5 lg:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-coffee/8 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-[#1f2e25]/8 blur-3xl"
          />

          <div className="relative grid gap-5 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8">
            <div className="group relative min-w-0 overflow-hidden rounded-[1.65rem] border border-border bg-linear-to-br from-white via-cream/45 to-coffee/10 p-3 shadow-inner sm:rounded-4xl sm:p-5">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-[1.35rem] bg-white/72 sm:rounded-[1.65rem] lg:aspect-auto lg:min-h-140">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4 drop-shadow-[0_20px_30px_rgba(93,58,31,0.14)] transition duration-700 group-hover:scale-[1.025] sm:p-8 lg:p-10"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-6xl text-coffee/30">+</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <span className="rounded-full border border-coffee/15 bg-cream px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.22em] text-coffee">
                    {product.category}
                  </span>
                )}
                <span
                  className={`rounded-full border px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em] ${stockClass}`}
                >
                  {stockLabel}
                </span>
              </div>

              <h1 className="mt-4 text-[2rem] font-black leading-[1.04] tracking-[-0.04em] text-text-dark sm:text-5xl lg:text-[3.35rem]">
                {product.name}
              </h1>

              {product.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:mt-5 sm:text-lg sm:leading-8">
                  {product.description}
                </p>
              )}

              <div className="my-5 h-px bg-linear-to-r from-border via-border to-transparent sm:my-7" />

              <div className="rounded-3xl border border-border bg-cream/72 p-4 sm:rounded-[1.75rem] sm:p-5">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-coffee/75">
                  Valor
                </p>
                <p className="mt-1 text-[2.35rem] font-black leading-none tracking-[-0.04em] text-coffee sm:text-5xl">
                  {formatCurrency(product.price)}
                </p>
                {isPurchasable && (
                  <p className="mt-2 text-sm font-semibold text-text-secondary">
                    Stock disponible: {stock}
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-3xl border border-border bg-white p-3.5 shadow-sm sm:mt-5 sm:rounded-[1.75rem] sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-text-dark">
                    Cantidad
                  </span>
                  <div className="flex items-center overflow-hidden rounded-full border border-border bg-cream">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(Math.max(1, selectedQuantity - 1))
                      }
                      disabled={!isPurchasable}
                      className="focus-ring grid h-10 w-10 place-items-center text-lg font-black text-coffee transition hover:bg-white active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center text-sm font-black text-text-dark">
                      {selectedQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((currentQuantity) =>
                          Math.min(maxQuantity, currentQuantity + 1)
                        )
                      }
                      disabled={!isPurchasable || selectedQuantity >= stock}
                      className="focus-ring grid h-10 w-10 place-items-center text-lg font-black text-coffee transition hover:bg-white active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isPurchasable}
                    className={`focus-ring rounded-full px-5 py-3.5 text-sm font-black text-white shadow-sm transition-all duration-300 hover:translate-y-0.5 active:scale-[0.98] ${
                      addedToCart
                        ? "bg-green-600 shadow-md"
                        : isPurchasable
                          ? "bg-coffee shadow-[0_14px_28px_rgba(93,58,31,0.2)] hover:bg-coffee-dark"
                          : "cursor-not-allowed bg-gray-400"
                    }`}
                  >
                    {addedToCart ? "✓ Agregado al carrito" : "Agregar al Carrito"}
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring rounded-full border border-green-600 bg-white px-5 py-3.5 text-center text-sm font-black text-green-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-md active:scale-[0.98]"
                  >
                    Consultar por WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="group rounded-2xl border border-border bg-cream/55 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-coffee/25 hover:bg-white"
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-coffee/15 bg-white text-coffee transition duration-300 group-hover:bg-coffee group-hover:text-white">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                          aria-hidden="true"
                        >
                          {benefit.icon}
                        </svg>
                      </span>
                      <p className="text-sm font-black text-text-dark">
                        {benefit.title}
                      </p>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="pt-10 sm:pt-16">
            <div className="mb-5 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-coffee">
                  También te puede gustar
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-text-dark sm:text-4xl">
                  Productos relacionados
                </h2>
              </div>
              {product.category && (
                <p className="text-sm font-semibold text-text-secondary">
                  Categoría:{" "}
                  <span className="font-black text-coffee">{product.category}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
