import { auth } from "@/lib/firebase";
import { apiFetch } from "./api";
import { getToken } from "./getToken";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useAuthStore } from "@/zustand/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export type WithdrawalMethod = "wallet" | "external";
export type OtpBypassResponse = {
  success: boolean;
  isOtpByPass: boolean;
  message?: string;
};
export type UpdateProfileResponse<T = any> = {
  status: "success" | "error";
  message?: string;
  data?: T;
};
export type PhoneCheckResponse = {
  success: boolean;
  message?: string;
};

type ConfirmationResultLike = {
  confirm: (code: string) => Promise<{ user: any }>;
};

declare global {
  interface Window {
    __phoneRecaptchaVerifier?: RecaptchaVerifier;
  }
}

export type WithdrawalWalletDetails = {
  paypalEmail?: string;
  cryptoAddress?: string;
  cryptoNetwork?: string;
};
export type ApiResponse<T> = {
  status: "success" | "error";
  message?: string;
  data?: T;
};

export type WithdrawalResponseData = {
  newReferralEarning?: number;
  newWalletBalance?: number;
};

export type RequestWithdrawalPayload = {
  amount: number;
  method: WithdrawalMethod;
  walletDetails?: {
    paypalEmail?: string;
    cryptoAddress?: string;
    cryptoNetwork?: string;
  };
};
export type WithdrawalHistoryItem = {
  requestedAt: string;
  amount: number;
  method: string;
  status: string;
  walletDetails?: WithdrawalWalletDetails;
};

export type WithdrawalHistoryResponseData = {
  withdrawals: WithdrawalHistoryItem[];
  pagination?: {
    totalPages?: number;
    totalDocs?: number;
  };
};

export async function customerLogin(email: string, password: string) {
  const response = await apiFetch(`${API_BASE}/customer/login`, {
    method: "POST",
    body: { email, password },
  });
  return response;
}

export async function checkPhoneRegistered(phone: string) {
  return apiFetch<PhoneCheckResponse>(
    `${API_BASE}/customer/phone/${encodeURIComponent(phone)}`,
    { method: "GET" },
  );
}

export async function checkOtpService(phone: string) {
  return apiFetch<OtpBypassResponse>(
    `${API_BASE}/otp-pass/check-otp-pass/${encodeURIComponent(phone)}`,
    { method: "GET" },
  );
}

// export async function updateNameAndPhone(body: {
//   name?: string;
//   phone: string;
// }) {
//   return apiFetch<UpdateProfileResponse>(`${API_BASE}/customer/update-phone`, {
//     method: "PUT",
//     body,
//   });
// }
export async function updateNameAndPhone(body: {
  name?: string;
  phone: string;
}) {
  return apiFetch<UpdateProfileResponse>(
    `${API_BASE}/customer/update-phone`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
      body,
    }
  );
}


export async function getCustomerCountryInfo() {
  return apiFetch(`${API_BASE}/customer/country`, {
    method: "GET",
  });
}

/**
 * Send OTP to phone using Firebase Phone Auth + reCAPTCHA
 */
export async function sendPhoneOtp(
  phoneNumber: string,
  recaptchaContainerId: string,
) {
  if (typeof window === "undefined") {
    throw new Error("sendPhoneOtp must be called in the browser.");
  }

  const container = document.getElementById(recaptchaContainerId);
  if (!container) {
    throw new Error(`reCAPTCHA container not found: ${recaptchaContainerId}`);
  }

  // Clear container to avoid "already rendered" issues
  container.innerHTML = "";

  // Cleanup previous verifier if exists (important for resend / re-render)
  try {
    window.__phoneRecaptchaVerifier?.clear();
  } catch {
    // ignore
  } finally {
    window.__phoneRecaptchaVerifier = undefined;
  }

  // Create verifier
  const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
    size: "invisible",
    callback: () => {
      // This fires when recaptcha is solved
      // console.log("reCAPTCHA verified");
    },
    "expired-callback": () => {
      // console.log("reCAPTCHA expired");
    },
  });

  window.__phoneRecaptchaVerifier = verifier;

  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      verifier,
    );

    return confirmationResult; // store this in component state
  } catch (error) {
    // If sign-in fails, clear verifier so next attempt works cleanly
    try {
      window.__phoneRecaptchaVerifier?.clear();
    } catch {
      // ignore
    } finally {
      window.__phoneRecaptchaVerifier = undefined;
    }
    throw error;
  }
}

/**
 * Verify OTP using the confirmationResult returned by sendPhoneOtp
 */
export async function verifyPhoneOtp(
  confirmationResult: ConfirmationResultLike,
  phoneOtp: string,
) {
  if (!confirmationResult) {
    throw new Error("No confirmation result found. Please send OTP first.");
  }

  if (!phoneOtp || phoneOtp.length !== 6) {
    throw new Error("OTP must be 6 digits.");
  }

  try {
    const result = await confirmationResult.confirm(phoneOtp);

    // Cleanup verifier after successful verification
    if (typeof window !== "undefined") {
      try {
        window.__phoneRecaptchaVerifier?.clear();
      } catch {
        // ignore
      } finally {
        window.__phoneRecaptchaVerifier = undefined;
      }
    }

    return result.user; // Firebase user object
  } catch (error) {
    throw error;
  }
}

export async function requestPasswordReset(email: string) {
  const url = `${API_BASE}/customer/forgot-password`;
  return apiFetch(url, {
    method: "POST",
    body: { email },
  });
}
// resend OTP (send token in Authorization header)
export async function resendOTP(token: string) {
  const url = `${API_BASE}/customer/verify-otp-again`;
  return apiFetch(url, {
    method: "POST",
    token,
  });
}

// verify OTP using temp token in Authorization header
export async function verifyOTP(token: string, otp: string) {
  const url = `${API_BASE}/customer/verify-otp-customer-login`;
  return apiFetch(url, {
    method: "POST",
    token,
    body: { otp },
  });
}

// verify otp using temp token in signup

// export async function sendRegistrationDataAndOtp(body: any) {
//   const url = `${API_BASE}/customer/register/send-data-otp`;
//   return apiFetch(url, { method: "POST", body });
// }

export async function sendRegistrationDataAndOtp(body: any) {
  const url = `${API_BASE}/customer/create-customer`;
  return apiFetch(url, { method: "POST", body });
}

export async function verifyOtpAndRegisterUser(
  emailOtp: any,
  tempToken: string,
) {
  const url = `${API_BASE}/customer/create-customer-with-otp`;
  return apiFetch(url, {
    method: "POST",
    body: { emailOtp },
    headers: {
      Authorization: `Bearer ${tempToken}`,
    },
  });
}

export async function resendOTPRegistration(token: string) {
  const url = `${API_BASE}/customer/register-verify-otp-again`;
  return apiFetch(url, {
    method: "POST",
    token,
  });
}

// newsletter
export async function subscribeToNewsletter(email: string) {
  const url = `${API_BASE}/customer/news-letter-subscribe`;
  return apiFetch(url, {
    method: "POST",
    body: { email },
  });
}

// /customer/change-password
export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
) {
  const token = await getToken();
  const url = `${API_BASE}/customer/change-password`;
  return apiFetch(url, {
    method: "POST",
    body: { email, currentPassword, newPassword },
    token: token || undefined,
  });
}

// customerService.ts (example)

export async function forgetPassword(
  email: string,
  recaptchaToken?: string | null,
) {
  const url = `${API_BASE}/customer/forget-password`;

  return apiFetch(url, {
    method: "PUT",
    body: {
      verifyEmail: email,
      recaptchaToken: recaptchaToken || undefined,
    },
  });
}

export async function resetPassword(payload: {
  token: string;
  // email: string;
  newPassword: string;
  recaptchaToken?: string | null;
}) {
  const url = `${API_BASE}/customer/reset-password`;

  return apiFetch(url, {
    method: "PUT",
    body: {
      token: payload.token,
      // email: payload.email,
      newPassword: payload.newPassword,
      recaptchaToken: payload.recaptchaToken || undefined,
    },
  });
}

export async function resetPasswordOtp(payload: {
  token: string;
  otp: string;
  recaptchaToken?: string | null;
}) {
  const url = `${API_BASE}/customer/verify-reset-otp`;

  return apiFetch(url, {
    method: "PUT",
    body: {
      token: payload.token,
      otp: payload.otp,
    },
  });
}

// /customer/2fa/enable
export async function enable2FA(): Promise<{
  success: boolean;
  secret?: string;
  qrCode?: string;
  message?: string;
}> {
  const url = `${API_BASE}/customer/2fa/enable`;
  const token = await getToken();
  return apiFetch(url, {
    method: "POST",
    token: token || undefined,
  }) as Promise<{
    success: boolean;
    secret?: string;
    qrCode?: string;
    message?: string;
  }>;
}
// /customer/2fa/verify-setup
export async function verify2FA(
  code: string,
): Promise<{ success: boolean; message?: string }> {
  const token = await getToken();
  const url = `${API_BASE}/customer/2fa/verify-setup`;
  return apiFetch(url, {
    method: "POST",
    body: { code },
    token: token || undefined,
  }) as Promise<{ success: boolean; message?: string }>;
}
// /customer/2fa/disable
export async function disable2FA(
  code: string,
): Promise<{ success: boolean; message?: string }> {
  const token = await getToken();
  const url = `${API_BASE}/customer/2fa/disable`;
  return apiFetch(url, {
    method: "POST",
    body: { code },
    token: token || undefined,
  }) as Promise<{ success: boolean; message?: string }>;
}

//update profile
export async function updateProfile(id: string, profileData: any) {
  const token = await getToken();
  const url = `${API_BASE}/customer/${id}`;
  return apiFetch(url, {
    method: "PUT",
    body: profileData,
    token: token || undefined,
  });
}

// updateCustomerImage body should be an object like { image: "image_data_url_or_path" }
export async function updateCustomerImage(id: string, body: any) {
  const token = await getToken();
  const url = `${API_BASE}/customer/${id}/image`;
  return apiFetch(url, {
    method: "PUT",
    body,
    token: token || undefined,
  });
}

export async function getWithdrawalHistory(
  token: string,
  page = 1,
  limit = 10,
): Promise<ApiResponse<WithdrawalHistoryResponseData>> {
  const url = `${API_BASE}/referral/withdraw/history?page=${page}&limit=${limit}`;
  return (await apiFetch(url, {
    method: "GET",
    token,
  })) as ApiResponse<WithdrawalHistoryResponseData>;
}

export async function requestWithdrawal(
  token: string,
  data: RequestWithdrawalPayload,
): Promise<ApiResponse<WithdrawalResponseData>> {
  const url = `${API_BASE}/referral/withdraw`;
  return (await apiFetch(url, {
    method: "POST",
    token,
    body: data,
  })) as ApiResponse<WithdrawalResponseData>;
}

//`/customer/profile-completion/${id}`
export async function getProfileCompletionStatus(id: string) {
  const token = await getToken();
  const url = `${API_BASE}/customer/profile-completion/${id}`;
  return apiFetch(url, {
    method: "GET",
    token: token || undefined,
  });
}

///customer/balance
export async function getCustomerBalance() {
  const token = await getToken();
  const url = `${API_BASE}/customer/balance`;
  return apiFetch(url, {
    method: "GET",
    token: token || undefined,
  });
}
// /kyc/status
export async function getKYCStatus() {
  const token = await getToken();
  const url = `${API_BASE}/kyc/status`;
  return apiFetch(url, {
    method: "GET",
    token: token || undefined,
  });
}
