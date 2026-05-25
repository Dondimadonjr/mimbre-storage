"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/format";
import AdminProductForm from "@/components/AdminProductForm";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";

type Tab = "productos" | "ordenes";

export default function AdminPage() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("productos");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const productosDisponibles = useMemo(
    () => products.filter((p) => p.available).length,
    [products]
  );

  const productosStockBajo = useMemo(
    () => products.filter((p) => Number(p.stock) <= 5).length,
    [products]
  );

  const totalOrdenes = orders.length;

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading products:", error);
      alert("No se pudieron cargar los productos.");
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

 useEffect(() => {
  if (checkingAuth) return;

  const timer = window.setTimeout(() => {
    if (tab === "productos") {
      void loadProducts();
    }

    if (tab === "ordenes") {
      void loadOrders();
    }
  }, 0);

  return () => window.clearTimeout(timer);
}, [tab, checkingAuth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmar = confirm(
      "¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto.");
      return;
    }

    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const handleOpenNewProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setSelectedProduct(null);
    await loadProducts();
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-cream px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-border bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold text-coffee">
              Verificando acceso...
            </p>
            <h1 className="mt-2 text-2xl font-bold text-text-dark">
              Cargando panel administrador
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-text-dark text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coffee font-bold shadow-md">
              M
            </div>

            <div>
              <h1 className="text-xl font-bold leading-tight">Panel Admin</h1>
              <p className="text-xs text-white/60">Gestión de Mimbre Store</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.98]"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-text-secondary">
              Productos
            </p>
            <p className="mt-2 text-3xl font-bold text-text-dark">
              {products.length}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-text-secondary">
              Disponibles
            </p>
            <p className="mt-2 text-3xl font-bold text-green-700">
              {productosDisponibles}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-text-secondary">
              Stock bajo
            </p>
            <p className="mt-2 text-3xl font-bold text-yellow-700">
              {productosStockBajo}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-text-secondary">Órdenes</p>
            <p className="mt-2 text-3xl font-bold text-coffee">
              {totalOrdenes}
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-border bg-white p-3 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex rounded-2xl bg-cream p-1">
              <button
                onClick={() => {
                  setTab("productos");
                  setShowForm(false);
                  setSelectedProduct(null);
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  tab === "productos"
                    ? "bg-white text-coffee shadow-sm"
                    : "text-text-secondary hover:text-text-dark"
                }`}
              >
                Productos
              </button>

              <button
                onClick={() => {
                  setTab("ordenes");
                  setShowForm(false);
                  setSelectedProduct(null);
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  tab === "ordenes"
                    ? "bg-white text-coffee shadow-sm"
                    : "text-text-secondary hover:text-text-dark"
                }`}
              >
                Órdenes
              </button>
            </div>

            {tab === "productos" && !showForm && (
              <button
                onClick={handleOpenNewProduct}
                className="rounded-2xl bg-coffee px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-coffee-dark active:scale-[0.98]"
              >
                + Nuevo producto
              </button>
            )}
          </div>
        </section>

        {tab === "productos" && (
          <section>
            {showForm ? (
              <div className="max-w-3xl">
                <button
                  onClick={handleCloseForm}
                  className="mb-5 inline-flex items-center rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-coffee shadow-sm transition hover:bg-cream"
                >
                  ← Volver a productos
                </button>

                <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-coffee">
                      {selectedProduct ? "Editar producto" : "Nuevo producto"}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-text-dark">
                      {selectedProduct
                        ? "Actualiza los datos del producto"
                        : "Agrega un producto al catálogo"}
                    </h2>
                  </div>

                  <AdminProductForm
                    product={selectedProduct || undefined}
                    onSuccess={handleFormSuccess}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-white shadow-soft">
                <div className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-text-dark">
                      Productos del catálogo
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Administra precios, stock y disponibilidad.
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="p-8 text-text-secondary">Cargando...</div>
                ) : products.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-lg font-bold text-text-dark">
                      Todavía no hay productos
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">
                      Crea el primer producto para comenzar a mostrarlo en la
                      tienda.
                    </p>
                    <button
                      onClick={handleOpenNewProduct}
                      className="mt-5 rounded-2xl bg-coffee px-5 py-3 text-sm font-bold text-white transition hover:bg-coffee-dark"
                    >
                      + Crear producto
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                      <thead className="bg-cream">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                            Producto
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                            Precio
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                            Stock
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                            Estado
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-text-secondary">
                            Acciones
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="transition hover:bg-cream/60"
                          >
                            <td className="px-6 py-5">
                              <div>
                                <p className="font-bold text-text-dark">
                                  {product.name}
                                </p>
                                <p className="mt-1 text-sm text-text-secondary">
                                  {product.category || "Sin categoría"}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-5 font-semibold text-text-dark">
                              {formatCurrency(product.price)}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`font-semibold ${
                                  Number(product.stock) <= 5
                                    ? "text-yellow-700"
                                    : "text-text-dark"
                                }`}
                              >
                                {product.stock}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                  product.available
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {product.available
                                  ? "Disponible"
                                  : "Agotado"}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-coffee transition hover:bg-cream"
                                >
                                  Editar
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {tab === "ordenes" && (
          <section className="rounded-3xl border border-border bg-white shadow-soft">
            <div className="border-b border-border p-5">
              <h2 className="text-xl font-bold text-text-dark">
                Órdenes recibidas
              </h2>
              <p className="text-sm text-text-secondary">
                Revisa los pedidos generados desde el checkout.
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-text-secondary">Cargando...</div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-lg font-bold text-text-dark">
                  No hay órdenes todavía
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  Cuando un cliente haga una compra, aparecerá en esta sección.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-cream">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                        Orden
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                        Fecha
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} className="transition hover:bg-cream/60">
                        <td className="px-6 py-5 font-mono text-sm text-text-dark">
                          #{order.id.slice(0, 8)}
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold text-text-dark">
                            {order.customer_name}
                          </p>
                          <p className="mt-1 text-sm text-text-secondary">
                            {order.customer_email}
                          </p>
                        </td>

                        <td className="px-6 py-5 font-bold text-coffee">
                          {formatCurrency(order.total)}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              order.status === "pagado"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pendiente"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-text-secondary">
                          {new Date(order.created_at).toLocaleDateString(
                            "es-CL"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
