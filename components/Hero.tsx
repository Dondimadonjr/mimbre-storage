import Link from "next/link";
import Image from "next/image";

const benefits = ["Hecho a mano", "Productos únicos", "Envíos coordinados"];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#FAF6F0] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-20 lg:pt-16"
    >
      {/* Decoración suave de fondo */}
      <div className="pointer-events-none absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-[#8B5E3C]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-8%] h-80 w-80 rounded-full bg-[#D8B48A]/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
        {/* Texto */}
        <div className="max-w-2xl">
          <span className="mb-5 inline-flex rounded-full border border-[#8B5E3C]/20 bg-white/75 px-4 py-2 text-sm font-bold text-[#8B5E3C] shadow-sm backdrop-blur">
            Artesanía chilena hecha a mano
          </span>

          <h1 className="max-w-3xl text-5xl font-black leading-[1.03] tracking-tight text-[#1F2A24] sm:text-6xl lg:text-[76px]">
            Artesanía en Mimbre,
            <span className="block text-[#8B5E3C]">Diseño Premium</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#5B655F] sm:text-xl">
            Productos únicos tejidos a mano con pasión. Cada pieza aporta
            calidez, textura y elegancia natural a tu hogar.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {benefits.map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center gap-2 rounded-full border border-[#8B5E3C]/15 bg-white/85 px-4 py-2 text-sm font-semibold text-[#5B655F] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#8B5E3C]/25 hover:text-[#8B5E3C]"
              >
                <span className="text-[#8B5E3C]">✓</span>
                {benefit}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#productos"
              className="inline-flex items-center justify-center rounded-full bg-[#8B5E3C] px-8 py-4 text-base font-black text-white shadow-lg shadow-[#8B5E3C]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#6F472C] hover:shadow-xl hover:shadow-[#8B5E3C]/25"
            >
              Ver catálogo
            </Link>

            <a
              href="https://wa.me/56972086522"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#8B5E3C]/25 bg-white/80 px-8 py-4 text-base font-black text-[#8B5E3C] shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-[#8B5E3C]/10"
            >
              Comprar por WhatsApp
            </a>
          </div>
        </div>

        {/* Imagen */}
        <div className="relative lg:pt-4">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-[#8B5E3C]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white shadow-[0_28px_80px_rgba(79,50,28,0.16)]">
            <div className="relative h-[360px] w-full bg-[#FFFDFC] sm:h-[460px] lg:h-[520px]">
              <Image
                src="/image/canasto.webp"
                alt="Canasto artesanal de mimbre"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-contain p-6 sm:p-8 lg:p-10"
              />
            </div>

            <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_45px_rgba(31,42,36,0.14)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6">
              <p className="text-sm font-black text-[#8B5E3C]">
                Colección destacada
              </p>
              <p className="mt-1 text-lg font-black leading-snug text-[#1F2A24] sm:text-xl">
                Piezas naturales para espacios con estilo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}