import ScrollLink from "@/components/ScrollLink";

const points = [
  {
    title: "Hecho a mano",
    description: "Piezas trabajadas con calma, oficio y detalle artesanal.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
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
    description: "Mimbre, junco, madera y fibras seleccionadas para durar.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
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
    description: "Reparamos, restauramos y adaptamos piezas para cada espacio.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
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
      className="section-reveal scroll-mt-28 bg-cream px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[1.7rem] border border-border bg-white shadow-[0_18px_58px_rgba(49,39,31,0.075)] sm:rounded-[2.4rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-coffee/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-8 h-64 w-64 rounded-full bg-[#1f2e25]/10 blur-3xl"
          />

          <div className="relative grid min-w-0 gap-4 p-4 sm:gap-6 sm:p-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:p-9">
            <div className="min-w-0">
              <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#A06A3B]/20 bg-[#D7B27A]/25 px-3 py-1.5 text-[0.64rem] font-black uppercase tracking-[0.2em] text-[#5A321C] sm:px-4 sm:py-2 sm:text-[0.7rem] sm:tracking-[0.24em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A06A3B]" />
                Nuestro oficio
              </span>

              <h2 className="mt-3 max-w-2xl text-[1.55rem] font-black leading-[1.06] tracking-[-0.035em] text-text-dark sm:mt-5 sm:text-4xl lg:text-[2.7rem]">
                Piezas hechas a mano con calma, textura y tradición.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:mt-5 sm:text-base sm:leading-7">
                Trabajamos con mimbre, madera, junco y fibras naturales para
                crear, reparar y dar nueva vida a piezas para el hogar.
              </p>

              <div className="mt-4 rounded-2xl border border-border bg-cream/65 p-3 sm:mt-6 sm:rounded-3xl sm:p-4">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-coffee sm:text-[0.7rem]">
                  Artesanía para el hogar
                </p>
                <p className="mt-1.5 text-sm leading-5 text-text-secondary sm:leading-6">
                  No buscamos producir en serie. Creamos piezas con carácter,
                  hechas para sumar calidez, orden y memoria.
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {points.map((point) => (
                <article
                  key={point.title}
                  className="group min-w-0 rounded-2xl border border-border bg-[#fbf8f3] p-3 transition duration-300 hover:-translate-y-1 hover:border-coffee/25 hover:bg-white hover:shadow-[0_18px_50px_rgba(49,39,31,0.08)] sm:rounded-3xl sm:p-4"
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-coffee/15 bg-white text-coffee shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-coffee group-hover:text-white sm:h-10 sm:w-10">
                      {point.icon}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-black leading-tight tracking-[-0.02em] text-text-dark sm:text-base">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-[0.78rem] leading-5 text-text-secondary sm:text-sm sm:leading-6">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="rounded-2xl bg-[#1f2e25] p-3 text-white shadow-[0_18px_54px_rgba(31,46,37,0.16)] sm:col-span-2 sm:rounded-3xl sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-coffee sm:text-[0.7rem]">
                      También restauramos
                    </p>
                    <p className="mt-1.5 text-sm leading-5 text-white/76 sm:max-w-2xl sm:leading-6">
                      Reparaciones, tapizado y trabajos en madera, mimbre y
                      junco para recuperar piezas con valor familiar o funcional.
                    </p>
                  </div>

                  <ScrollLink
                    href="/#servicios"
                  className="focus-ring inline-flex w-fit shrink-0 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/14 active:scale-[0.98]"
                  >
                    Ver servicios
                  </ScrollLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
