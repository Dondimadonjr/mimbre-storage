"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ScrollLink from "@/components/ScrollLink";

const navigationLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#productos", label: "Productos" },
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
  "focus-ring inline-flex w-fit rounded-lg text-sm font-semibold text-white/64 transition duration-300 hover:-translate-y-0.5 hover:text-coffee";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || "56972086522";

  return (
    <footer className="section-reveal bg-[#132119] px-4 py-5 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(158,104,64,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] shadow-[0_26px_80px_rgba(0,0,0,0.26)] backdrop-blur sm:rounded-[2.25rem]">
          <div className="grid lg:grid-cols-[1.05fr_1.65fr]">
            <div className="border-b border-white/10 p-4 sm:p-7 lg:border-b-0 lg:border-r lg:p-8">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_14px_32px_rgba(139,94,60,0.22)] ring-1 ring-coffee/15 sm:h-13 sm:w-13">
                  <Image
                    src="/image/logo.png"
                    alt="Raíz y Mimbre"
                    fill
                    unoptimized
                    sizes="52px"
                    className="object-contain object-center p-2"
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-lg font-black leading-tight tracking-[-0.02em] sm:text-2xl">
                    Raíz y Mimbre
                  </p>
                  <p className="mt-1 text-[0.66rem] font-black uppercase tracking-[0.22em] text-coffee sm:text-xs">
                    Artesanía chilena
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
                Piezas de mimbre, fibras naturales y trabajos a pedido para
                espacios cálidos, funcionales y con carácter.
              </p>

              <div className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2">
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex h-11 items-center justify-center rounded-full bg-coffee px-5 text-sm font-black text-white text-center shadow-[0_16px_36px_rgba(139,94,60,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-coffee/90 hover:shadow-[0_20px_44px_rgba(139,94,60,0.34)] active:scale-[0.98]"
                >
                  Consultar por WhatsApp
                </a>

                <ScrollLink
                  href="/#productos"
                  className="focus-ring inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/7 px-5 text-sm font-black text-white/84 transition duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:text-white active:scale-[0.98]"
                >
                  Ver productos
                </ScrollLink>
              </div>

              <div className="mt-4 flex items-center gap-2 sm:mt-6">
                {socialLinks.map((link) => (
                  <SocialLink key={link.label} {...link} />
                ))}
              </div>
            </div>

            <div className="hidden p-7 lg:block lg:p-8">
              <div className="grid gap-8 md:grid-cols-3">
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
                      <Link href={link.href} className={footerLinkClass}>
                        {link.label}
                      </Link>
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
                    <p className="max-w-xs text-sm font-medium leading-6 text-white/52">
                      Respondemos consultas por productos, reparaciones,
                      restauraciones y trabajos a pedido.
                    </p>
                  </li>
                </FooterColumn>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/4.5 p-5">
                <p className="text-sm font-semibold leading-6 text-white/66">
                  Compra coordinada por WhatsApp, pagos seguros y atención
                  directa para piezas disponibles o encargos especiales.
                </p>
              </div>
            </div>

            <div className="divide-y divide-white/10 lg:hidden">
              <MobileFooterSection title="Navegación">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <ScrollLink href={link.href} className={footerLinkClass}>
                      {link.label}
                    </ScrollLink>
                  </li>
                ))}
              </MobileFooterSection>

              <MobileFooterSection title="Información">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={footerLinkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </MobileFooterSection>

              <MobileFooterSection title="Contacto">
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
              </MobileFooterSection>
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-3 sm:px-7 sm:py-5 lg:px-8">
            <div className="flex flex-col gap-2 text-[0.76rem] font-medium text-white/46 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
              <p>© {currentYear} Raíz y Mimbre. Todos los derechos reservados.</p>
              <p className="text-white/34">
                Hecho a mano · Mimbre · Hogar · Restauración
              </p>
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
      <h4 className="text-xs font-black uppercase tracking-[0.22em] text-coffee">
        {title}
      </h4>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

function MobileFooterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group px-4 py-3">
      <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl text-xs font-black uppercase tracking-[0.22em] text-coffee [&::-webkit-details-marker]:hidden">
        {title}
        <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/7 text-white/70 transition duration-300 group-open:rotate-45">
          +
        </span>
      </summary>

      <ul className="mt-3 grid gap-2 pb-1">{children}</ul>
    </details>
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
      className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/7 text-white/70 transition duration-300 hover:-translate-y-0.5 hover:border-coffee/40 hover:bg-coffee hover:text-white active:scale-[0.98] sm:h-10 sm:w-10"
    >
      <svg
        className="h-4.5 w-4.5 sm:h-5 sm:w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {icon}
      </svg>
    </a>
  );
}
