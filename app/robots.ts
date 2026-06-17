import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mimbre-storage.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/login",
        "/panel-rm",
        "/panel-rm/login",
        "/api",
        "/carrito",
        "/pago/checkout",
        "/pago/retorno",
        "/pago/resultado",
        "/pago/retorno/resultado",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
