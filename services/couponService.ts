import { apiFetch } from "./api";
import { getToken } from "./getToken";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// /coupons/validate
// Accept either a simple code string (backwards-compatible) or a detailed payload:
// { couponCode, amount, userEmail, items }
export async function validateCoupon(
  payload:
    | string
    | {
        couponCode: string;
        amount?: number;
        userEmail?: string;
        items?: any[];
      },
) {
  const token = await getToken();
  const res = `${API_BASE}/coupons/validate`;

  const body =
    typeof payload === "string"
      ? { couponCode: payload }
      : {
          couponCode: payload.couponCode,
          amount: payload.amount,
          userEmail: payload.userEmail,
          items: payload.items,
        };

  return await apiFetch<any>(res, {
    method: "POST",
    token: token || undefined,
    body,
  });
}
