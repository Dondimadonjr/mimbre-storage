"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
  featured?: boolean;
}

type SortBy = "name" | "price-asc" | "price-desc";

export default function ProductsGrid({ featured = false }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [categories, setCategories] = useState<string[]>([]);

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
        className="relative overflow-hidden bg-cream px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-28 animate-pulse rounded-[2rem] bg-white/75" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[460px] animate-pulse rounded-[28px] border border-border bg-white/80 shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="productos" className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-200 bg-red-50 px-6 py-10 text-center shadow-sm">
          <p className="font-black text-red-700">Error al cargar productos</p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="productos" className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-white px-6 py-16 text-center shadow-soft">
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
      className="relative overflow-hidden bg-cream px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(139,94,60,0.08),transparent_28%),radial-gradient(circle_at_92%_24%,rgba(216,180,138,0.18),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-border bg-white/82 p-5 shadow-soft backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-coffee/15 bg-cream px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-coffee">
                <span className="h-2 w-2 rounded-full bg-coffee" />
                Catálogo artesanal
              </span>

              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-text-dark sm:text-4xl">
                Productos de mimbre hechos a mano
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                Piezas seleccionadas para decorar, organizar y entregar calidez
                natural a tu hogar.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-cream/70 px-4 py-3 text-sm font-bold text-text-secondary">
              <span className="text-coffee">{filteredProducts.length}</span> de{" "}
              <span className="text-coffee">{products.length}</span> productos
            </div>
          </div>

          {!featured && (
            <div className="mt-6 border-t border-border pt-5">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-full border border-border bg-white px-5 py-3 text-text-dark shadow-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                />

                <label htmlFor="sort-products" className="sr-only">
                  Ordenar productos
                </label>

                <select
                  id="sort-products"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortBy)}
                  className="rounded-full border border-border bg-white px-5 py-3 text-text-dark shadow-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                >
                  <option value="name">Ordenar por nombre</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                </select>
              </div>

              {categories.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                      selectedCategory === null
                        ? "bg-coffee text-white shadow-sm"
                        : "border border-border bg-white text-coffee hover:bg-cream"
                    }`}
                  >
                    Todas
                  </button>

                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                        selectedCategory === category
                          ? "bg-coffee text-white shadow-sm"
                          : "border border-border bg-white text-coffee hover:bg-cream"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-border bg-white px-6 py-16 text-center shadow-soft">
            <p className="font-black text-text-dark">No se encontraron productos</p>
            <p className="mt-2 text-sm text-text-secondary">
              Prueba cambiando la búsqueda o la categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
