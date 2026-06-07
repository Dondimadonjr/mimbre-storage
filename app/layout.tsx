import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mimbre-storage.vercel.app";
const siteDescription =
  "Tienda online de productos artesanales de mimbre en Chile: canastos, decoración, bandejas y piezas tejidas a mano para el hogar.";
const socialImage = "/image/imagenHome.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mimbre Store",
    template: "%s | Mimbre Store",
  },
  description: siteDescription,
  openGraph: {
    title: "Mimbre Store",
    description: siteDescription,
    siteName: "Mimbre Store",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Productos artesanales de mimbre de Mimbre Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mimbre Store",
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
