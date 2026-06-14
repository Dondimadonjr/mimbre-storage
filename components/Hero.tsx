import Image from "next/image";
import ScrollLink from "@/components/ScrollLink";

const benefits = [
  {
    label: "Hecho a mano",
    icon: (
      <path
        d="M7 11.5 12 6l5 5.5M8.5 13.5 12 10l3.5 3.5M6 17h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Piezas únicas",
    icon: (
      <path
        d="M12 3.5 14.3 9l5.7.5-4.3 3.8 1.3 5.5-5-3-5 3 1.3-5.5L4 9.5 9.7 9 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Envíos coordinados",
    icon: (
      <path
        d="M4 7h10v8H4zM14 10h3l3 3v2h-6zM7 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Hero() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || "56972086522";

  return (
    <section
      id="inicio"
      className="section-reveal bg-cream px-4 pb-8 pt-1 sm:px-6 sm:pb-14 sm:pt-6 lg:px-8 lg:pb-16 lg:pt-8"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.8fr)] lg:gap-12">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-coffee/15 bg-white/70 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.2em] text-coffee shadow-sm sm:text-xs sm:tracking-[0.22em]">
            <span className="h-1.5 w-1.5 rounded-full bg-coffee" />
            Artesanía natural
          </p>

          <h1 className="mt-3 max-w-3xl text-[2.35rem] font-black leading-[1.02] text-text-dark sm:mt-4 sm:text-5xl lg:text-6xl">
            Mimbre natural para espacios con calidez
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-text-secondary sm:mt-5 sm:text-lg sm:leading-7">
            Piezas tejidas a mano para decorar, organizar y sumar textura
            artesanal a tu hogar.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2.5">
            {benefits.map((benefit) => (
              <span
                key={benefit.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-coffee/15 bg-white/75 px-3 py-1.5 text-xs font-bold text-text-secondary shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-coffee/25 hover:bg-white sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-coffee"
                  fill="none"
                  aria-hidden="true"
                >
                  {benefit.icon}
                </svg>
                {benefit.label}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
            <ScrollLink
              href="/#productos"
              className="focus-ring inline-flex justify-center rounded-full bg-coffee px-6 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(93,58,31,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-coffee-dark hover:shadow-[0_18px_34px_rgba(93,58,31,0.24)] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
            >
              Ver catálogo
            </ScrollLink>

            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex justify-center rounded-full border border-coffee/25 bg-white px-6 py-3 text-sm font-black text-coffee shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-cream hover:shadow-md active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
            >
              Comprar por WhatsApp
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="group overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_18px_46px_rgba(79,50,28,0.12)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(79,50,28,0.16)] sm:rounded-4xl sm:shadow-[0_20px_60px_rgba(79,50,28,0.13)]">
            <div className="relative h-56 bg-linear-to-br from-white via-cream to-coffee/10 min-[390px]:h-64 sm:h-96 lg:h-115">
              <Image
                src="/image/imagenHome.png"
                alt="Pieza artesanal de mimbre para decoración del hogar"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition duration-700 group-hover:scale-[1.025]"
              />
            </div>

            <div className="border-t border-border bg-white px-4 py-3 sm:px-6 sm:py-4">
              <p className="text-sm font-black text-coffee">
                Colección destacada
              </p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Piezas naturales, resistentes y seleccionadas para uso diario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
