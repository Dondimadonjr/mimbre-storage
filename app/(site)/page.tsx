import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductsGrid from "@/components/ProductsGrid";

export const metadata: Metadata = {
  title: "Mimbre artesanal para el hogar",
  description:
    "Explora productos artesanales de mimbre en Chile: canastos, organizadores, bandejas y decoración natural para tu hogar.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mimbre Store | Mimbre artesanal para el hogar",
    description:
      "Productos artesanales de mimbre hechos a mano para decorar y organizar espacios con calidez natural.",
    url: "/",
    images: [
      {
        url: "/image/imagenHome.png",
        width: 1200,
        height: 630,
        alt: "Mimbre Store - productos artesanales de mimbre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mimbre Store | Mimbre artesanal para el hogar",
    description:
      "Canastos, bandejas, organizadores y decoración artesanal de mimbre en Chile.",
    images: ["/image/imagenHome.png"],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <Hero />
      <Categories />
      <ProductsGrid />
    </main>
  );
}
