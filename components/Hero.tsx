import Image from "next/image";
import ScrollLink from "@/components/ScrollLink";

const benefits = ["Hecho a mano", "Piezas únicas", "Envíos coordinados"];

export default function Hero() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || "56972086522";

  return (
    <section
      id="inicio"
      className="bg-cream px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-16 lg:pt-14"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.8fr)] lg:gap-12">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-coffee">
            Artesanía chilena hecha a mano
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] text-text-dark sm:text-5xl lg:text-6xl">
            Mimbre natural para espacios con calidez
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
            Piezas tejidas a mano para decorar, organizar y sumar textura
            artesanal a tu hogar.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {benefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full border border-coffee/15 bg-white/75 px-3.5 py-2 text-sm font-bold text-text-secondary"
              >
                {benefit}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ScrollLink
              href="/#productos"
              className="inline-flex justify-center rounded-full bg-coffee px-7 py-3.5 font-black text-white shadow-[0_14px_28px_rgba(93,58,31,0.2)] transition hover:bg-coffee-dark"
            >
              Ver catálogo
            </ScrollLink>

            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-coffee/25 bg-white px-7 py-3.5 font-black text-coffee transition hover:bg-cream"
            >
              Comprar por WhatsApp
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_20px_60px_rgba(79,50,28,0.13)]">
            <div className="relative h-72 bg-gradient-to-br from-white via-cream to-coffee/10 sm:h-96 lg:h-[460px]">
              <Image
                src="/image/canasto.webp"
                alt="Canasto artesanal de mimbre"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-contain p-7 drop-shadow-[0_20px_28px_rgba(93,58,31,0.16)] sm:p-9"
              />
            </div>

            <div className="border-t border-border bg-white px-5 py-4 sm:px-6">
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
