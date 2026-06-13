import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";
import ProductDetailClient from "./ProductDetailClient";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const fallbackDescription =
  "Producto artesanal de mimbre hecho a mano para decoración y organización del hogar.";

async function getProductForMetadata(id: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Product;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductForMetadata(id);
  const canonical = `/productos/${id}`;

  if (!product) {
    return {
      title: "Producto no encontrado | Raíz y Mimbre",
      description: fallbackDescription,
      alternates: {
        canonical,
      },
      openGraph: {
        title: "Producto no encontrado | Raíz y Mimbre",
        description: fallbackDescription,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Producto no encontrado | Raíz y Mimbre",
        description: fallbackDescription,
      },
    };
  }

  const title = `${product.name} | Raíz y Mimbre`;
  const description = product.description?.trim() || fallbackDescription;
  const images = product.image_url ? [product.image_url] : ["/image/imagenHome.png"];

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function ProductDetail({ params }: ProductPageProps) {
  const { id } = await params;

  return <ProductDetailClient id={id} />;
}
