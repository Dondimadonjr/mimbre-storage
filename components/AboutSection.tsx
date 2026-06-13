import ScrollLink from "@/components/ScrollLink";

const points = [
  {
    title: "Hecho a mano",
    description:
      "Cada pieza conserva el ritmo del oficio y el detalle del trabajo artesanal.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M7 11.5 12 6l5 5.5M8.5 13.5 12 10l3.5 3.5M6 17h12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Materiales naturales",
    description:
      "Mimbre, junco, madera y fibras seleccionadas para durar y acompañar el hogar.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M19 5c-7.5.4-12 4.6-12 10.4 0 2.1 1.4 3.6 3.5 3.6C15.9 19 19.4 13 19 5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 17.5c2.7-4.6 6-7.3 10-9.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Trabajos a pedido",
    description:
      "Reparamos, restauramos y desarrollamos piezas según la necesidad de cada espacio.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M14.5 5.5 18 9M5 19l7.8-7.8M13.5 6.5 6.5 13.5l4 4 7-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function AboutSection() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-15 bg-cream px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-4xl border border-border bg-white shadow-[0_22px_80px_rgba(49,39,31,0.08)] sm:rounded-[2.5rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-coffee/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-[#1f2e25]/10 blur-3xl"
          />

          <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:p-8">
            <div className="flex flex-col justify-between gap-5">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-coffee/15 bg-cream px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-coffee">
                  <span className="h-2 w-2 rounded-full bg-coffee" />
                  Nuestro oficio
                </span>

                <h2 className="mt-4 max-w-2xl text-3xl font-black leading-[1.06] tracking-[-0.035em] text-text-dark sm:text-4xl">
                  Piezas hechas a mano con calma, textura y tradición.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
                  Trabajamos con mimbre, madera, junco y fibras naturales para
                  crear, reparar y dar nueva vida a piezas para el hogar. Cada
                  trabajo se realiza con dedicación, cuidando el detalle, la
                  resistencia y el uso cotidiano.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-cream/70 p-4">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-coffee">
                  Artesanía para el hogar
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  No buscamos producir objetos en serie. Buscamos piezas con
                  carácter, hechas para sumar calidez, orden y memoria a cada
                  espacio.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {points.map((point) => (
                <article
                  key={point.title}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-[#fbf8f3] p-4 transition duration-300 hover:-translate-y-1 hover:border-coffee/25 hover:bg-white hover:shadow-[0_18px_50px_rgba(49,39,31,0.08)]"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-coffee/15 bg-white text-coffee shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-coffee group-hover:text-white">
                      {point.icon}
                    </div>

                    <div>
                      <h3 className="text-base font-black tracking-[-0.02em] text-text-dark">
                        {point.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="rounded-3xl bg-[#1f2e25] p-4 text-white shadow-[0_22px_70px_rgba(31,46,37,0.18)] sm:col-span-2">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-coffee">
                  También restauramos
                </p>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Reparaciones, tapizado y trabajos en madera, mimbre y junco
                  para recuperar piezas con valor familiar o funcional.
                </p>
                <ScrollLink
                  href="/#servicios"
                  className="mt-3 inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/14"
                >
                  Ver servicios
                </ScrollLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
