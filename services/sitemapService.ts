import { apiFetch } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface SitemapData {
  products: { slug: string }[];
  category: { slug: string }[];
  pages: { slug: string }[];
}

export interface SitemapResponse {
  status: string;
  data: SitemapData;
}

/**
 * Fetch all slugs for sitemap generation (products, categories, pages)
 */
export async function generateSitemap(): Promise<SitemapResponse> {
  const url = `${API_BASE}/customer/get-slug-all`;
  return apiFetch<SitemapResponse>(url, {
    method: "GET",
    next: { revalidate: 30 }, // Use ISR with 30s revalidation instead of no-store
  });
}
