import { apiFetch } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function addNotify(body: any) {
  const url = `${API_BASE}/notify/add`;
  return apiFetch(url, {
    method: "POST",
    body,
  });
}
