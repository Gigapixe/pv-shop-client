import { apiFetch } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPageBySlug(
  slug: string,
  opts?: { cache?: RequestCache; next?: { revalidate?: number | false } },
) {
  const response = `${API_BASE}/pages/${slug}`;
  return await apiFetch<any>(response, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getAllPages(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  // Use the slug-all endpoint as /pages seems not to exist
  const url = `${API_BASE}/customer/get-slug-all`;
  const result = await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
  // Transform response to match expected structure { data: [{slug: ...}] }
  return { data: result?.data?.pages || [] };
}

export const getPageBySlugSSG = (
  slug: string,
  opts?: { next?: { revalidate?: number | false } },
) => getPageBySlug(slug, { cache: "force-cache", next: opts?.next });

export const getAllPagesSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getAllPages({ cache: "force-cache", next: opts?.next });
