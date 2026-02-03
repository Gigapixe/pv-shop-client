import { apiFetch } from "./api";
import { Banner } from "@/types/banner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface BannerResponse {
  success: boolean;
  data: Banner[];
}

export async function getAllBanners(opts?: {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
}): Promise<Banner[]> {
  const url = `${API_BASE}/banner/all`;
  const res = await apiFetch<BannerResponse>(url, {
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
  return res?.data || [];
}

export const getAllBannersSSG = (opts?: {
  next?: { revalidate?: number | false };
}) => getAllBanners({ cache: "force-cache", next: opts?.next });
