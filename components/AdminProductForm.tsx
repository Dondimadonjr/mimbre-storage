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
      className="space-y-6 rounded-3xl border border-border bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Producto guardado exitosamente.
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-text-dark">
          Nombre *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
          placeholder="Ej: Canasto tejido grande"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-text-dark">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
          placeholder="Descripción del producto..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-dark">
            Precio CLP *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min={0}
            className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-dark">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min={0}
            className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-text-dark">
          Categoría
        </label>
        <select
          title="categoría del producto"
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
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

      <div>
        <label className="mb-2 block text-sm font-medium text-text-dark">
          Subir imagen principal
        </label>
        <input
          title="archivo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          className="w-full rounded-2xl border border-dashed border-border bg-cream px-4 py-3 text-sm"
        />
        <p className="mt-2 text-xs text-text-secondary">
          Formatos permitidos: JPG, PNG, WEBP o GIF. Máximo 5MB.
        </p>
      </div>

      {imagePreview && (
        <div className="overflow-hidden rounded-3xl border border-border bg-cream">
          <Image
            src={imagePreview}
            alt="Vista previa"
            width={900}
            height={420}
            className="h-64 w-full object-cover"
            unoptimized={imagePreview.startsWith("blob:")}
          />
        </div>
      )}

      <div className="grid gap-3 rounded-2xl bg-cream p-4 md:grid-cols-2">
        <label className="flex items-center gap-3 text-sm font-medium text-text-dark">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="h-4 w-4 rounded accent-coffee"
          />
          Disponible
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-text-dark">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded accent-coffee"
          />
          Destacado
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || uploadingImage}
        className="w-full rounded-full bg-coffee px-6 py-4 font-semibold text-white transition hover:bg-coffee-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading || uploadingImage
          ? uploadingImage
            ? "Subiendo imagen..."
            : "Guardando..."
          : product
            ? "Actualizar producto"
            : "Crear producto"}
      </button>
    </form>
  );
}
