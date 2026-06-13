import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mimbre-storage.vercel.app";

type SitemapProduct = {
  id: string;
  created_at: string | null;
};

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${siteUrl}/productos`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${siteUrl}/faq`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${siteUrl}/politica-privacidad`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    url: `${siteUrl}/terminos`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    url: `${siteUrl}/cambios-devoluciones`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
];

async function getAvailableProducts(): Promise<SitemapProduct[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Sitemap products skipped: missing Supabase public config");
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from("products")
    .select("id, created_at")
    .eq("available", true);

  if (error) {
    console.error("Sitemap products query failed:", error.message);
    return [];
  }

  return (data ?? []) as SitemapProduct[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const products = await getAvailableProducts();

  return [
    ...staticRoutes.map((route) => ({ ...route, lastModified })),
    ...products.map((product) => ({
      url: `${siteUrl}/productos/${product.id}`,
      lastModified: product.created_at || lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
