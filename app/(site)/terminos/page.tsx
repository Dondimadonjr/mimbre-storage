import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de servicio",
  description:
    "Condiciones generales de uso, compra, pago y servicios a pedido de Raíz y Mimbre.",
};

const sections = [
  {
    title: "Uso del sitio",
    paragraphs: [
      "Este sitio permite revisar productos artesanales, realizar compras y solicitar información sobre servicios a pedido.",
      "Al usar la tienda aceptas entregar información correcta para que podamos procesar tu pedido y contactarte cuando sea necesario.",
    ],
  },
  {
    title: "Compra de productos",
    paragraphs: [
      "Los productos publicados están sujetos a disponibilidad de stock. Si existiera algún problema de disponibilidad, nos contactaremos contigo para coordinar una solución.",
      "Los precios se muestran en pesos chilenos y pueden cambiar según disponibilidad, materiales o condiciones del negocio.",
    ],
  },
  {
    title: "Pagos",
    paragraphs: [
      "Los pagos se realizan mediante Webpay/Transbank. La confirmación del pedido depende de la aprobación del pago.",
      "Una vez aprobado el pago, recibirás confirmación y podremos coordinar despacho, retiro o detalles de entrega.",
    ],
  },
  {
    title: "Entrega, retiro y servicios",
    paragraphs: [
      "La entrega o retiro se coordina caso a caso, según ubicación, tipo de producto y disponibilidad.",
      "Además de productos listos para el hogar, realizamos trabajos a pedido como reparación, tapizado, madera, mimbre y junco. Estos servicios se cotizan y coordinan de forma personalizada.",
    ],
  },
  {
    title: "Responsabilidad",
    paragraphs: [
      "Hacemos nuestro mejor esfuerzo para mantener la información actualizada y entregar productos en buen estado.",
      "Raíz y Mimbre no se hace responsable por daños derivados de mal uso, desgaste normal, manipulación incorrecta o condiciones externas posteriores a la entrega.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-4xl border border-border bg-white p-6 shadow-soft sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-coffee">
          Condiciones generales
        </p>
        <h1 className="mt-4 text-3xl font-black leading-tight text-text-dark sm:text-5xl">
          Términos de servicio
        </h1>
        <p className="mt-5 text-base leading-8 text-text-secondary sm:text-lg">
          Estos términos explican de forma simple cómo funciona la compra de
          productos y la coordinación de servicios en Raíz y Mimbre.
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
