"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import type { Product, ProductFormData } from "@/types/product";

interface AdminProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export default function AdminProductForm({
  product,
  onSuccess,
}: AdminProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    image_url: product?.image_url || "",
    gallery: product?.gallery || [],
    available: product?.available ?? true,
    featured: product?.featured ?? false,
    stock: product?.stock || 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || "");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
      return;
    }

    if (target instanceof HTMLInputElement && target.type === "number") {
      setFormData((prev) => ({
        ...prev,
        [target.name]: Number(target.value) || 0,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));

    if (target.name === "image_url") {
      setImagePreview(target.value);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setError("La imagen debe ser JPG, PNG, WEBP o GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB.");
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;

    setUploadingImage(true);

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `productos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("productos").getPublicUrl(filePath);

    setUploadingImage(false);

    return data.publicUrl;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.name.trim()) {
        throw new Error("El nombre del producto es obligatorio.");
      }

      if (formData.price <= 0) {
        throw new Error("El precio debe ser mayor a 0.");
      }

      const uploadedImageUrl = await uploadImage();

      const payload: ProductFormData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        category: formData.category || "",
        image_url: uploadedImageUrl || "",
      };

      if (product?.id) {
        const { error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id);

        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert([payload]);

        if (insertError) throw new Error(insertError.message);
      }

      setSuccess(true);
      setImageFile(null);

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 1200);
    } catch (err) {
      console.error("Error saving product:", err);
      setError(
        err instanceof Error ? err.message : "Error al guardar el producto"
      );
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[2rem] border border-border bg-white/95 shadow-soft"
    >
      <div className="border-b border-border bg-cream/50 px-5 py-4 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-coffee">
          Producto
        </p>
        <h3 className="mt-1 text-xl font-black text-text-dark">
          {product ? "Editar producto" : "Crear producto"}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          Completa la información comercial, visual y de estado del producto.
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm font-semibold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50/90 p-4 text-sm font-semibold text-green-700 shadow-sm">
            Producto guardado exitosamente.
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <section className="rounded-[1.5rem] border border-border bg-white p-4 shadow-sm">
              <SectionHeader
                title="Información básica"
                description="Nombre y descripción visibles en la tienda."
              />

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-text-dark">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                    placeholder="Ej: Canasto tejido grande"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-text-dark">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                    placeholder="Descripción del producto..."
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-border bg-white p-4 shadow-sm">
              <SectionHeader
                title="Precio y stock"
                description="Valores usados por el catálogo y el checkout."
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-text-dark">
                    Precio CLP *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-text-dark">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min={0}
                    className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                    placeholder="0"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-border bg-white p-4 shadow-sm">
              <SectionHeader
                title="Categoría"
                description="Agrupa el producto dentro del catálogo."
              />

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-bold text-text-dark">
                  Categoría
                </label>
                <select
                  title="categoría del producto"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                >
                  <option value="">Seleccionar categoría...</option>
                  <option value="Canastos">Canastos</option>
                  <option value="Bandejas">Bandejas</option>
                  <option value="Decoración">Decoración</option>
                  <option value="Organizadores">Organizadores</option>
                  <option value="Iluminación">Iluminación</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[1.5rem] border border-border bg-white p-4 shadow-sm">
              <SectionHeader
                title="Imagen principal"
                description="Vista previa y carga de imagen del producto."
              />

              <div className="mt-4">
                {imagePreview ? (
                  <div className="relative overflow-hidden rounded-[1.35rem] border border-border bg-gradient-to-br from-cream via-white to-coffee/10">
                    <Image
                      src={imagePreview}
                      alt="Vista previa"
                      width={900}
                      height={420}
                      className="h-56 w-full object-contain p-4"
                      unoptimized={imagePreview.startsWith("blob:")}
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-[1.35rem] border border-dashed border-border bg-cream/70 text-sm font-semibold text-text-secondary">
                    Sin imagen seleccionada
                  </div>
                )}

                <label className="mt-4 block cursor-pointer rounded-2xl border border-dashed border-coffee/30 bg-cream/70 px-4 py-4 text-center transition hover:border-coffee hover:bg-cream">
                  <input
                    title="archivo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-black text-coffee">
                    Seleccionar imagen
                  </span>
                  <span className="mt-1 block text-xs text-text-secondary">
                    JPG, PNG, WEBP o GIF. Máximo 5MB.
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-border bg-white p-4 shadow-sm">
              <SectionHeader
                title="Estado del producto"
                description="Controla visibilidad y destaque en tienda."
              />

              <div className="mt-4 space-y-3">
                <ToggleField
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  title="Disponible"
                  description="El producto puede mostrarse y venderse."
                />

                <ToggleField
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  title="Destacado"
                  description="Marca el producto como destacado."
                />
              </div>
            </section>
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">
            Los cambios se reflejarán en el catálogo al guardar.
          </p>

          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full rounded-full bg-coffee px-6 py-3.5 font-black text-white shadow-lg shadow-coffee/20 transition hover:-translate-y-0.5 hover:bg-coffee-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
          >
            {loading || uploadingImage
              ? uploadingImage
                ? "Subiendo imagen..."
                : "Guardando..."
              : product
                ? "Actualizar producto"
                : "Crear producto"}
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h4 className="text-sm font-black uppercase tracking-wide text-text-dark">
        {title}
      </h4>
      <p className="mt-1 text-xs leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  );
}

function ToggleField({
  name,
  checked,
  onChange,
  title,
  description,
}: {
  name: "available" | "featured";
  checked: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-cream/50 p-4 transition hover:bg-cream">
      <span>
        <span className="block text-sm font-black text-text-dark">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-text-secondary">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="flex h-7 w-12 shrink-0 items-center rounded-full bg-border p-1 transition peer-checked:justify-end peer-checked:bg-coffee">
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </span>
    </label>
  );
}
