"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useAuthStore } from "@/zustand/authStore";
import type { VerifyOTPResponse } from "@/types/auth";

type JwtPayload = Partial<Omit<VerifyOTPResponse, "status" | "token">> & {
  _id: string;
  userId?: number;
  email?: string;
  name?: string;
  exp?: number;
};

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, logout } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const callbackUrl = searchParams.get("callbackUrl") || "/user/dashboard";
    const queryError = searchParams.get("error");

    if (queryError) {
      setError(decodeURIComponent(queryError));
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Authentication failed. Missing token.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded?._id) throw new Error("Invalid token");

      const payload: VerifyOTPResponse = {
        status: "success",
        token,

        _id: decoded._id,
        userId: decoded.userId ?? 0,
        email: decoded.email ?? "",
        name: decoded.name ?? "",
        phone: (decoded as any).phone ?? "",

        address: (decoded as any).address ?? "",
        address2: (decoded as any).address2 ?? "",
        country: (decoded as any).country ?? "",
        state: (decoded as any).state ?? null,
        city: (decoded as any).city ?? "",
        zip: (decoded as any).zip ?? "",
        postCode: (decoded as any).postCode ?? "",

        image: (decoded as any).image ?? "",

        balance:
          typeof (decoded as any).balance === "number"
            ? (decoded as any).balance
            : 0,
        kycStatus: (decoded as any).kycStatus ?? "not_verified",

        isPhoneVerified: Boolean((decoded as any).isPhoneVerified),
        isEmailVerified:
          (decoded as any).isEmailVerified !== undefined
            ? Boolean((decoded as any).isEmailVerified)
            : true,

        isTwoFactorEnabled: Boolean((decoded as any).isTwoFactorEnabled),
        membershipTier: (decoded as any).membershipTier ?? "Member",
        provider: (decoded as any).provider ?? "google",

        otpByPass: Boolean((decoded as any).otpByPass),

        referralCode: (decoded as any).referralCode ?? "",
        referralEarning:
          typeof (decoded as any).referralEarning === "number"
            ? (decoded as any).referralEarning
            : 0,

        totalSpent:
          typeof (decoded as any).totalSpent === "number"
            ? (decoded as any).totalSpent
            : 0,

        providerId: (decoded as any).providerId ?? undefined,
        dob: (decoded as any).dob ?? null,

        // ✅ required fields in User interface
        createdAt: (decoded as any).createdAt ?? new Date().toISOString(),
        updatedAt: (decoded as any).updatedAt ?? new Date().toISOString(),
      };

      setAuth(payload);

      // ✅ Optional phone verification
      if ((!payload.phone || !payload.isPhoneVerified) && !payload.otpByPass) {
        router.replace("/auth/verify-phone");
        return;
      }

      const safeCallback = callbackUrl.startsWith("/")
        ? callbackUrl
        : "/user/dashboard";
      router.replace(safeCallback);
    } catch (err) {
      console.error("Google login error:", err);
      logout();
      toast.error("Google login failed");
      setError("Invalid authentication data.");
      setLoading(false);
    }
  }, [router, searchParams, setAuth, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border dark:border-gray-700">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo/logo-color.png"
            alt="Gamingty"
            width={140}
            height={40}
            className="dark:hidden"
          />
          <Image
            src="/logo/logo-dark.png"
            alt="Gamingty"
            width={140}
            height={40}
            className="hidden dark:block"
          />
        </div>

        {loading && !error && (
          <>
            <svg
              className="animate-spin h-10 w-10 text-emerald-500 mx-auto mb-4"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-300">
              Signing you in with Google…
            </p>
          </>
        )}

        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded text-left">
            <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">
              Login Failed
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>

            <button
              onClick={() => router.push("/auth/login")}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
