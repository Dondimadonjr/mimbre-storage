"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/format";
import AdminProductForm from "@/components/AdminProductForm";
import type { Product } from "@/types/product";
import type { Order, OrderItem } from "@/types/order";
import SelectPro, { type SelectProOption } from "@/components/ui/SelectPro";

type Tab = "productos" | "ordenes";
type ProductStatusFilter = "todos" | "disponibles" | "no-disponibles" | "stock-bajo";
type ProductSort = "nombre" | "precio" | "stock";
type OrderStatusFilter = "todas" | "pagado" | "pendiente" | "rechazado" | "cancelado";

const LOW_STOCK_LIMIT = 5;

const productStatusOptions: SelectProOption[] = [
  { label: "Todos", value: "todos" },
  { label: "Disponibles", value: "disponibles" },
  { label: "No disponibles", value: "no-disponibles" },
  { label: "Stock bajo", value: "stock-bajo" },
];

const productSortOptions: SelectProOption[] = [
  { label: "Nombre", value: "nombre" },
  { label: "Precio", value: "precio" },
  { label: "Stock", value: "stock" },
];

const orderStatusOptions: SelectProOption[] = [
  { label: "Todas", value: "todas" },
  { label: "Pagadas", value: "pagado" },
  { label: "Pendientes", value: "pendiente" },
  { label: "Rechazadas", value: "rechazado" },
  { label: "Canceladas", value: "cancelado" },
];

function normalizeText(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase();
}

function getOrderBadgeClass(status: Order["status"]) {
  if (status === "pagado") {
    return "bg-green-100 text-green-700 ring-green-200";
  }

  if (status === "pendiente") {
    return "bg-yellow-100 text-yellow-800 ring-yellow-200";
  }

  return "bg-red-100 text-red-700 ring-red-200";
}

function getProductBadgeClass(product: Product) {
  if (!product.available) {
    return "bg-red-100 text-red-700 ring-red-200";
  }

  if (Number(product.stock) <= 0) {
    return "bg-yellow-100 text-yellow-800 ring-yellow-200";
  }

  return "bg-green-100 text-green-700 ring-green-200";
}

function getProductStatusLabel(product: Product) {
  if (!product.available) return "No disponible";
  if (Number(product.stock) <= 0) return "Sin stock";
  return "Disponible";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CL");
}

function normalizePhoneForWhatsApp(phone: string) {
  return phone.replace(/[\s+\-()]/g, "");
}

function buildOrderAddress(order: Order) {
  return [order.customer_address, order.customer_commune, order.customer_region]
    .filter(Boolean)
    .join(", ");
}

function buildOrderSummary(order: Order, items: OrderItem[]) {
  const address = buildOrderAddress(order);
  const productsText =
    items.length > 0
      ? items
          .map(
            (item) =>
              `* ${item.product_name} x ${item.quantity} - ${formatCurrency(
                item.subtotal
              )}`
          )
          .join("\n")
      : "* No hay productos asociados a esta orden.";

  return [
    `Orden #${order.id.slice(0, 8)}`,
    `Estado: ${order.status}`,
    `Cliente: ${order.customer_name}`,
    `Email: ${order.customer_email}`,
    order.customer_phone ? `Telefono: ${order.customer_phone}` : null,
    address ? `Direccion: ${address}` : null,
    "Productos:",
    productsText,
    `Total: ${formatCurrency(order.total)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildOrderMessage(order: Order, items: OrderItem[]) {
  return encodeURIComponent(buildOrderSummary(order, items));
}

export default function AdminDashboardClient() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("productos");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productStatus, setProductStatus] =
    useState<ProductStatusFilter>("todos");
  const [productCategory, setProductCategory] = useState("todas");
  const [productSort, setProductSort] = useState<ProductSort>("nombre");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatusFilter>("todas");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [loadingOrderItems, setLoadingOrderItems] = useState(false);

  const loadProducts = async () => {
    setLoadingProducts(true);

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

    setLoadingProducts(false);
  };

  const loadOrders = async () => {
    setLoadingOrders(true);

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

    setLoadingOrders(false);
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
      void loadProducts();
      void loadOrders();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [checkingAuth]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products
        .map((product) => product.category)
        .filter((category): category is string => Boolean(category))
    );

    return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = normalizeText(productSearch);

    return products
      .filter((product) => {
        const matchesSearch =
          !search ||
          normalizeText(product.name).includes(search) ||
          normalizeText(product.category).includes(search);

        const matchesStatus =
          productStatus === "todos" ||
          (productStatus === "disponibles" &&
            product.available &&
            Number(product.stock) > 0) ||
          (productStatus === "no-disponibles" && !product.available) ||
          (productStatus === "stock-bajo" &&
            product.available &&
            Number(product.stock) <= LOW_STOCK_LIMIT);

        const matchesCategory =
          productCategory === "todas" || product.category === productCategory;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (productSort === "precio") return Number(b.price) - Number(a.price);
        if (productSort === "stock") return Number(a.stock) - Number(b.stock);
        return a.name.localeCompare(b.name);
      });
  }, [productCategory, productSearch, productSort, productStatus, products]);

  const filteredOrders = useMemo(() => {
    const search = normalizeText(orderSearch).replace(/^#/, "");

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        normalizeText(order.id).includes(search) ||
        normalizeText(order.customer_name).includes(search) ||
        normalizeText(order.customer_email).includes(search);

      const matchesStatus =
        orderStatus === "todas" || order.status === orderStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orderSearch, orderStatus, orders]);

  const metrics = useMemo(() => {
    const paidOrders = orders.filter((order) => order.status === "pagado");

    return {
      totalProducts: products.length,
      availableProducts: products.filter(
        (product) => product.available && Number(product.stock) > 0
      ).length,
      lowStockProducts: products.filter(
        (product) => product.available && Number(product.stock) <= LOW_STOCK_LIMIT
      ).length,
      paidOrders: paidOrders.length,
      pendingOrders: orders.filter((order) => order.status === "pendiente").length,
      totalSold: paidOrders.reduce((total, order) => total + Number(order.total), 0),
    };
  }, [orders, products]);

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

  const handleOpenOrderDetail = async (order: Order) => {
    setSelectedOrder(order);
    setSelectedOrderItems([]);
    setLoadingOrderItems(true);

    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (error) {
      console.error("Error loading order items:", error);
      setSelectedOrderItems([]);
    } else {
      setSelectedOrderItems(data || []);
    }

    setLoadingOrderItems(false);
  };

  const handleCloseOrderDetail = () => {
    setSelectedOrder(null);
    setSelectedOrderItems([]);
    setLoadingOrderItems(false);
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-linear-to-b from-cream via-white to-cream px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-4xl border border-border bg-white/95 p-8 shadow-soft">
            <p className="text-sm font-semibold text-coffee">
              Verificando acceso...
            </p>
            <h1 className="mt-2 text-2xl font-black text-text-dark">
              Cargando panel administrador
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-cream via-white to-cream">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-text-dark/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-coffee font-black shadow-md">
              M
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black leading-tight sm:text-xl">
                Panel Admin
              </h1>
              <p className="truncate text-xs text-white/60">
                Gestión de Raíz y Mimbre
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="shrink-0 rounded-full bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.98] sm:px-5"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-7">
        <section className="mx-auto mb-5 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            label="Productos" 
            value={metrics.totalProducts} 
           />
          <MetricCard
            label="Disponibles"
            value={metrics.availableProducts}
            tone="green"
          />
          <MetricCard
            label="Stock bajo"
            value={metrics.lowStockProducts}
            tone="yellow"
          />
          <MetricCard label="Pagadas" value={metrics.paidOrders} tone="green" />
          <MetricCard
            label="Pendientes"
            value={metrics.pendingOrders}
            tone="yellow"
          />
        </section>

        <section className="mb-5 rounded-3xl border border-border bg-white/95 p-3 shadow-soft">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-2 rounded-2xl bg-cream/80 p-1 sm:inline-grid">
              <button
                onClick={() => {
                  setTab("productos");
                  setShowForm(false);
                  setSelectedProduct(null);
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
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
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  tab === "ordenes"
                    ? "bg-white text-coffee shadow-sm"
                    : "text-text-secondary hover:text-text-dark"
                }`}
              >
                Órdenes
              </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <p className="text-sm font-semibold text-text-secondary">
                {tab === "productos"
                  ? `${filteredProducts.length} de ${products.length} productos`
                  : `${filteredOrders.length} de ${orders.length} órdenes`}
              </p>

              {tab === "productos" && !showForm && (
                <button
                  onClick={handleOpenNewProduct}
                  className="rounded-full bg-coffee px-5 py-3 text-sm font-bold text-white shadow-lg shadow-coffee/20 transition hover:-translate-y-0.5 hover:bg-coffee-dark active:scale-[0.98]"
                >
                  + Nuevo producto
                </button>
              )}
            </div>
          </div>
        </section>

        {tab === "productos" && (
          <section>
            {showForm ? (
              <div className="max-w-5xl scroll-mt-24">
                <button
                  onClick={handleCloseForm}
                  className="mb-5 inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-coffee shadow-sm transition hover:bg-cream"
                >
                  ← Volver a productos
                </button>

                <div className="rounded-4xl border border-border bg-white/95 p-5 shadow-soft sm:p-6">
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-coffee">
                      {selectedProduct ? "Editar producto" : "Nuevo producto"}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-text-dark">
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
              <div className="overflow-visible rounded-4xl border border-border bg-white/95 shadow-soft">
                <div className="border-b border-border bg-cream/50 p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                      <h2 className="text-xl font-black text-text-dark">
                        Productos del catálogo
                      </h2>
                      <p className="text-sm text-text-secondary">
                        Administra precios, stock y disponibilidad.
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[220px_160px_170px_140px]">
                      <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Buscar
                        </span>
                        <input
                          type="search"
                          value={productSearch}
                          onChange={(event) => setProductSearch(event.target.value)}
                          placeholder="Nombre o categoría"
                          className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Estado
                        </span>
                        <SelectPro
                          value={productStatus}
                          options={productStatusOptions}
                          onChange={(nextValue) =>
                            setProductStatus(nextValue as ProductStatusFilter)
                          }
                          fullWidth
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Categoría
                        </span>
                        <SelectPro
                          value={productCategory}
                          options={[
                            { label: "Todas", value: "todas" },
                            ...categories.map((category) => ({
                              label: category,
                              value: category,
                            })),
                          ]}
                          onChange={setProductCategory}
                          fullWidth
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Ordenar
                        </span>
                        <SelectPro
                          value={productSort}
                          options={productSortOptions}
                          onChange={(nextValue) =>
                            setProductSort(nextValue as ProductSort)
                          }
                          fullWidth
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {loadingProducts ? (
                  <div className="p-8 text-text-secondary">Cargando...</div>
                ) : products.length === 0 ? (
                  <EmptyState
                    title="Todavía no hay productos"
                    description="Crea el primer producto para comenzar a mostrarlo en la tienda."
                    action={
                      <button
                        onClick={handleOpenNewProduct}
                        className="mt-5 rounded-full bg-coffee px-5 py-3 text-sm font-bold text-white shadow-lg shadow-coffee/20 transition hover:bg-coffee-dark"
                      >
                        + Crear producto
                      </button>
                    }
                  />
                ) : filteredProducts.length === 0 ? (
                  <EmptyState
                    title="No hay productos para este filtro"
                    description="Ajusta la búsqueda, estado o categoría para ver más resultados."
                  />
                ) : (
                  <>
                    <div className="hidden overflow-x-auto lg:block">
                      <table className="w-full min-w-245 table-fixed">
                        <thead className="bg-cream/80">
                          <tr>
                            <th className="w-[32%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                              Producto
                            </th>
                            <th className="w-[18%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                              Categoría
                            </th>
                            <th className="w-[14%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                              Precio
                            </th>
                            <th className="w-[10%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                              Stock
                            </th>
                            <th className="w-[13%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                              Estado
                            </th>
                            <th className="w-[13%] px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-text-secondary">
                              Acciones
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                          {filteredProducts.map((product) => (
                            <tr
                              key={product.id}
                              className="transition hover:bg-cream/50"
                            >
                              <td className="px-5 py-4">
                                <p className="line-clamp-2 font-bold leading-snug text-text-dark">
                                  {product.name}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                                  {product.description || "Sin descripción"}
                                </p>
                              </td>

                              <td className="px-5 py-4 text-sm text-text-secondary">
                                {product.category || "Sin categoría"}
                              </td>

                              <td className="px-5 py-4 font-bold text-text-dark">
                                {formatCurrency(product.price)}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`font-bold ${
                                    Number(product.stock) <= LOW_STOCK_LIMIT
                                      ? "text-yellow-700"
                                      : "text-text-dark"
                                  }`}
                                >
                                  {product.stock}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${getProductBadgeClass(
                                    product
                                  )}`}
                                >
                                  {getProductStatusLabel(product)}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="rounded-full border border-border bg-white px-3 py-2 text-sm font-bold text-coffee transition hover:bg-cream"
                                  >
                                    Editar
                                  </button>

                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="rounded-full bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
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

                    <div className="grid gap-3 p-4 lg:hidden">
                      {filteredProducts.map((product) => (
                        <article
                          key={product.id}
                          className="rounded-[1.35rem] border border-border bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 font-black leading-snug text-text-dark">
                                {product.name}
                              </h3>
                              <p className="mt-1 text-sm text-text-secondary">
                                {product.category || "Sin categoría"}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${getProductBadgeClass(
                                product
                              )}`}
                            >
                              {getProductStatusLabel(product)}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-cream/60 p-3 text-sm">
                            <div>
                              <p className="text-text-secondary">Precio</p>
                              <p className="font-black text-coffee">
                                {formatCurrency(product.price)}
                              </p>
                            </div>

                            <div>
                              <p className="text-text-secondary">Stock</p>
                              <p className="font-black text-text-dark">
                                {product.stock}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="rounded-full border border-border bg-white px-3 py-2.5 text-sm font-bold text-coffee transition hover:bg-cream"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="rounded-full bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                            >
                              Eliminar
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {tab === "ordenes" && (
          <section className="overflow-visible rounded-4xl border border-border bg-white/95 shadow-soft">
            <div className="border-b border-border bg-cream/50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-xl font-black text-text-dark">
                    Órdenes recibidas
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Revisa pedidos pagados, pendientes y rechazados sin borrar historial.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,260px)_160px]">
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-secondary">
                      Buscar
                    </span>
                    <input
                      type="search"
                      value={orderSearch}
                      onChange={(event) => setOrderSearch(event.target.value)}
                      placeholder="Cliente, email u orden"
                      className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-text-secondary">
                      Estado
                    </span>
                    <SelectPro
                      value={orderStatus}
                      options={orderStatusOptions}
                      onChange={(nextValue) =>
                        setOrderStatus(nextValue as OrderStatusFilter)
                      }
                      fullWidth
                    />
                  </label>
                </div>
              </div>
            </div>

            {loadingOrders ? (
              <div className="p-8 text-text-secondary">Cargando...</div>
            ) : orders.length === 0 ? (
              <EmptyState
                title="No hay órdenes todavía"
                description="Cuando un cliente haga una compra, aparecerá en esta sección."
              />
            ) : filteredOrders.length === 0 ? (
              <EmptyState
                title="No hay órdenes para este filtro"
                description="Ajusta la búsqueda o el estado para revisar más pedidos."
              />
            ) : (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-245 table-fixed">
                    <thead className="bg-cream/80">
                      <tr>
                        <th className="w-[14%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Orden
                        </th>
                        <th className="w-[32%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Cliente
                        </th>
                        <th className="w-[14%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Total
                        </th>
                        <th className="w-[14%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Estado
                        </th>
                        <th className="w-[14%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Fecha
                        </th>
                        <th className="w-[12%] px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="transition hover:bg-cream/50">
                          <td className="px-5 py-4 font-mono text-sm text-text-dark">
                            #{order.id.slice(0, 8)}
                          </td>

                          <td className="px-5 py-4">
                            <p className="line-clamp-1 font-bold text-text-dark">
                              {order.customer_name}
                            </p>
                            <p className="mt-1 line-clamp-1 text-sm text-text-secondary">
                              {order.customer_email}
                            </p>
                          </td>

                          <td className="px-5 py-4 font-bold text-coffee">
                            {formatCurrency(order.total)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${getOrderBadgeClass(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-text-secondary">
                            {formatDate(order.created_at)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => void handleOpenOrderDetail(order)}
                                className="rounded-full border border-border bg-white px-3 py-2 text-sm font-bold text-coffee transition hover:bg-cream"
                              >
                                Ver detalle
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-3 p-4 lg:hidden">
                  {filteredOrders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-[1.35rem] border border-border bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-sm font-bold text-text-dark">
                            #{order.id.slice(0, 8)}
                          </p>
                          <p className="mt-2 font-black text-text-dark">
                            {order.customer_name}
                          </p>
                          <p className="mt-1 break-all text-sm text-text-secondary">
                            {order.customer_email}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${getOrderBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-cream/60 p-3 text-sm">
                        <div>
                          <p className="text-text-secondary">Total</p>
                          <p className="font-black text-coffee">
                            {formatCurrency(order.total)}
                          </p>
                        </div>

                        <div>
                          <p className="text-text-secondary">Fecha</p>
                          <p className="font-black text-text-dark">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => void handleOpenOrderDetail(order)}
                        className="mt-4 w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm font-bold text-coffee transition hover:bg-cream"
                      >
                        Ver detalle
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          items={selectedOrderItems}
          loadingItems={loadingOrderItems}
          onClose={handleCloseOrderDetail}
        />
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "green" | "yellow" | "coffee";
}) {
  const toneClass = {
    default: "text-text-dark",
    green: "text-green-700",
    yellow: "text-yellow-700",
    coffee: "text-coffee",
  }[tone];

  return (
    <div className="rounded-[1.35rem] border border-border bg-white/95 p-4 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-black leading-tight ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="p-6 sm:p-10">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-cream/50 p-6 text-center">
        <p className="text-lg font-black text-text-dark">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
        {action}
      </div>
    </div>
  );
}

function OrderDetailPanel({
  order,
  items,
  loadingItems,
  onClose,
}: {
  order: Order;
  items: OrderItem[];
  loadingItems: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const hasAddress =
    Boolean(order.customer_address) ||
    Boolean(order.customer_commune) ||
    Boolean(order.customer_region);
  const whatsappPhone = order.customer_phone
    ? normalizePhoneForWhatsApp(order.customer_phone)
    : "";
  const canUseWhatsApp = Boolean(whatsappPhone);
  const canUseEmail = Boolean(order.customer_email);

  const handleCopySummary = async () => {
    const summary = buildOrderSummary(order, items);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = summary;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Error copying order summary:", error);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!canUseWhatsApp) return;

    window.open(
      `https://wa.me/${whatsappPhone}?text=${buildOrderMessage(order, items)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleOpenEmail = () => {
    if (!canUseEmail) return;

    const subject = encodeURIComponent(`Orden #${order.id.slice(0, 8)}`);
    const body = buildOrderMessage(order, items);

    window.open(
      `mailto:${order.customer_email}?subject=${subject}&body=${body}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-text-dark/45 p-0 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Detalle de orden"
    >
      <button
        type="button"
        aria-label="Cerrar detalle"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <aside className="relative ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-4xl">
        <div className="border-b border-border bg-cream/60 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-coffee">
                Detalle de orden
              </p>
              <h2 className="mt-2 break-all font-mono text-xl font-black text-text-dark sm:text-2xl">
                #{order.id.slice(0, 8)}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {formatDate(order.created_at)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${getOrderBadgeClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border bg-white px-3 py-2 text-sm font-black text-text-dark transition hover:bg-cream"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
            <section className="rounded-3xl border border-border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wide text-text-dark">
                Cliente
              </h3>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <DetailField label="Nombre" value={order.customer_name} />
                <DetailField label="Email" value={order.customer_email} />
                <DetailField label="Teléfono" value={order.customer_phone} />
                <DetailField
                  label="Dirección"
                  value={hasAddress ? order.customer_address : null}
                />
                <DetailField label="Comuna" value={order.customer_commune} />
                <DetailField label="Región" value={order.customer_region} />
              </dl>
            </section>

            <section className="rounded-3xl border border-border bg-cream/60 p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wide text-text-dark">
                Resumen
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">Total</span>
                  <span className="font-black text-coffee">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">Productos</span>
                  <span className="font-black text-text-dark">
                    {items.length}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">Estado</span>
                  <span className="font-black text-text-dark">
                    {order.status}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-3xl border border-border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide text-text-dark">
                  Acciones rápidas
                </h3>
                <p className="text-sm text-text-secondary">
                  Copia el resumen o contacta al cliente sin salir del panel.
                </p>
              </div>

              {copied && (
                <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-black text-green-700 ring-1 ring-green-200">
                  Copiado
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => void handleCopySummary()}
                className="rounded-full bg-coffee px-4 py-3 text-sm font-black text-white shadow-lg shadow-coffee/20 transition hover:-translate-y-0.5 hover:bg-coffee-dark"
              >
                Copiar resumen
              </button>

              {canUseWhatsApp && (
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="rounded-full border border-border bg-white px-4 py-3 text-sm font-black text-coffee transition hover:bg-cream"
                >
                  WhatsApp
                </button>
              )}

              {canUseEmail && (
                <button
                  type="button"
                  onClick={handleOpenEmail}
                  className="rounded-full border border-border bg-white px-4 py-3 text-sm font-black text-coffee transition hover:bg-cream"
                >
                  Email
                </button>
              )}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide text-text-dark">
                  Productos comprados
                </h3>
                <p className="text-sm text-text-secondary">
                  Cantidad, precio unitario y subtotal por producto.
                </p>
              </div>
            </div>

            {loadingItems ? (
              <div className="mt-4 rounded-2xl bg-cream/60 p-5 text-sm font-semibold text-text-secondary">
                Cargando productos...
              </div>
            ) : items.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-border bg-cream/60 p-5 text-center text-sm font-semibold text-text-secondary">
                No hay productos asociados a esta orden.
              </div>
            ) : (
              <>
                <div className="mt-4 hidden overflow-x-auto md:block">
                  <table className="w-full min-w-150 table-fixed">
                    <thead className="bg-cream/80">
                      <tr>
                        <th className="w-[42%] rounded-l-2xl px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Producto
                        </th>
                        <th className="w-[14%] px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Cant.
                        </th>
                        <th className="w-[22%] px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Unitario
                        </th>
                        <th className="w-[22%] rounded-r-2xl px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-text-secondary">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 font-bold text-text-dark">
                            {item.product_name}
                          </td>
                          <td className="px-4 py-4 text-text-secondary">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-text-secondary">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="px-4 py-4 text-right font-black text-coffee">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid gap-3 md:hidden">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-border bg-cream/50 p-4"
                    >
                      <h4 className="font-black text-text-dark">
                        {item.product_name}
                      </h4>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-text-secondary">Cant.</p>
                          <p className="font-black text-text-dark">
                            {item.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Unitario</p>
                          <p className="font-black text-text-dark">
                            {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Subtotal</p>
                          <p className="font-black text-coffee">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-2xl bg-cream/50 p-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-text-secondary">
        {label}
      </dt>
      <dd className="mt-1 wrap-break-words font-bold text-text-dark">
        {value || "No informado"}
      </dd>
    </div>
  );
}
