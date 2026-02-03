import { apiFetch } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPopularProducts(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  const response = `${API_BASE}/products/popular`;
  return await apiFetch<any>(response, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getCategoryProductsSearch(
  params?: {
    title?: string;
    category?: string;
    ip?: string;
  },
  opts?: {
    cache?: RequestCache;
    next?: { revalidate?: number | false };
  },
) {
  const qs = new URLSearchParams();

  if (params?.title) qs.set("title", params.title);
  if (params?.category) qs.set("category", params.category);
  if (params?.ip) qs.set("ip", params.ip);

  const url = `${API_BASE}/products/search-box${qs.toString() ? `?${qs}` : ""}`;

  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getCategorySearch(
  params?: {
    q?: string;
    ip?: string;
  },
  opts?: {
    cache?: RequestCache;
    next?: { revalidate?: number | false };
  },
) {
  const qs = new URLSearchParams();

  if (params?.q) qs.set("q", params.q);
  if (params?.ip) qs.set("ip", params.ip);

  const url = `${API_BASE}/category/search${qs.toString() ? `?${qs}` : ""}`;

  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-cache",
    next: opts?.next,
  });
}

export async function getShowingStoreProducts(
  params?: {
    category?: string;
    title?: string;
    slug?: string;
    ip?: string;
  },
  opts?: {
    cache?: RequestCache;
    next?: { revalidate?: number | false };
  },
) {
  const qs = new URLSearchParams();

  if (params?.category) qs.set("category", params.category);
  if (params?.title) qs.set("title", params.title);
  if (params?.slug) qs.set("slug", params.slug);
  if (params?.ip) qs.set("ip", params.ip);

  const url = `${API_BASE}/products/store${qs.toString() ? `?${qs}` : ""}`;

  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export const getPopularProductsSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getPopularProducts({ cache: "force-cache", next: opts?.next });

export async function getTrendingProducts(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  const response = `${API_BASE}/products/trending`;
  return await apiFetch<any>(response, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}
export const getTrendingProductsSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getTrendingProducts({ cache: "force-cache", next: opts?.next });

export async function getBestSellerProducts(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  const response = `${API_BASE}/products/best-sale`;
  return await apiFetch<any>(response, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}
export const getBestSellerProductsSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getBestSellerProducts({ cache: "force-cache", next: opts?.next });

// /products/you-may-like
export async function getYouMayLikeProducts(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}) {
  const url = `${API_BASE}/products/you-may-like`;
  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}
export const getYouMayLikeProductsSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getYouMayLikeProducts({ cache: "force-cache", next: opts?.next });

// /products/get-product-by-slug-with-related-product?slug=app-store-itunes-gift-card-austria-10&ip=
export async function getProductAndRelatedBySlug(
  slug: string,
  opts?: { ip: string },
) {
  const url = `${API_BASE}/products/get-product-by-slug-with-related-product?slug=${slug}&ip=${opts?.ip || ""}`;
  return await apiFetch<any>(url, {
    cache: "no-cache",
  });
}

// /products/store?category=${category}&title=${title}&slug=${slug}&ip=${ip}
export async function getProductsByFilters(
  category?: string,
  title?: string,
  slug?: string,
  ip?: string,
) {
  let url = `${API_BASE}/products/store?`;
  if (category) url += `category=${category}&`;
  if (title) url += `title=${title}&`;
  if (slug) url += `slug=${slug}&`;
  if (ip) url += `ip=${ip}&`;
  // remove the last &
  url = url.slice(0, -1);
  return await apiFetch<any>(url, {
    cache: "no-cache",
  });
}

// /country/all
export async function getAllCountries() {
  const url = `${API_BASE}/country/all`;
  return await apiFetch<any>(url, {
    cache: "no-cache",
  });
}


export const getCategorySearchSSG = (params?: { q?: string; ip?: string }, opts?: {
  next?: { revalidate?: number | false };
}) => getCategorySearch(params, { cache: "force-cache", next: opts?.next });

export const getShowingStoreProductsSSG = (
  params?: { category?: string; title?: string; slug?: string; ip?: string },
  opts?: { next?: { revalidate?: number | false } }
) => getShowingStoreProducts(params, { cache: "force-cache", next: opts?.next });
