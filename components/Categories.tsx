"use client";

import Link from "next/link";

const categories = [
  {
    name: "Canastos",
    description: "Canastos artesanales para hogar, decoración y organización.",
    href: "/productos?categoria=Canastos",
    icon: "🧺",
  },
  {
    name: "Decoración",
    description: "Piezas decorativas en mimbre para dar calidez a tus espacios.",
    href: "/productos?categoria=Decoración",
    icon: "🏡",
  },
  {
    name: "Organizadores",
    description: "Soluciones prácticas y bonitas para mantener todo en orden.",
    href: "/productos?categoria=Organizadores",
    icon: "📦",
  },
  {
    name: "Bandejas",
    description: "Bandejas de mimbre ideales para servir o decorar.",
    href: "/productos?categoria=Bandejas",
    icon: "☕",
  },
];

export default function Categories() {
  return (
    <section className="bg-cream px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-coffee">
            Categorías
          </p>

          <h2 className="mt-3 text-3xl font-bold text-text-dark md:text-4xl">
            Explora por tipo de producto
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Encuentra piezas artesanales de mimbre pensadas para decorar,
            ordenar y dar un toque natural a tu hogar.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group rounded-3xl border border-border bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-3xl transition group-hover:bg-coffee group-hover:text-white">
                {category.icon}
              </div>

              <h3 className="text-xl font-bold text-text-dark">
                {category.name}
              </h3>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {category.description}
              </p>

              <span className="mt-5 inline-flex text-sm font-bold text-coffee transition group-hover:translate-x-1">
                Ver productos →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}