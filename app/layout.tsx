import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mimbre-storage.vercel.app";
const siteDescription =
  "Piezas artesanales en mimbre, madera y junco para el hogar. Productos, reparaciones, tapizado y trabajos a pedido.";
const socialImage = "/image/imagenHome.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raíz y Mimbre",
    template: "%s | Raíz y Mimbre",
  },
  description: siteDescription,
  openGraph: {
    title: "Raíz y Mimbre",
    description: siteDescription,
    siteName: "Raíz y Mimbre",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Productos artesanales de mimbre de Raíz y Mimbre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raíz y Mimbre",
    description: siteDescription,
    images: [socialImage],
  },
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
