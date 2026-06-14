import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre productos hechos a mano, servicios, pagos y entrega en Raíz y Mimbre.",
};

const faqs = [
  {
    question: "¿Los productos son hechos a mano?",
    answer:
      "Sí. Las piezas de Raíz y Mimbre se trabajan de forma artesanal, por lo que pueden existir pequeñas variaciones propias del material y del oficio.",
  },
  {
    question: "¿Hacen reparaciones?",
    answer:
      "Sí. Podemos revisar reparaciones de piezas de mimbre u otros trabajos relacionados. Lo ideal es enviar fotos y una descripción del problema para evaluar el caso.",
  },
  {
    question: "¿Trabajan con mimbre, madera y junco?",
    answer:
      "Sí. Además de productos listos para el hogar, realizamos trabajos en mimbre, madera, junco y fibras naturales según el tipo de solicitud.",
  },
  {
    question: "¿Cómo se coordina la entrega?",
    answer:
      "Después de la compra nos contactaremos contigo para coordinar despacho, retiro o detalles de entrega según ubicación y tipo de producto.",
  },
  {
    question: "¿Puedo pedir un trabajo personalizado?",
    answer:
      "Sí. Los trabajos personalizados se revisan caso a caso y pueden requerir cotización, medidas, fotos de referencia y tiempos especiales de elaboración.",
  },
  {
    question: "¿Cómo pago?",
    answer:
      "Las compras del sitio se pagan mediante Webpay/Transbank. Una orden se considera confirmada cuando el pago queda aprobado.",
  },
  {
    question: "¿Qué pasa después de comprar?",
    answer:
      "Recibirás una confirmación de compra y luego coordinaremos contigo los detalles de entrega, retiro o cualquier información adicional necesaria.",
  },
  {
    question: "¿Puedo retirar o coordinar despacho?",
    answer:
      "Sí. La modalidad se coordina después de la compra o consulta, considerando el producto, la dirección y la disponibilidad del negocio.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-4xl border border-border bg-white p-6 shadow-soft sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-coffee">
          Ayuda
        </p>
        <h1 className="mt-4 text-3xl font-black leading-tight text-text-dark sm:text-5xl">
          Preguntas frecuentes
        </h1>
        <p className="mt-5 text-base leading-8 text-text-secondary sm:text-lg">
          Respuestas rápidas para comprar, consultar servicios y coordinar
          piezas artesanales en Raíz y Mimbre.
        </p>

        <div className="mt-10 divide-y divide-border">
          {faqs.map((faq) => (
            <section key={faq.question} className="py-6 first:pt-0 last:pb-0">
              <h2 className="text-lg font-black text-text-dark">
                {faq.question}
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
                {faq.answer}
              </p>
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
