import { generateSitemap } from "@/services/sitemapService";
import type { MetadataRoute } from "next";

// Revalidate the sitemap every 30 seconds (ISR)
export const revalidate = 30;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gamingty.com";

  // Fetch sitemap data from API
  let data = { products: [], category: [], pages: [] } as {
    products: { slug: string }[];
    category: { slug: string }[];
    pages: { slug: string }[];
  };

  try {
    const response = await generateSitemap();
    if (response?.data) {
      data = response.data;
    }
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
    // Continue with empty arrays as fallback
  }

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Products
  const productUrls: MetadataRoute.Sitemap = (data.products || []).map(
    (product) => ({
      url: `${baseUrl}/product/${escapeXml(product.slug || "")}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  // Categories
  const categoryUrls: MetadataRoute.Sitemap = (data.category || []).map(
    (cat) => ({
      url: `${baseUrl}/category/${escapeXml(cat.slug || "")}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  // Pages
  const pageUrls: MetadataRoute.Sitemap = (data.pages || []).map((page) => ({
    url: `${baseUrl}/${escapeXml(page.slug || "")}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticUrls, ...productUrls, ...categoryUrls, ...pageUrls];
}
