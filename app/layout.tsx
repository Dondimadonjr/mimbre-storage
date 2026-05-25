import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mimbre Store - Artesanía Premium en Mimbre",
  description:
    "Tienda online de productos artesanales en mimbre. Canastas, decoración y accesorios únicos tejidos a mano.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}