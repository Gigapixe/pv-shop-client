import { apiFetch } from "./api";
import { getToken } from "./getToken";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getActivePaymentMethods() {
  const token = await getToken();
  const res = `${API_BASE}/payment-method/active`;
  return await apiFetch<any>(res, {
    method: "GET",
    token: token || undefined,
  });
}
// /wallet-restriction/all
export async function getWalletRestrictions() {
  const token = await getToken();
  const res = `${API_BASE}/wallet-restriction/all`;
  return await apiFetch<any>(res, {
    method: "GET",
    token: token || undefined,
  });
}

export async function createPaymentOrder(payload: {
  items: Array<{
    _id: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
    type?: string;
  }>;
  coupon: string | null;
  userInfo: {
    name: string;
    email: string;
    contact: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: string;
  type?: string;
}) {
  const token = await getToken();
  const res = `${API_BASE}/payment/create-order`;
  return await apiFetch<any>(res, {
    method: "POST",
    token: token || undefined,
    body: JSON.stringify(payload),
  });
}

// `/payment/mbme-status?oid=${oid}`
export async function getMbmeStatus(oid: string) {
  const token = await getToken();
  const res = `${API_BASE}/payment/mbme-status?oid=${encodeURIComponent(oid)}`;
  return await apiFetch<any>(res, {
    method: "GET",
    token: token || undefined,
  });
}

export async function verifyPayment(payload: {
  tradeNo: string;
  type?: string;
}) {
  const token = await getToken();
  const queryParams = new URLSearchParams({
    tradeNo: payload.tradeNo,
    ...(payload.type && { type: payload.type }),
  });
  const res = `${API_BASE}/payment/verify?${queryParams.toString()}`;
  return await apiFetch<any>(res, {
    method: "GET",
    token: token || undefined,
  });
}
// /payment/start-button-status?tradeNo=${tradeNo}`
export async function getStartButtonStatus(tradeNo: string) {
  const token = await getToken();
  const res = `${API_BASE}/payment/start-button-status?tradeNo=${encodeURIComponent(
    tradeNo,
  )}`;
  return await apiFetch<any>(res, {
    method: "GET",
    token: token || undefined,
  });
}
// `/payment/xprizo-status?tradeNo=${tradeNo}`
export async function getXprizoStatus(tradeNo: string) {
  const token = await getToken();
  const res = `${API_BASE}/payment/xprizo-status?tradeNo=${tradeNo}`;
  return await apiFetch<any>(res, {
    method: "GET",
    token: token || undefined,
  });
}
