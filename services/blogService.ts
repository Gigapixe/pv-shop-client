import { apiFetch } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOpts = {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
};

// 1) All blogs
export async function getAllBlogs(
  page = 1,
  limit = 12,
  opts?: FetchOpts
) {
  const url = `${API_BASE}/blogs?page=${page}&limit=${limit}`;
  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export const getAllBlogsSSG = (
  page = 1,
  limit = 12,
  opts?: Omit<FetchOpts, "cache"> // we force cache below
) => getAllBlogs(page, limit, { cache: "force-cache", next: opts?.next });

// 2) Blog by slug
export async function getBlogBySlug(slug: string, opts?: FetchOpts) {
  const url = `${API_BASE}/blogs/${slug}`;
  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export const getBlogBySlugSSG = (slug: string, opts?: Omit<FetchOpts, "cache">) =>
  getBlogBySlug(slug, { cache: "force-cache", next: opts?.next });

// 3) Featured blogs
export async function getFeaturedBlogs(opts?: FetchOpts) {
  const url = `${API_BASE}/blogs/featured`;
  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export const getFeaturedBlogsSSG = (opts?: Omit<FetchOpts, "cache">) =>
  getFeaturedBlogs({ cache: "force-cache", next: opts?.next });

// 4) Blogs by category
export async function getBlogsByCategory(
  category: string,
  page = 1,
  limit = 10,
  opts?: FetchOpts
) {
  const url = `${API_BASE}/blogs/category/${category}?page=${page}&limit=${limit}`;
  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export const getBlogsByCategorySSG = (
  category: string,
  page = 1,
  limit = 10,
  opts?: Omit<FetchOpts, "cache">
) => getBlogsByCategory(category, page, limit, { cache: "force-cache", next: opts?.next });

// 5) Blogs by tag
export async function getBlogsByTag(
  tag: string,
  page = 1,
  limit = 10,
  opts?: FetchOpts
) {
  const url = `${API_BASE}/blogs/tag/${tag}?page=${page}&limit=${limit}`;
  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export const getBlogsByTagSSG = (
  tag: string,
  page = 1,
  limit = 10,
  opts?: Omit<FetchOpts, "cache">
) => getBlogsByTag(tag, page, limit, { cache: "force-cache", next: opts?.next });

// 6) Increment blog views (write op → usually no-store)
export async function incrementBlogViews(id: string, opts?: FetchOpts) {
  const url = `${API_BASE}/blogs/${id}/views`;
  return await apiFetch<any>(url, {
    method: "PUT",
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

// 7) Related blogs
export async function getRelatedBlogs(
  id: string,
  limit = 4,
  opts?: FetchOpts
) {
  const url = `${API_BASE}/blogs/${id}/related?limit=${limit}`;
  return await apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export const getRelatedBlogsSSG = (
  id: string,
  limit = 4,
  opts?: Omit<FetchOpts, "cache">
) => getRelatedBlogs(id, limit, { cache: "force-cache", next: opts?.next });


/* =========================
   Blogs by author
========================= */

export async function getBlogsByAuthor(
  slug: string,
  page = 1,
  limit = 10,
  opts?: FetchOpts
) {
  const url = `${API_BASE}/authors/${slug}/blogs?page=${page}&limit=${limit}`;
  return apiFetch<any>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export const getBlogsByAuthorSSG = (
  slug: string,
  page = 1,
  limit = 10,
  opts?: Omit<FetchOpts, "cache">
) =>
  getBlogsByAuthor(slug, page, limit, {
    cache: "force-cache",
    next: opts?.next,
  });