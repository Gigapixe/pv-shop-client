// src/services/redeemService.ts
import { apiFetch } from "./api";
import { getToken } from "./getToken";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOpts = {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
  token?: string;
};

export type GiftCardProduct = {
  image?: string[];
  title?: { en?: string };
  price?: number;
  originalPrice?: number;
};

export type GiftCardPreview = {
  amount: number;
  cardNumber: string;
  expiryDate: string; // ISO
  product?: GiftCardProduct;
};

export type PreviewGiftCardResponse = {
  status: "success" | "error";
  message?: string;
  data: GiftCardPreview;
};

export type RedeemGiftCardResponse = {
  status: "success" | "error";
  message?: string;
  data: {
    newWalletBalance: number;
  };
};

export async function previewGiftCard(
  body: { cardNumber: string },
  opts?: FetchOpts,
) {
  const url = `${API_BASE}/gift-cards/preview`;
  const token = await getToken();

  return apiFetch<PreviewGiftCardResponse>(url, {
    method: "POST",
    body,
    token: token || opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}

export async function redeemGiftCard(
  body: { cardNumber: string },
  opts?: FetchOpts,
) {
  const url = `${API_BASE}/gift-cards/use`;
  const token = await getToken();

  return apiFetch<RedeemGiftCardResponse>(url, {
    method: "POST",
    body,
    token: token || opts?.token,
    cache: opts?.cache ?? "no-store",
    next: opts?.next,
  });
}
