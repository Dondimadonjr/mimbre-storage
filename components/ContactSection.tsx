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
      className="scroll-mt-24 bg-cream px-4 pb-12 pt-2 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-6 rounded-4xl border border-border bg-white p-5 shadow-soft sm:p-7 lg:grid-cols-[1fr_0.78fr] lg:items-center">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-coffee">
            Contacto
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-text-dark sm:text-4xl">
            Hablemos de tu próxima pieza o reparación.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
            Escríbenos por WhatsApp para consultar por productos disponibles,
            reparaciones, tapizado o trabajos en mimbre, madera y junco.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full bg-coffee px-6 py-3.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(139,94,60,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-coffee-dark active:scale-[0.98]"
            >
              Escribir por WhatsApp
            </a>

            <ScrollLink
              href="/#productos"
              className="inline-flex justify-center rounded-full border border-border bg-cream px-6 py-3.5 text-sm font-black text-coffee transition duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
            >
              Ver productos
            </ScrollLink>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-border bg-cream/65 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coffee">
              WhatsApp
            </p>
            <p className="mt-2 break-all text-sm font-black text-text-dark">
              {whatsappPhone}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-cream/65 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coffee">
              Email
            </p>
            <a
              href="mailto:contacto@mimbrestore.cl"
              className="mt-2 inline-flex break-all text-sm font-black text-text-dark transition hover:text-coffee"
            >
              contacto@mimbrestore.cl
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-cream/65 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coffee">
              Horario
            </p>
            <p className="mt-2 text-sm font-black text-text-dark">
              Respondemos lo antes posible
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
