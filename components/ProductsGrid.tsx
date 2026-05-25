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
      <div className="flex items-center justify-center py-20">
        <div className="w-full space-y-6">
          <div className="mx-auto h-8 w-40 animate-pulse rounded-full bg-coffee/20" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-coffee/10"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <p className="font-semibold text-red-700">Error al cargar productos</p>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white px-6 py-16 text-center">
        <p className="font-medium text-text-dark">No hay productos disponibles</p>
        <p className="mt-2 text-sm text-text-secondary">
          Agrega productos desde el panel administrador.
        </p>
      </div>
    );
  }

  return (
  <section
  id="productos"
  className="relative overflow-hidden bg-[#faf6f0] px-5 py-8 sm:px-8 lg:px-10"
>
  <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-[#c89b6b]/10 blur-3xl" />
  <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-[#8a5a39]/10 blur-3xl" />

  <div className="relative mx-auto max-w-7xl space-y-6">
    {/* Encabezado catálogo */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd2] bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-[#8a5a39]" />
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a87555]">
            Catálogo artesanal
        </p>
        </div>

        <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-[#17241e] sm:text-[2.35rem]">
        Productos de mimbre hechos a mano
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65736a] sm:text-[15px]">
        Piezas artesanales seleccionadas para decorar, organizar y entregar calidez natural a tu hogar.
        </p>
        </div>

        <div className="w-fit rounded-2xl border border-[#eadfd2] bg-white/80 px-4 py-3 text-sm font-bold text-[#6f5b4e] shadow-sm backdrop-blur">
        <span className="text-[#8a5a39]">{filteredProducts.length}</span> de{" "}
        <span className="text-[#8a5a39]">{products.length}</span> productos
        </div>
    </div>

    {/* Filtros */}
    {!featured && (
       <div className="rounded-[1.75rem] border border-[#eadfd2] bg-white/80 p-4 shadow-[0_14px_35px_rgba(70,45,25,0.06)] backdrop-blur">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full border border-[#eadfd2] bg-white px-5 py-2.5 text-[#17241e] outline-none transition focus:border-[#8a5a39] focus:ring-4 focus:ring-[#8a5a39]/10"
            />

            <label htmlFor="sort-products" className="sr-only">
            Ordenar productos
            </label>

            <select
            id="sort-products"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="rounded-full border border-[#eadfd2] bg-white px-5 py-2.5 text-[#17241e] outline-none transition focus:border-[#8a5a39] focus:ring-4 focus:ring-[#8a5a39]/10"
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
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === null
                    ? "bg-[#8a5a39] text-white"
                    : "border border-[#eadfd2] bg-white text-[#8a5a39] hover:bg-[#f7f1e8]"
                }`}
            >
                Todas
            </button>

            {categories.map((category) => (
                <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                    ? "bg-[#8a5a39] text-white"
                    : "border border-[#eadfd2] bg-white text-[#8a5a39] hover:bg-[#f7f1e8]"
                }`}
                >
                {category}
                </button>
            ))}
            </div>
        )}
        </div>
    )}

    {/* Grid productos */}
    {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
    ) : (
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white px-6 py-16 text-center shadow-sm">
        <p className="font-bold text-[#17241e]">No se encontraron productos</p>
        <p className="mt-2 text-sm text-[#65736a]">
            Prueba cambiando la búsqueda o la categoría.
        </p>
        </div>
    )}
    </div>
    </section>
  );
}
