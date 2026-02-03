import { apiFetch } from "./api";
import { getToken } from "./getToken";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOpts = {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
};

const toRecordHeaders = (
  h?: HeadersInit,
): Record<string, string> | undefined => {
  if (!h) return undefined;
  if (h instanceof Headers) return Object.fromEntries(h.entries());
  if (Array.isArray(h)) return Object.fromEntries(h);
  return h;
};

const buildQuery = (params: Record<string, any> = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (key === "startDate" || key === "endDate") {
      // accept Date or string/date-like
      const d = value instanceof Date ? value : new Date(value);
      query.append(key, d.toISOString());
    } else {
      query.append(key, String(value));
    }
  });

  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

// ===== Order API (apiFetch style) =====

export async function addOrder(
  body: any,
  headers?: HeadersInit,
  opts?: FetchOpts,
) {
  const url = `${API_BASE}/order/add`;

  return apiFetch<any>(url, {
    method: "POST",
    body,
    headers: toRecordHeaders(headers), // ✅ fixed
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function createPaymentIntent(body: any, opts?: FetchOpts) {
  const url = `${API_BASE}/order/create-payment-intent`;
  return apiFetch<any>(url, {
    method: "POST",
    body,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getOrderStats(
  params: { startDate?: Date | string; endDate?: Date | string } = {},
  opts?: FetchOpts & { token?: string },
) {
  const url = `${API_BASE}/order/stats${buildQuery(params)}`;

  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getRecentOrders(opts?: FetchOpts & { token?: string }) {
  const url = `${API_BASE}/order/recent`;
  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getTopProducts(
  params: {
    startDate?: Date | string;
    endDate?: Date | string;
    limit?: number | string;
  } = {},
  opts?: FetchOpts & { token?: string },
) {
  const url = `${API_BASE}/order/top-products${buildQuery(params)}`;
  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getOrderOverview(
  params: { startDate?: Date | string; endDate?: Date | string } = {},
  opts?: FetchOpts & { token?: string },
) {
  const url = `${API_BASE}/order/overview${buildQuery(params)}`;

  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getOrdersPaginated(
  params: Record<string, any> = {},
  opts?: {
    token?: string;
    cache?: RequestCache;
    next?: { revalidate?: number | false };
  },
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (key === "startDate" || key === "endDate") {
      const d = value instanceof Date ? value : new Date(value);
      query.append(key, d.toISOString());
    } else {
      query.append(key, String(value));
    }
  });

  const url = `${API_BASE}/order/paginated?${query.toString()}`;

  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getOrderById(
  id: string | number,
  opts?: {
    token?: string;
    cache?: RequestCache;
    next?: { revalidate?: number | false };
  },
) {
  const url = `${API_BASE}/order/${id}`;
  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getOrderCredentials(
  id: string | number,
  opts?: {
    token?: string;
    cache?: RequestCache;
    next?: { revalidate?: number | false };
  },
) {
  const url = `${API_BASE}/orders/credentials/${id}`;
  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function submitProductReview(
  reviewData: {
    orderId: string;
    productId: string;
    rating: number;
    comment?: string;
  },
  opts?: FetchOpts & { token?: string },
) {
  const url = `${API_BASE}/order/review`;

  return apiFetch<any>(url, {
    method: "POST",
    body: reviewData,
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getProductReviews(opts?: FetchOpts & { token?: string }) {
  const url = `${API_BASE}/order/reviews`;

  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getReviewableOrders(
  opts?: FetchOpts & { token?: string },
) {
  const url = `${API_BASE}/order/reviewable-orders`;

  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function getPaymentMethods(opts?: { token?: string }) {
  const url = `${API_BASE}/order/payment-methods`;
  const res = await apiFetch<any>(url, {
    token: opts?.token,
    cache: "no-store",
  });
  return res?.data; // return just data
}
// /payment/checkout
export async function checkoutPayment(paymentData: { body: any }) {
  const token = await getToken();
  const url = `${API_BASE}/payment/checkout`;
  return apiFetch<any>(url, {
    method: "POST",
    body: paymentData.body,
    token: token || undefined,
  });
}

// ===== SSG wrappers (force-cache) =====

export const addOrderSSG = (
  body: any,
  headers?: HeadersInit,
  opts?: FetchOpts,
) => addOrder(body, headers, { cache: "force-cache", next: opts?.next });

export const createPaymentIntentSSG = (body: any, opts?: FetchOpts) =>
  createPaymentIntent(body, { cache: "force-cache", next: opts?.next });

export const getOrderStatsSSG = (
  params: { startDate?: Date | string; endDate?: Date | string } = {},
  opts?: FetchOpts,
) => getOrderStats(params, { cache: "force-cache", next: opts?.next });

export const getRecentOrdersSSG = (opts?: FetchOpts) =>
  getRecentOrders({ cache: "force-cache", next: opts?.next });

export const getTopProductsSSG = (
  params: {
    startDate?: Date | string;
    endDate?: Date | string;
    limit?: number | string;
  } = {},
  opts?: FetchOpts,
) => getTopProducts(params, { cache: "force-cache", next: opts?.next });

export const getOrderOverviewSSG = (
  params: { startDate?: Date | string; endDate?: Date | string } = {},
  opts?: FetchOpts,
) => getOrderOverview(params, { cache: "force-cache", next: opts?.next });

export const getOrdersPaginatedSSG = (
  params: Record<string, any> = {},
  opts?: FetchOpts,
) => getOrdersPaginated(params, { cache: "force-cache", next: opts?.next });

export const getOrderByIdSSG = (id: string | number, opts?: FetchOpts) =>
  getOrderById(id, { cache: "force-cache", next: opts?.next });

export const getOrderCredentialsSSG = (id: string | number, opts?: FetchOpts) =>
  getOrderCredentials(id, { cache: "force-cache", next: opts?.next });

export const submitProductReviewSSG = (reviewData: any, opts?: FetchOpts) =>
  submitProductReview(reviewData, { cache: "force-cache", next: opts?.next });

export const getProductReviewsSSG = (opts?: FetchOpts) =>
  getProductReviews({ cache: "force-cache", next: opts?.next });

export const getReviewableOrdersSSG = (opts?: FetchOpts) =>
  getReviewableOrders({ cache: "force-cache", next: opts?.next });

export const getPaymentMethodsSSG = (opts?: FetchOpts) => getPaymentMethods();
