
import { apiFetch } from "./api";
import { getToken } from "./getToken";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOpts = {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
  token?: string;
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

// -----------------------------
// Referral Services
// -----------------------------

// ✅ Requires auth
export async function getReferralCode(opts?: FetchOpts) {
  const token = opts?.token ?? (await getToken()) ?? undefined;
  const url = `${API_BASE}/referral/my-code`;

  return apiFetch<any>(url, {
    token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

// ✅ Requires auth
export async function getReferralStats(opts?: FetchOpts) {
  const token = opts?.token ?? (await getToken()) ?? undefined;
  const url = `${API_BASE}/referral/stats`;

  return apiFetch<any>(url, {
    token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

// ✅ Requires auth
export async function getReferralList(
  params: { page?: number | string; limit?: number | string; status?: string | null } = {},
  opts?: FetchOpts
) {
  const token = opts?.token ?? (await getToken()) ?? undefined;
  const url = `${API_BASE}/referral/list${buildQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    status: params.status ?? null,
  })}`;

  return apiFetch<any>(url, {
    token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

// ✅ Requires auth
export async function updateReferralCode(newCode: string, opts?: FetchOpts) {
  const token = opts?.token ?? (await getToken()) ?? undefined;
  const url = `${API_BASE}/referral/my-code`;

  return apiFetch<any>(url, {
    method: "PUT",
    body: { newCode },
    token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

// ✅ Public endpoint (no auth)
export async function logReferralVisit(referralCode: string, opts?: FetchOpts) {
  const url = `${API_BASE}/referral/visit`;

  return apiFetch<any>(url, {
    method: "POST",
    body: { referralCode },
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

// ✅ Requires auth
export async function getCommissionHistory(
  params: { page?: number | string; limit?: number | string } = {},
  opts?: FetchOpts
) {
  const token = opts?.token ?? (await getToken()) ?? undefined;
  const url = `${API_BASE}/referral/commission-history${buildQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  })}`;

  return apiFetch<any>(url, {
    token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

// -----------------------------
// Optional SSG wrappers (force-cache)
// -----------------------------
export const getReferralCodeSSG = (opts?: FetchOpts) =>
  getReferralCode({ ...opts, cache: "force-cache" });

export const getReferralStatsSSG = (opts?: FetchOpts) =>
  getReferralStats({ ...opts, cache: "force-cache" });

export const getReferralListSSG = (
  params: { page?: number | string; limit?: number | string; status?: string | null } = {},
  opts?: FetchOpts
) =>
  getReferralList(params, { ...opts, cache: "force-cache" });

export const getCommissionHistorySSG = (
  params: { page?: number | string; limit?: number | string } = {},
  opts?: FetchOpts
) =>
  getCommissionHistory(params, { ...opts, cache: "force-cache" });
