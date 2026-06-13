"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getCartItemCount } from "@/lib/cart";
import CartDrawer from "./CartDrawer";
import ScrollLink from "@/components/ScrollLink";

const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#productos", label: "Productos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || "56972086522";

  useEffect(() => {
    const updateCount = () => {
      setCartCount(getCartItemCount());
    };

    updateCount();

    window.addEventListener("storage", updateCount);
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("cart:updated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("cart:updated", updateCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b px-3 transition-[background-color,box-shadow,backdrop-filter,padding] duration-500 sm:px-4 ${
          scrolled
            ? "border-coffee/10 bg-cream/92 py-2 shadow-[0_12px_36px_rgba(93,58,31,0.09)] backdrop-blur-xl"
            : "border-coffee/0 bg-cream/76 py-4 shadow-none backdrop-blur-md"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between transition-[height] duration-500 ${
            scrolled ? "h-14.5" : "h-19"
          }`}
        >
          {/* Logo */}
          <ScrollLink
            href="/#inicio"
            onClick={closeMenu}
            className="group flex min-w-0 items-center gap-3 transition duration-300 hover:-translate-y-0.5"
            aria-label="Ir al inicio"
          >
            <span
              className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_10px_25px_rgba(139,94,60,0.18)] ring-1 ring-coffee/10 transition duration-300 group-hover:scale-105 ${
                scrolled ? "h-10 w-10" : "h-12 w-12"
              }`}
            >
              <Image
                src="/image/logo.png"
                alt="Raíz y Mimbre"
                fill
                priority
                unoptimized
                sizes="48px"
                className="object-contain object-center p-2"
              />
            </span>

            <span className="flex flex-col leading-none">
              <span
                className={`font-black tracking-tight text-text-dark transition-all duration-300 ${
                  scrolled ? "text-lg" : "text-xl"
                }`}
              >
                Raíz y Mimbre
              </span>
              <span
                className={`mt-1 hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-coffee/70 transition-all duration-300 sm:block ${
                  scrolled ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
                }`}
              >
               Hecho a mano
              </span>
            </span>
          </ScrollLink>

          {/* Navegación escritorio */}
          <div className="hidden items-center gap-1 rounded-full border border-coffee/10 bg-white/58 p-1 shadow-[0_10px_35px_rgba(93,58,31,0.05)] md:flex">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.href}
                href={link.href}
                className="group relative rounded-full px-3.5 py-2.5 text-sm font-semibold text-text-secondary transition duration-300 hover:bg-white hover:text-coffee hover:shadow-sm lg:px-5"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-coffee transition-all duration-300 group-hover:w-5" />
              </ScrollLink>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Carrito */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-coffee/15 bg-white/66 text-coffee shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-coffee-dark hover:shadow-[0_12px_30px_rgba(139,94,60,0.18)] active:scale-95"
              aria-label="Abrir carrito de compras"
            >
              <svg
                className="h-6 w-6 transition duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-cream bg-coffee px-1.5 text-xs font-black text-white shadow-md">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            
            {/* Botón mobile */}
            <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-coffee/15 bg-white/66 text-text-dark shadow-sm transition duration-300 hover:bg-white active:scale-95 md:hidden"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
            >
                <span className="relative h-5 w-5" aria-hidden="true">
                  <span
                    className={`absolute left-0 top-1 h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                      menuOpen ? "translate-y-2 rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-2.5 h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                      menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                    }`}
                  />
                </span>
            </button>
          </div>
        </nav>

        {/* Menú mobile */}
       <div
        id="menu-mobile"
        className={`mx-auto max-w-7xl overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-105 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 rounded-[1.75rem] border border-coffee/10 bg-cream/96 p-2 shadow-[0_22px_55px_rgba(93,58,31,0.12)] backdrop-blur-xl">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-bold text-text-secondary transition duration-300 hover:bg-white hover:text-coffee"
              >
                <span>{link.label}</span>
                <span className="text-coffee">→</span>
              </ScrollLink>
            ))}

            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex justify-center rounded-2xl bg-coffee px-4 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(139,94,60,0.22)] transition hover:bg-coffee-dark active:scale-[0.98]"
              onClick={closeMenu}
            >
              Comprar por WhatsApp
            </a>
          </div>
        </div>
      </header>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

      <div className="h-23" />
    </>
  );
}
