import ScrollLink from "@/components/ScrollLink";

export default function ContactSection() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || "56972086522";
  const whatsappMessage =
    "Hola, quiero consultar por productos o servicios de Raíz y Mimbre.";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section
      id="contacto"
      className="section-reveal scroll-mt-24 bg-cream px-4 pb-7 pt-0 sm:px-6 sm:pb-12 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-3.5 rounded-3xl border border-border bg-white p-3.5 shadow-soft sm:gap-6 sm:rounded-4xl sm:p-7 lg:grid-cols-[1fr_0.78fr] lg:items-center">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-coffee sm:text-[11px] sm:tracking-[0.24em]">
            Contacto
          </p>

          <h2 className="mt-2 max-w-2xl text-[1.55rem] font-black leading-tight text-text-dark sm:mt-4 sm:text-4xl">
            Hablemos de tu próxima pieza o reparación.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-5 text-text-secondary sm:mt-4 sm:text-base sm:leading-7">
            Escríbenos por WhatsApp para consultar por productos disponibles,
            reparaciones, tapizado o trabajos en mimbre, madera y junco.
          </p>

          <div className="mt-3.5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-coffee px-5 py-2.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(139,94,60,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-coffee-dark hover:shadow-[0_18px_38px_rgba(139,94,60,0.28)] active:scale-[0.98] sm:px-6 sm:py-3.5"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12.5A7 7 0 0 1 16.9 7.6a7 7 0 0 1-8.5 10.9L5 19l.7-3.1A7 7 0 0 1 5 12.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Escribir por WhatsApp
            </a>

            <ScrollLink
              href="/#productos"
              className="focus-ring inline-flex justify-center rounded-full border border-border bg-cream px-5 py-2.5 text-sm font-black text-coffee transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-[0.98] sm:px-6 sm:py-3.5"
            >
              Ver productos
            </ScrollLink>
          </div>
        </div>

        <div className="grid gap-2.5 sm:gap-3">
          <div className="group rounded-2xl border border-border bg-cream/65 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-coffee/20 hover:bg-cream sm:p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coffee">
              WhatsApp
            </p>
            <p className="mt-1.5 break-all text-sm font-black text-text-dark sm:mt-2">
              {whatsappPhone}
            </p>
          </div>

          <div className="group rounded-2xl border border-border bg-cream/65 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-coffee/20 hover:bg-cream sm:p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coffee">
              Email
            </p>
            <a
              href="mailto:contacto@mimbrestore.cl"
              className="focus-ring mt-1.5 inline-flex break-all rounded-lg text-sm font-black text-text-dark transition hover:text-coffee sm:mt-2"
            >
              contacto@mimbrestore.cl
            </a>
          </div>

          <div className="group rounded-2xl border border-border bg-cream/65 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-coffee/20 hover:bg-cream sm:p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coffee">
              Horario
            </p>
            <p className="mt-1.5 text-sm font-black text-text-dark sm:mt-2">
              Respondemos lo antes posible
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
