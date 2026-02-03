import { apiFetch } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOpts = {
  token?: string;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
};

export type ApiResponse<T> = {
  status: "success" | "error";
  data?: T;
  message?: string;
};

export type WishlistItem = {
  _id: string;
  [key: string]: any;
};

export type WishlistMap = Record<string, WishlistItem[]>;

/* =========================
   Wishlist
========================= */

// 1) Get wishlist
export async function getWishlist(opts?: FetchOpts) {
  const url = `${API_BASE}/wishlist`;
  return apiFetch<ApiResponse<WishlistMap>>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
    // redirectOnAuthError: false,
  });
}

// 2) Add category
export async function addNewCategory(categoryName: string, opts?: FetchOpts) {
  const url = `${API_BASE}/wishlist/category`;
  return apiFetch<ApiResponse<WishlistMap>>(url, {
    method: "POST",
    body: { categoryName },
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
    // redirectOnAuthError: false,
  });
}

// 3) Edit category
export async function editNewCategory(
  oldName: string,
  newName: string,
  opts?: FetchOpts,
) {
  const url = `${API_BASE}/wishlist/category`;
  return apiFetch<ApiResponse<WishlistMap>>(url, {
    method: "PUT",
    body: { oldName, newName },
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
    // redirectOnAuthError: false,
  });
}

// 4) Delete category
export async function deleteNewCategory(
  categoryName: string,
  opts?: FetchOpts,
) {
  const url = `${API_BASE}/wishlist/category/${encodeURIComponent(categoryName)}`;
  return apiFetch<ApiResponse<WishlistMap>>(url, {
    method: "DELETE",
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
    // redirectOnAuthError: false,
  });
}

// 5) Add product to wishlist
export async function addProductToWishlist(
  productId: string,
  categoryName: string,
  opts?: FetchOpts,
) {
  const url = `${API_BASE}/wishlist/product`;
  return apiFetch<ApiResponse<WishlistMap>>(url, {
    method: "POST",
    body: { productId, categoryName },
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
    // redirectOnAuthError: false,
  });
}

// 6) Remove product from wishlist
export async function removeProductFromWishlist(
  categoryName: string,
  productId: string,
  opts?: FetchOpts,
) {
  const url = `${API_BASE}/wishlist/product/${encodeURIComponent(
    categoryName,
  )}/${encodeURIComponent(productId)}`;

  return apiFetch<ApiResponse<WishlistMap>>(url, {
    method: "DELETE",
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
    // redirectOnAuthError: false,
  });
}

// 7) Move product between categories
export async function moveNewProduct(
  productId: string,
  fromCategory: string,
  toCategory: string,
  opts?: FetchOpts,
) {
  const url = `${API_BASE}/wishlist/product/move`;
  return apiFetch<ApiResponse<WishlistMap>>(url, {
    method: "PUT",
    body: { productId, fromCategory, toCategory },
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
    // redirectOnAuthError: false,
  });
}
