"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import SelectPro, { type SelectProOption } from "@/components/ui/SelectPro";

interface ProductsGridProps {
  featured?: boolean;
}

type SortBy = "name" | "price-asc" | "price-desc";

const sortOptions: SelectProOption[] = [
  { label: "Ordenar por nombre", value: "name" },
  { label: "Precio: menor a mayor", value: "price-asc" },
  { label: "Precio: mayor a menor", value: "price-desc" },
];

export default function ProductsGrid({ featured = false }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const handleCategorySelected = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSelectedCategory(customEvent.detail);
    };

    window.addEventListener("category:selected", handleCategorySelected);

    return () => {
      window.removeEventListener("category:selected", handleCategorySelected);
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("products")
          .select("*")
          .eq("available", true)
          .order("created_at", { ascending: false });

        if (featured) {
          query = query.eq("featured", true);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          console.error("Supabase error:", supabaseError);
          throw new Error(supabaseError.message);
        }

        const safeProducts = data ?? [];
        setProducts(safeProducts);

        const uniqueCategories = Array.from(
          new Set(
            safeProducts
              .map((product) => product.category)
              .filter((category): category is string => Boolean(category))
          )
        );

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar productos"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [featured]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description?.toLowerCase().includes(normalizedSearch);

        const matchesCategory =
          !selectedCategory || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <section
        id="productos"
        className="relative scroll-mt-28 overflow-hidden bg-cream px-4 py-14 sm:px-6 md:scroll-mt-32 lg:px-8 lg:scroll-mt-36"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-28 animate-pulse rounded-4xl bg-white/75" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-115 animate-pulse rounded-[28px] border border-border bg-white/80 shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="productos"
        className="scroll-mt-28 bg-cream px-4 py-14 sm:px-6 md:scroll-mt-32 lg:px-8 lg:scroll-mt-36"
      >
        <div className="mx-auto max-w-3xl rounded-4xl border border-red-200 bg-red-50 px-6 py-10 text-center shadow-sm">
          <p className="font-black text-red-700">Error al cargar productos</p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section
        id="productos"
        className="scroll-mt-28 bg-cream px-4 py-14 sm:px-6 md:scroll-mt-32 lg:px-8 lg:scroll-mt-36"
      >
        <div className="mx-auto max-w-3xl rounded-4xl border border-border bg-white px-6 py-16 text-center shadow-soft">
          <p className="font-black text-text-dark">No hay productos disponibles</p>
          <p className="mt-2 text-sm text-text-secondary">
            Agrega productos desde el panel administrador.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="productos"
      className="relative scroll-mt-32 overflow-hidden bg-cream px-4 py-10 sm:px-6 md:scroll-mt-36 lg:px-8 lg:scroll-mt-40 lg:py-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(139,94,60,0.07),transparent_30%),radial-gradient(circle_at_92%_20%,rgba(216,180,138,0.14),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative z-40 mb-6 overflow-visible rounded-[2rem] border border-border bg-white/88 p-4 shadow-[0_18px_58px_rgba(49,39,31,0.075)] backdrop-blur sm:p-5 lg:p-6">
          <div className="grid gap-5">
            {/* Título */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-coffee/15 bg-cream px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-coffee">
                  <span className="h-2 w-2 rounded-full bg-coffee" />
                  Catálogo artesanal
                </span>

                <span className="inline-flex w-fit items-center rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-text-secondary">
                  <span className="text-coffee">{filteredProducts.length}</span>
                  <span className="mx-1">de</span>
                  <span className="text-coffee">{products.length}</span>
                  <span className="ml-1">productos</span>
                </span>
              </div>

              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-[1.06] tracking-[-0.035em] text-text-dark sm:text-[2.35rem]">
                Productos de mimbre hechos a mano
              </h2>

              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                Piezas seleccionadas para decorar, organizar y entregar calidez
                natural a tu hogar.
              </p>
            </div>

            {/* Panel compacto */}
            {!featured && (
              <div className="rounded-[1.35rem] border border-border bg-cream/42 p-3 shadow-inner">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                  <label className="block min-w-0">
                    <span className="mb-2 block text-[0.68rem] font-black uppercase tracking-[0.22em] text-coffee">
                      Buscar
                    </span>
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="h-10 w-full rounded-2xl border border-border bg-white px-4 text-sm text-text-dark shadow-sm outline-none transition duration-300 placeholder:text-text-secondary/55 hover:border-coffee/25 focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                    />
                  </label>

                  <SelectPro
                    label="Ordenar"
                    value={sortBy}
                    options={sortOptions}
                    onChange={(nextValue) => setSortBy(nextValue as SortBy)}
                    className="relative z-[90] min-w-0"
                    fullWidth
                  />
                </div>
              </div>
            )}
          </div>

          {!featured && categories.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition duration-300 active:scale-[0.98] ${
                    selectedCategory === null
                      ? "bg-coffee text-white shadow-[0_10px_24px_rgba(139,94,60,0.22)]"
                      : "border border-border bg-white text-coffee hover:-translate-y-0.5 hover:border-coffee/25 hover:bg-cream"
                  }`}
                >
                  Todas
                </button>

                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition duration-300 active:scale-[0.98] ${
                      selectedCategory === category
                        ? "bg-coffee text-white shadow-[0_10px_24px_rgba(139,94,60,0.22)]"
                        : "border border-border bg-white text-coffee hover:-translate-y-0.5 hover:border-coffee/25 hover:bg-cream"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="relative z-0 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-4xl border border-border bg-white px-6 py-16 text-center shadow-soft">
            <p className="font-black text-text-dark">
              No se encontraron productos
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Prueba cambiando la búsqueda o la categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
