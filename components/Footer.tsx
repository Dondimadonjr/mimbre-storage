"use client";

import type { ReactNode } from "react";
import ScrollLink from "@/components/ScrollLink";

const footerLinkClass =
  "inline-flex text-white/62 transition duration-300 hover:-translate-y-0.5 hover:text-coffee";

const navigationLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#productos", label: "Productos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

const legalLinks = [
  { href: "/politica-privacidad", label: "Política de Privacidad" },
  { href: "/terminos", label: "Términos de Servicio" },
  { href: "/cambios-devoluciones", label: "Cambios y Devoluciones" },
  { href: "/faq", label: "FAQ" },
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

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || "56972086522";

  return (
    <footer className="bg-text-dark px-4 py-10 text-white sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.22)] backdrop-blur sm:p-8 lg:p-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1fr]">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-coffee/30 bg-coffee text-xl font-black text-white shadow-[0_16px_34px_rgba(139,94,60,0.28)]">
                  R
                </div>
                <div>
                  <p className="text-xl font-black leading-tight">
                    Raíz y Mimbre
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-coffee">
                    Hecho a mano
                  </p>
                </div>
              </div>

              <p className="max-w-sm text-sm leading-7 text-white/68">
                Artesanía en mimbre hecha a mano con pasión y diseño premium.
              </p>
              <p className="max-w-sm text-sm font-semibold leading-7 text-cream/82">
                Piezas, reparaciones y trabajos a pedido.
              </p>
            </div>

            <FooterColumn title="Navegación">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <ScrollLink href={link.href} className={footerLinkClass}>
                    {link.label}
                  </ScrollLink>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Información">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={footerLinkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Contacto">
              <li>
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  WhatsApp: {whatsappPhone}
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@mimbrestore.cl"
                  className={footerLinkClass}
                >
                  contacto@mimbrestore.cl
                </a>
              </li>
              <li>
                <p className="max-w-xs text-sm leading-6 text-white/60">
                  Respondemos consultas por productos, reparaciones y trabajos a
                  pedido.
                </p>
              </li>
            </FooterColumn>
          </div>

          <div className="mt-9 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-white/58">
                © {currentYear} Raíz y Mimbre. Todos los derechos reservados.
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition duration-300 hover:-translate-y-0.5 hover:border-coffee/40 hover:bg-coffee hover:text-white"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {link.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
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
      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-coffee">
        {title}
      </h4>
      <ul className="mt-4 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
