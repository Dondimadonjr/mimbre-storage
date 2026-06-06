"use client";

import Link from "next/link";

const categories = [
  {
    name: "Canastos",
    description: "Para organizar y decorar con textura natural.",
    href: "/#productos",
    icon: "🧺",
  },
  {
    name: "Decoración",
    description: "Detalles cálidos para muros, mesas y rincones.",
    href: "/#productos",
    icon: "⌂",
  },
  {
    name: "Organizadores",
    description: "Soluciones prácticas para ordenar con estilo.",
    href: "/#productos",
    icon: "□",
  },
  {
    name: "Bandejas",
    description: "Piezas versátiles para servir, contener o exhibir.",
    href: "/#productos",
    icon: "◌",
  },
];

export default function Categories() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-coffee">
            Categorías
          </p>

          <h2 className="mt-3 text-3xl font-black leading-tight text-text-dark md:text-4xl">
            Explora por tipo de producto
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Encuentra piezas de mimbre pensadas para decorar, ordenar y dar un
            toque natural a tu hogar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group rounded-[1.5rem] border border-border bg-cream/40 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-coffee/25 hover:bg-white hover:shadow-[0_18px_42px_rgba(93,58,31,0.1)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl font-black text-coffee shadow-sm transition group-hover:bg-coffee group-hover:text-white">
                  {category.icon}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-black text-text-dark transition group-hover:text-coffee">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-text-secondary">
                    {category.description}
                  </p>
                </div>
              </div>

              <span className="mt-5 inline-flex text-sm font-black text-coffee transition group-hover:translate-x-1">
                Ver productos →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
