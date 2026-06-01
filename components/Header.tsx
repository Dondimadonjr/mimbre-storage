"use client";

import { useEffect, useState } from "react";
import { getCartItemCount } from "@/lib/cart";
import CartDrawer from "./CartDrawer";
import ScrollLink from "@/components/ScrollLink";

const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#productos", label: "Productos" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-[#9B6842]/10 bg-[#F8F3EC]/85 shadow-[0_14px_40px_rgba(93,58,31,0.08)] backdrop-blur-xl"
            : "bg-[#F8F3EC]/70 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* Logo */}
          <ScrollLink
            href="/#inicio"
            onClick={closeMenu}
            className="group flex items-center gap-3"
            aria-label="Ir al inicio"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#9B6842] text-base font-black text-white shadow-[0_10px_25px_rgba(155,104,66,0.25)] transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
            M
            </span>

            <span className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight text-[#18251D]">
                Mimbre Store
              </span>
              <span className="mt-1 hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9B6842]/70 sm:block">
               Hecho a mano
              </span>
            </span>
          </ScrollLink>

          {/* Navegación escritorio */}
          <div className="hidden items-center gap-2 rounded-full border border-[#9B6842]/10 bg-white/45 p-1 shadow-[0_10px_35px_rgba(93,58,31,0.05)] md:flex">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.href}
                href={link.href}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#4C5A52] transition duration-300 hover:bg-white hover:text-[#9B6842] hover:shadow-sm"
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Carrito */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#9B6842]/15 bg-white/55 text-[#9B6842] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_30px_rgba(155,104,66,0.18)]"
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
                <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#F8F3EC] bg-[#9B6842] px-1.5 text-xs font-black text-white shadow-md">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            
            {/* Botón mobile */}
            {menuOpen ? (
            <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#9B6842]/15 bg-white/55 text-[#18251D] shadow-sm transition duration-300 hover:bg-white md:hidden"
                aria-label="Cerrar menú"
                aria-expanded="true"
                aria-controls="menu-mobile"
            >
                <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
                </svg>
            </button>
            ) : (
            <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#9B6842]/15 bg-white/55 text-[#18251D] shadow-sm transition duration-300 hover:bg-white md:hidden"
                aria-label="Abrir menú"
                aria-expanded="false"
                aria-controls="menu-mobile"
            >
                <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7h16M4 12h16M4 17h16"
                />
                </svg>
            </button>
            )}
          </div>
        </nav>

        {/* Menú mobile */}
       <div
        id="menu-mobile"
        className={`overflow-hidden border-t border-[#9B6842]/10 bg-[#F8F3EC]/95 px-5 shadow-[0_20px_40px_rgba(93,58,31,0.08)] backdrop-blur-xl transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-80 pb-5 pt-2" : "max-h-0"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-2xl px-4 py-3 text-base font-bold text-[#4C5A52] transition hover:bg-white hover:text-[#9B6842]"
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>
        </div>
      </header>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

      <div className="h-[72px]" />
    </>
  );
}