import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductsGrid from "@/components/ProductsGrid";
import ArtisanServices from "@/components/ArtisanServices";
import ScrollLink from "@/components/ScrollLink";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Mimbre artesanal para el hogar",
  description:
    "Explora productos artesanales de mimbre en Chile: canastos, organizadores, bandejas y decoración natural para tu hogar.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Raíz y Mimbre | Mimbre artesanal para el hogar",
    description:
      "Productos artesanales de mimbre hechos a mano para decorar y organizar espacios con calidez natural.",
    url: "/",
    images: [
      {
        url: "/image/imagenHome.png",
        width: 1200,
        height: 630,
        alt: "Raíz y Mimbre - productos artesanales de mimbre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raíz y Mimbre | Mimbre artesanal para el hogar",
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
      <AboutSection />
      <ServicesMention />
      <ProductsGrid />
      <ArtisanServices />
      <ContactSection />
    </main>
  );
}

function ServicesMention() {
  return (
    <section className="bg-cream px-4 pb-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-[1.5rem] border border-border bg-white/78 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold leading-6 text-text-secondary">
          También realizamos reparaciones, tapizado y trabajos en madera,
          mimbre y junco.
        </p>

        <ScrollLink
          href="/#servicios"
          className="inline-flex shrink-0 text-sm font-black text-coffee transition hover:text-coffee-dark"
        >
          Ver servicios →
        </ScrollLink>
      </div>
    </section>
  );
}
