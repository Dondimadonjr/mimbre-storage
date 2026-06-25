"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const navigationLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

const legalLinks = [
  { href: "/politica-privacidad", label: "Política de privacidad" },
  { href: "/terminos", label: "Términos de servicio" },
  { href: "/cambios-devoluciones", label: "Cambios y devoluciones" },
  { href: "/faq", label: "Preguntas frecuentes" },
];

const socialLinks = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110 2.881 1.44 1.44 0 010-2.881z" />
    ),
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
  },
];

const footerLinkClass =
  "focus-ring inline-flex w-fit rounded-lg text-base font-semibold text-coffee transition duration-300 hover:-translate-y-0.5 hover:text-coffee-dark";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappPhone = "56972086522";
  const whatsappUrl = `https://wa.me/${whatsappPhone}`;

  return (
    <footer className="section-reveal bg-cream px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-4xl border border-coffee/12 bg-white p-5 shadow-soft sm:rounded-[2.5rem] sm:p-6">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr]">
            <section className="lg:pr-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white border border-coffee/15 shadow-sm sm:h-18 sm:w-18">
                  <Image
                    src="/image/logo.png"
                    alt="Raíz y Mimbre"
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-contain object-center p-2"
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-2xl font-black tracking-[-0.03em] text-text-dark sm:text-[1.75rem] lg:text-2xl">
                    Raíz y Mimbre
                  </p>
                  <p className="mt-1 text-[0.7rem] font-black uppercase tracking-[0.26em] text-coffee/70 sm:text-xs">
                    Artesanía chilena
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-lg text-base leading-6 text-text-secondary sm:text-base sm:leading-7">
                Piezas de mimbre, fibras naturales y trabajos a pedido para
                espacios cálidos, funcionales y con carácter.
              </p>
            </section>

            <FooterColumn title="Navegación">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Información">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Contacto">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex w-fit rounded-lg text-sm font-semibold text-coffee transition duration-300 hover:-translate-y-0.5 hover:text-coffee-dark"
                >
                  WhatsApp: {whatsappPhone}
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@mimbrestore.cl"
                  className="focus-ring inline-flex w-fit rounded-lg text-sm font-semibold text-coffee transition duration-300 hover:-translate-y-0.5 hover:text-coffee-dark"
                >
                  contacto@mimbrestore.cl
                </a>
              </li>
              <li>
                <p className="max-w-xs text-base font-medium leading-6 text-text-secondary">
                  Respondemos consultas por productos, reparaciones y trabajos a pedido.
                </p>
              </li>
            </FooterColumn>
          </div>

          <div className="mt-7 border-t border-coffee/12 pt-5 space-y-3">
            <div className="rounded-lg bg-cream/40 px-4 py-3 border border-coffee/8">
              <p className="text-sm font-medium text-text-secondary leading-6">
                Compra coordinada por WhatsApp, pagos seguros vía Webpay y atención directa para piezas disponibles o encargos especiales.
              </p>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-base font-semibold text-text-dark">
                © {currentYear} Raíz y Mimbre
              </p>
              <p className="text-sm font-medium text-coffee/70">
                Hecho a mano · Mimbre · Hogar · Restauración
              </p>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-[#10291E]/50 via-[#5A321C]/50 to-[#10291E]/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h4 className="text-sm font-black uppercase tracking-[0.24em] text-coffee">
        {title}
      </h4>
      <ul className="mt-4 space-y-4">{children}</ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-coffee/15 bg-cream text-coffee transition duration-300 hover:-translate-y-0.5 hover:bg-coffee hover:text-white active:scale-[0.98]"
    >
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {icon}
      </svg>
    </a>
  );
}

