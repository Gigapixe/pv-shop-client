import { apiFetch } from "./api";
import type { Category, ApiResponse } from "@/types/category";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllCategories(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  const response = `${API_BASE}/category/show/catalog`;
  return await apiFetch<any>(response, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}
export async function getAllBlogCategories(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  const response = `${API_BASE}/blog-category`;
  return await apiFetch<any>(response, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getCategoryParents(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  const response = `${API_BASE}/category/parent`;
  return await apiFetch<ApiResponse<Category[]>>(response, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}
// /category/show/catalog
export async function getShowingCatalogCategorys(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  const response = `${API_BASE}/category/popular`;
  return await apiFetch<ApiResponse<Category[]>>(response, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}
export async function getCategoryBySlug(slug?: string) {
  const url = slug
    ? `${API_BASE}/category/get-category-by-parent-slug?slug=${slug}`
    : `${API_BASE}/category/get-category-by-parent-slug`;

  return await apiFetch<ApiResponse<Category[]>>(url, {
    cache: "no-cache",
  });
}
// /category/get-product-by-category-slug?slug=app-store-itunes-usa&ip=
export async function getProductsByCategorySlug(
  slug: string,
  opts?: { ip: string },
) {
  const url = `${API_BASE}/category/get-product-by-category-slug?slug=${slug}&ip=${opts?.ip || ""}`;
  return await apiFetch<any>(url, {
    cache: "no-cache",
  });
}

// SSG wrappers
export const getAllCategoriesSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getAllCategories({ cache: "force-cache", next: opts?.next });

export const getCategoryParentsSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getCategoryParents({ cache: "force-cache", next: opts?.next });

export const getShowingCatalogCategorysSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getShowingCatalogCategorys({ cache: "force-cache", next: opts?.next });

export const getAllBlogCategoriesSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getAllBlogCategories({ cache: "force-cache", next: opts?.next });
