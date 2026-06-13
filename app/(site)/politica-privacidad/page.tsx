import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Información sobre cómo Raíz y Mimbre utiliza los datos necesarios para procesar pedidos, consultas y entregas.",
};

const sections = [
  {
    title: "Datos que recopilamos",
    paragraphs: [
      "Para procesar compras y consultas podemos solicitar nombre, correo electrónico, teléfono, dirección, comuna, región y productos comprados.",
      "Estos datos se entregan voluntariamente al comprar, escribir por WhatsApp, completar formularios o coordinar un servicio.",
    ],
  },
  {
    title: "Para qué usamos la información",
    paragraphs: [
      "Usamos tus datos para procesar pedidos, coordinar entrega o retiro, responder consultas, enviar confirmaciones de compra y dar seguimiento a trabajos a pedido.",
      "También podemos usarlos para resolver dudas relacionadas con cambios, devoluciones o servicios como reparación, tapizado y trabajos en fibras naturales.",
    ],
  },
  {
    title: "Pagos y terceros",
    paragraphs: [
      "Los pagos se procesan mediante Webpay/Transbank. Raíz y Mimbre no almacena datos completos de tarjetas ni credenciales bancarias.",
      "Solo registramos la información necesaria para confirmar el estado del pago y asociarlo al pedido correspondiente.",
    ],
  },
  {
    title: "Cuidado de tus datos",
    paragraphs: [
      "No vendemos tus datos personales. La información se utiliza para operar la tienda y entregar una atención correcta.",
      "Puedes solicitar corrección o eliminación de tus datos escribiendo al correo de contacto publicado en el sitio.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Información legal"
      title="Política de privacidad"
      intro="En Raíz y Mimbre cuidamos la información que compartes con nosotros al comprar, consultar o solicitar trabajos a pedido."
      sections={sections}
    />
  );
}

function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; paragraphs: string[] }>;
}) {
  return (
    <main className="min-h-screen bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-4xl border border-border bg-white p-6 shadow-soft sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-coffee">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-black leading-tight text-text-dark sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-base leading-8 text-text-secondary sm:text-lg">
          {intro}
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
