const points = [
  "Hecho a mano",
  "Materiales naturales",
  "Reparaciones y trabajos a pedido",
];

export default function AboutSection() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-24 bg-cream px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-border bg-white/82 p-5 shadow-sm sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-coffee">
            Nuestro oficio
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-text-dark sm:text-4xl">
            Piezas hechas a mano con calma, textura y tradición.
          </h2>
        </div>

        <div>
          <p className="text-sm leading-7 text-text-secondary sm:text-base">
            Trabajamos con mimbre, madera, junco y fibras naturales para crear,
            reparar y dar nueva vida a piezas para el hogar. Cada trabajo se
            realiza con dedicación, cuidando el detalle y el uso diario.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {points.map((point, index) => (
              <div
                key={point}
                className="rounded-2xl border border-border bg-cream/65 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-cream"
              >
                <p className="text-xs font-black text-coffee">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-black leading-5 text-text-dark">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
