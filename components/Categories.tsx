"use client";

import Image from "next/image";

const categories = [
  {
    name: "Canastos",
    description: "Para organizar y decorar con textura natural.",
    href: "/#productos",
    iconSrc: "/icons/iconCanasto.png",
  },
  {
    name: "Decoración",
    description: "Detalles cálidos para muros, mesas y rincones.",
    href: "/#productos",
    iconSrc: "/icons/iconLampara.png",
  },
  {
    name: "Organizadores",
    description: "Soluciones prácticas para ordenar con estilo.",
    href: "/#productos",
    iconSrc: "/icons/iconOrganizador.png",
  },
  {
    name: "Bandejas",
    description: "Piezas versátiles para servir, contener o exhibir.",
    href: "/#productos",
    iconSrc: "/icons/iconBandeja.png",
  },
];

export default function Categories() {
  return (
    <section className="bg-cream/40 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <p className="inline-flex rounded-full border border-coffee/15 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-coffee shadow-sm">
            Categorías
          </p>

          <h2 className="mt-3 text-2xl font-black leading-tight text-text-dark sm:text-3xl">
            Explora por tipo de producto
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary">
            Encuentra piezas de mimbre pensadas para decorar, ordenar y dar un
            toque natural a tu hogar.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("category:selected", {
                    detail: category.name,
                  })
                );

                document
                  .getElementById("productos")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="group text-left rounded-2xl border border-border bg-white/90 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-coffee/25 hover:bg-white hover:shadow-[0_16px_34px_rgba(93,58,31,0.11)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-coffee/10 bg-cream shadow-sm transition group-hover:border-coffee/25 group-hover:bg-white">
                  <Image
                    src={category.iconSrc}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-black text-text-dark transition group-hover:text-coffee">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-text-secondary">
                    {category.description}
                  </p>
                </div>
              </div>

              <span className="mt-3 inline-flex text-sm font-black text-coffee transition group-hover:translate-x-1">
                Ver productos →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}