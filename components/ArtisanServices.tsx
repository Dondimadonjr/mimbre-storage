import ScrollLink from "@/components/ScrollLink";

const services = [
  {
    title: "Reparación",
    description: "Restauramos piezas de mimbre dañadas o desgastadas.",
    icon: (
      <path
        d="M14.5 5.5 18 9M5 19l7.8-7.8M13.5 6.5 6.5 13.5l4 4 7-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Tapizado",
    description: "Renovamos asientos, respaldos y detalles textiles.",
    icon: (
      <path
        d="M6 8.5h12M7.5 5.5h9l1.5 12h-12l1.5-12ZM8 13.5h8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Madera",
    description: "Ajustes y trabajos en madera para hogar o reparación.",
    icon: (
      <path
        d="M5 18 18 5M8 19l11-11M5 13l6 6M5 18l1.5 1.5M16.5 3.5l4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Fibras naturales",
    description: "Trabajos en junco, mimbre y fibras decorativas.",
    icon: (
      <path
        d="M19 5c-7.5.4-12 4.6-12 10.4 0 2.1 1.4 3.6 3.5 3.6C15.9 19 19.4 13 19 5Z M7.5 17.5c2.7-4.6 6-7.3 10-9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function ArtisanServices() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || "56972086522";
  const whatsappMessage =
    "Hola, quiero consultar por un servicio de reparación, tapizado o trabajo en mimbre/madera/junco.";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section
      id="servicios"
      className="section-reveal scroll-mt-28 bg-cream px-4 py-6 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#14231a] text-white shadow-[0_22px_64px_rgba(31,42,36,0.18)] sm:rounded-[2.35rem]">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(158,104,64,0.24),transparent_34%),radial-gradient(circle_at_92%_10%,rgba(255,255,255,0.07),transparent_30%)]" />

            <div className="relative grid min-w-0 gap-5 p-4 sm:p-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-9 lg:p-10">
              <div className="min-w-0">
                <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-coffee/25 bg-coffee/10 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-coffee sm:text-[0.72rem] sm:tracking-[0.22em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-coffee" />
                  Servicios a pedido
                </span>

                <h2 className="mt-3 max-w-xl text-[1.65rem] font-black leading-[1.04] tracking-[-0.035em] text-white sm:mt-5 sm:text-4xl lg:text-5xl">
                  Reparamos y restauramos piezas con oficio.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/66 sm:mt-5 sm:text-base sm:leading-7">
                  Trabajamos mimbre, madera, junco y tapizados para recuperar
                  piezas con valor, reparar daños o crear soluciones a pedido.
                </p>

                <div className="mt-4 grid gap-2 sm:mt-6 sm:max-w-md sm:grid-cols-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex h-11 items-center justify-center rounded-full bg-coffee px-5 text-sm text-center font-black text-white shadow-[0_14px_32px_rgba(139,94,60,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-coffee-dark hover:shadow-[0_18px_38px_rgba(139,94,60,0.34)] active:scale-[0.98]"
                  >
                    Consultar por WhatsApp
                  </a>

                  <ScrollLink
                    href="/#productos"
                    className="focus-ring inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/8 px-5 text-sm font-black text-white/88 transition duration-300 hover:-translate-y-0.5 hover:bg-white/14 active:scale-[0.98]"
                  >
                    Ver productos
                  </ScrollLink>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/4.5 p-3 sm:mt-6 sm:max-w-md sm:rounded-3xl sm:p-4">
                  <p className="text-[0.78rem] font-semibold leading-5 text-white/58 sm:text-sm sm:leading-6">
                    Ideal para sillas, canastos, lámparas, organizadores,
                    muebles pequeños y piezas familiares.
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.2em] text-coffee">
                    Especialidades
                  </p>

                  <span className="rounded-full border border-white/10 bg-white/7 px-3 py-1 text-[0.66rem] font-bold text-white/58">
                    4 servicios
                  </span>
                </div>

                <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
                  {services.map((service) => (
                    <article
                      key={service.title}
                      className="group min-w-0 rounded-2xl border border-white/10 bg-white/5.5 p-3 transition duration-300 hover:-translate-y-1 hover:border-coffee/40 hover:bg-white/8 hover:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:rounded-[1.6rem] sm:p-5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex max-w-full rounded-full border border-coffee/30 bg-coffee/12 px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.15em] text-coffee sm:px-3 sm:text-[0.68rem]">
                          Servicio
                        </span>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/7 text-coffee transition duration-300 group-hover:scale-105 group-hover:bg-coffee group-hover:text-white">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            aria-hidden="true"
                          >
                            {service.icon}
                          </svg>
                        </span>
                      </div>

                      <h3 className="mt-2 text-sm font-black leading-tight text-white sm:mt-3 sm:text-lg">
                        {service.title}
                      </h3>

                      <p className="mt-1.5 text-[0.72rem] leading-4 text-white/62 sm:mt-2 sm:text-sm sm:leading-6">
                        {service.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative border-t border-white/10 px-4 py-3 sm:px-7 lg:px-10">
              <p className="text-[0.76rem] font-semibold leading-5 text-white/48 sm:text-sm">
                Atención personalizada para reparaciones, restauraciones y
                trabajos especiales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
