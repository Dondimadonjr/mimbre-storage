import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Raíz y Mimbre Admin",
    short_name: "R&M Admin",
    description: "Panel de pedidos y gestión para Raíz y Mimbre.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#FAF6F0",
    theme_color: "#2E3B1F",
    lang: "es-CL",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
