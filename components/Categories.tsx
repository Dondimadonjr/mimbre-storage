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
    <section className="section-reveal bg-gradient-to-b from-[#F7F1E8]/60 to-[#DDE8D8]/30 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-5 max-w-2xl text-center sm:mb-6">
          <p className="inline-flex rounded-full border border-coffee/15 bg-white px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-coffee shadow-sm sm:px-4 sm:py-2 sm:text-[11px]">
            Categorías
          </p>

          <h2 className="mt-3 text-[1.65rem] font-black leading-tight text-text-dark sm:text-3xl">
            Explora por tipo de producto
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-secondary sm:mt-3">
            Encuentra piezas de mimbre pensadas para decorar, ordenar y dar un
            toque natural a tu hogar.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
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
              className="focus-ring group rounded-2xl border border-border bg-white/90 p-3 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-coffee/30 hover:bg-white hover:shadow-[0_18px_40px_rgba(93,58,31,0.13)] active:scale-[0.99] sm:p-4"
            >
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#A06A3B]/20 bg-[#D7B27A]/25 shadow-sm transition duration-300 group-hover:scale-105 group-hover:border-[#A06A3B]/35 group-hover:bg-[#D7B27A]/40 sm:h-14 sm:w-14">
                  <Image
                    src={category.iconSrc}
                    alt=""
                    width={40}
                    height={40}
                    className="h-9 w-9 object-contain transition duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-black text-text-dark transition group-hover:text-coffee">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-text-secondary sm:text-sm">
                    {category.description}
                  </p>
                </div>
              </div>

              <span className="mt-2 inline-flex text-xs font-black text-coffee transition duration-300 group-hover:translate-x-1 sm:mt-3 sm:text-sm">
                Ver productos →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
