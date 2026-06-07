import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mimbre-storage.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/pago/checkout", "/pago/retorno"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
