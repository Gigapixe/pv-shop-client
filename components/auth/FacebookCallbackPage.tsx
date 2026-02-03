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

export default function FacebookCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, logout } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const callbackUrl = searchParams.get("callbackUrl") || "/user/dashboard";
    const queryError = searchParams.get("error");

    // handle backend errors in redirect
    if (queryError) {
      const friendly = decodeURIComponent(queryError);
      setError(friendly || "Facebook authentication failed.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Login process incomplete. Missing authentication token.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded?._id) throw new Error("Invalid token");

      // ✅ Build a VerifyOTPResponse so your setAuth(payload: VerifyOTPResponse) stays unchanged
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
          typeof (decoded as any).balance === "number" ? (decoded as any).balance : 0,
        kycStatus: (decoded as any).kycStatus ?? "pending",

        isPhoneVerified: Boolean((decoded as any).isPhoneVerified),
        isEmailVerified:
          (decoded as any).isEmailVerified !== undefined
            ? Boolean((decoded as any).isEmailVerified)
            : true,

        isTwoFactorEnabled: Boolean((decoded as any).isTwoFactorEnabled),
        membershipTier: (decoded as any).membershipTier ?? "Member",
        provider: (decoded as any).provider ?? "facebook",

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

        createdAt: (decoded as any).createdAt ?? new Date().toISOString(),
        updatedAt: (decoded as any).updatedAt ?? new Date().toISOString(),
      };

      setAuth(payload);

      // phone verification gate (same as your old logic)
      if ((!payload.phone || !payload.isPhoneVerified) && !payload.otpByPass) {
        router.replace("/auth/verify-phone");
        return;
      }

      // ✅ Safe callbackUrl
      const safeCallback = callbackUrl.startsWith("/")
        ? callbackUrl
        : "/user/dashboard";

      router.replace(safeCallback);
    } catch (err: any) {
      console.error("Facebook login error:", err);
      logout();
      toast.error("Facebook login failed");
      setError("Invalid authentication data received.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [router, searchParams, setAuth, logout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex flex-col items-center justify-center p-4 font-sans dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center dark:bg-gray-800 dark:border dark:border-gray-700">
        {/* Logo */}
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

        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Facebook Authentication
        </h1>

        {loading && !error && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4 dark:border-emerald-400" />
            <p className="text-gray-600 dark:text-gray-300">
              Processing your login, please wait...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 text-left rounded dark:bg-red-900/20 dark:border-red-600">
            <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-300">
              Error
            </h2>
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <div className="mt-4">
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                Return to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
