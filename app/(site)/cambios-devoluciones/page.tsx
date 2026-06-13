import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cambios y devoluciones",
  description:
    "Condiciones básicas para cambios, devoluciones y revisión de productos artesanales en Raíz y Mimbre.",
};

const sections = [
  {
    title: "Productos artesanales",
    paragraphs: [
      "Cada pieza puede presentar variaciones menores de color, textura, tejido o terminación. Estas diferencias son propias del trabajo artesanal y de los materiales naturales.",
      "Antes de comprar, revisa las fotos, descripción y medidas disponibles. Si tienes dudas, puedes escribirnos para recibir orientación.",
    ],
  },
  {
    title: "Cambios y devoluciones",
    paragraphs: [
      "Los cambios o devoluciones se revisan caso a caso. El plazo sugerido para contactarnos es de 10 días desde la recepción del producto.",
      "Para evaluar la solicitud, el producto debe estar sin uso, en buen estado y con sus condiciones originales, salvo que el motivo sea daño en transporte o falla atribuible al producto.",
    ],
  },
  {
    title: "Productos personalizados o usados",
    paragraphs: [
      "Los trabajos personalizados, reparaciones, tapizados o encargos a medida pueden no tener devolución, ya que se realizan según necesidades específicas del cliente.",
      "Tampoco se aceptan devoluciones por daños causados por mal uso, humedad, golpes, manipulación incorrecta o desgaste normal.",
    ],
  },
  {
    title: "Producto dañado",
    paragraphs: [
      "Si un producto llega dañado, contáctanos lo antes posible por WhatsApp o correo e incluye fotos claras del empaque, daño y producto completo.",
      "Con esa información revisaremos el caso y coordinaremos una solución razonable según corresponda.",
    ],
  },
  {
    title: "Cómo contactarnos",
    paragraphs: [
      "Puedes escribirnos por WhatsApp o al correo de contacto publicado en el sitio. Te responderemos para revisar la situación y coordinar los pasos siguientes.",
    ],
  },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-4xl border border-border bg-white p-6 shadow-soft sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-coffee">
          Atención postventa
        </p>
        <h1 className="mt-4 text-3xl font-black leading-tight text-text-dark sm:text-5xl">
          Cambios y devoluciones
        </h1>
        <p className="mt-5 text-base leading-8 text-text-secondary sm:text-lg">
          Queremos que recibas una pieza en buen estado y acorde a lo comprado.
          Si algo no está bien, revisaremos tu caso con cuidado.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-text-dark">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-text-secondary sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 rounded-2xl bg-cream/70 p-4 text-sm font-semibold leading-7 text-text-secondary">
          Esta información puede actualizarse según las condiciones del negocio.
        </p>
      </article>
    </main>
  );
}
