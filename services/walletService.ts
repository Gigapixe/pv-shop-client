
import { apiFetch } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOpts = {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
};

const toRecordHeaders = (
  h?: HeadersInit
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
    query.append(key, String(value));
  });

  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

// ===== Wallet API (apiFetch style) =====

// ✅ transactions list (paginated)
export async function getWalletTransactions(
  params: { page?: number | string; limit?: number | string } = {},
  opts?: FetchOpts & { token?: string }
) {
  const url = `${API_BASE}/wallet/transactions${buildQuery(params)}`;

  return apiFetch<any>(url, {
    token: opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

// ✅ optional: wallet summary/balance endpoint (only if you have it)
// export async function getWalletSummary(opts?: FetchOpts & { token?: string }) {
//   const url = `${API_BASE}/wallet/summary`;
//   return apiFetch<any>(url, {
//     token: opts?.token,
//     cache: opts?.cache ?? "no-store",
//     next: opts?.next,
//   });
// }

// ✅ optional: create topup intent (only if you have it)
// export async function createWalletTopupIntent(
//   body: { amount: number },
//   opts?: FetchOpts & { token?: string }
// ) {
//   const url = `${API_BASE}/wallet/topup-intent`;
//   return apiFetch<any>(url, {
//     method: "POST",
//     body,
//     token: opts?.token,
//     cache: opts?.cache ?? "no-store",
//     next: opts?.next,
//   });
// }

// ===== SSG wrappers (force-cache) =====
export const getWalletTransactionsSSG = (
  params: { page?: number | string; limit?: number | string } = {},
  opts?: FetchOpts & { token?: string }
) =>
  getWalletTransactions(params, {
    token: opts?.token,
    cache: "force-cache",
    next: opts?.next,
  });
