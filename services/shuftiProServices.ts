import { apiFetch } from "./api";
import { getToken } from "./getToken";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type InitiateKycPayload = {
  callbackUrl: string;
};

export type KycHistoryItem = {
  referenceId: string;
  status: "pending" | "approved" | "rejected" | "expired" | "failed" | string;
  createdAt: string;
  event?: string;
};

export type ApiResponse<T> = {
  status: "success" | "error";
  message?: string;
  data: T;
};

// Initiate KYC verification process
export async function initiateKycVerification(data: InitiateKycPayload) {
  const token = await getToken();
  const url = `${API_BASE}/kyc/initiate`;

  return await apiFetch<ApiResponse<{ referenceId: string; redirectUrl?: string }>>(url, {
    method: "POST",
    body: data,
    token: token || undefined,
  });
}

// Get verification status
export async function getKycVerificationStatus(referenceId: string) {
  const token = await getToken();
  const url = `${API_BASE}/kyc/status/${encodeURIComponent(referenceId)}`;

  return await apiFetch<ApiResponse<{ status: string; event?: string; createdAt?: string }>>(url, {
    method: "GET",
    token: token || undefined,
  });
}

// Get verification history for the current user
export async function getKycVerificationHistory() {
  const token = await getToken();
  const url = `${API_BASE}/kyc/history`;

  return await apiFetch<ApiResponse<KycHistoryItem[]>>(url, {
    method: "GET",
    token: token || undefined,
  });
}
