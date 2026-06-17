import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Raíz y Mimbre",
    short_name: "Raíz y Mimbre",
    description:
      "Tienda de decoración artesanal en mimbre, fibras naturales y madera.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FAF6F0",
    theme_color: "#8B5E3C",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}