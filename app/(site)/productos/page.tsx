import type { Metadata } from "next";
import ProductsGrid from "@/components/ProductsGrid";

export const metadata: Metadata = {
  title: "Productos artesanales | Raíz y Mimbre",
  description:
    "Explora productos de mimbre, fibras naturales y piezas artesanales para decoración, organización y hogar.",
  alternates: {
    canonical: "/productos",
  },
  openGraph: {
    title: "Productos artesanales | Raíz y Mimbre",
    description:
      "Explora productos de mimbre, fibras naturales y piezas artesanales para decoración, organización y hogar.",
    url: "/productos",
    type: "website",
    images: [
      {
        url: "/image/imagenHome.png",
        width: 1200,
        height: 630,
        alt: "Productos artesanales de Raíz y Mimbre",
      },
    ],
  },
};

export default function ProductosPage() {
  return (
    <main className="min-h-screen bg-cream">
      <ProductsGrid />
    </main>
  );
}
