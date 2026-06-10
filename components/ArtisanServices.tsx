import ScrollLink from "@/components/ScrollLink";

const services = [
  {
    title: "Reparación de mimbre",
    description:
      "Restauramos piezas dañadas, sueltas o desgastadas para darles nueva vida.",
  },
  {
    title: "Tapizado",
    description:
      "Apoyo en renovación de asientos, respaldos y detalles textiles según el tipo de pieza.",
  },
  {
    title: "Madera",
    description:
      "Trabajos y ajustes en piezas de madera para hogar, decoración o reparación.",
  },
  {
    title: "Junco y fibras naturales",
    description:
      "Trabajos con junco, mimbre y fibras naturales para piezas funcionales o decorativas.",
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
    <section id="servicios" className="scroll-mt-24 bg-cream px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-text-dark text-white shadow-[0_26px_80px_rgba(31,42,36,0.18)]">
        <div className="grid gap-7 p-5 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
          <div className="flex flex-col justify-between gap-7">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-coffee">
                Servicios a pedido
              </p>

              <h2 className="mt-4 max-w-2xl text-2xl font-black leading-[1.08] sm:text-4xl sm:leading-tight">
                Reparamos, tapizamos y trabajamos piezas en mimbre, madera y
                junco.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/66 sm:text-base sm:leading-7">
                Además de nuestras piezas listas para el hogar, también
                realizamos trabajos a pedido, reparaciones y restauraciones
                artesanales. Escríbenos por WhatsApp y cuéntanos qué necesitas.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center rounded-full bg-coffee px-6 py-3.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(139,94,60,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-coffee-dark active:scale-[0.98]"
              >
                Consultar por WhatsApp
              </a>

              <ScrollLink
                href="/#productos"
                className="inline-flex justify-center rounded-full border border-white/14 bg-white/8 px-6 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/14 active:scale-[0.98]"
              >
                Ver productos
              </ScrollLink>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="group rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:-translate-y-1 hover:border-coffee/40 hover:bg-white/[0.075] sm:rounded-[1.75rem] sm:p-5"
              >
                <p className="text-xs font-black text-coffee">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-4 text-lg font-black text-white">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/62">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
