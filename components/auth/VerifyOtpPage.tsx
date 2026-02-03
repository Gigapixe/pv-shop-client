"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import backgroundImage from "@/public/images/form-bg.png";
import Button from "@/components/ui/Button";
import FullLogo from "@/components/ui/FullLogo";
import AuthFooterLinks from "@/components/auth/AuthFooterLinks";
import OtpInput, { OtpInputHandle } from "@/components/ui/OtpInput";
import { useAuthStore } from "@/zustand/authStore";
import {
  resendOTP,
  resendOTPRegistration,
  resetPasswordOtp,
  verifyOTP,
  verifyOtpAndRegisterUser,
} from "@/services/customerService";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl")?.startsWith("/")
    ? searchParams.get("callbackUrl")
    : "/";

  const {
    tempToken,
    tempEmail,
    setAuth,
    clearTempAuth,
    setTempAuth,
    isRegister,
    isForgotPassword,
  } = useAuthStore();

  const isRegisterFlow = useMemo(() => !!isRegister, [isRegister]);
  const isForgotPasswordFlow = useMemo(
    () => !!isForgotPassword,
    [isForgotPassword],
  );

  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const otpRef = useRef<OtpInputHandle | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (verified) return;

    if (!tempToken || !tempEmail) {
      if (isRegisterFlow) router.push("/auth/register");
      else if (isForgotPasswordFlow) router.push("/auth/forgot-password");
      else router.push("/auth/login");
    }
  }, [
    tempToken,
    tempEmail,
    verified,
    isRegisterFlow,
    isForgotPasswordFlow,
    router,
  ]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResendOTP = async () => {
    if (resendCountdown > 0 || !tempToken) return;

    setError(null);
    setResendLoading(true);

    try {
      const res: any = isRegisterFlow
        ? await resendOTPRegistration(tempToken)
        : await resendOTP(tempToken);

      if (res?.status === "success" && res?.token) {
        if (tempEmail) {
          setTempAuth(tempEmail, res.token, isRegisterFlow);
        }

        setResendCountdown(60);
        setOtp("");
        otpRef.current?.focus();
      } else {
        setError(res?.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tempToken) {
      setError(t("sessionExpired"));
      return;
    }

    if (otp.length !== 6) {
      setError(t("enterAll6Digits"));
      return;
    }

    try {
      setLoading(true);

      // ✅ Register flow
      if (isRegisterFlow) {
        const res: any = await verifyOtpAndRegisterUser(otp, tempToken);

        if (res?.status === true) {
          clearTempAuth();
          router.replace("/auth/login");
          return;
        }

        setError(res?.message || t("invalidOtp"));
        return;
      }

      if (isForgotPasswordFlow) {
        const res: any = await resetPasswordOtp({
          token: tempToken,
          otp,
        });

        // adapt the condition to your API's actual response shape
        const ok =
          res?.status === "success" ||
          res?.status === true ||
          res?.success === true;

        if (ok) {
          router.replace("/auth/reset-password");
          return;
        }

        setError(res?.message || t("invalidOtp"));
        return;
      }

      const res: any = await verifyOTP(tempToken, otp);

      if (res?.status === "success" && res?.token) {
        setVerified(true);
        setAuth(res);
        clearTempAuth();
        // router.replace("/");
        router.replace(callbackUrl || "/");
        return;
      } else {
        setError(res?.message || t("invalidOtp"));
      }
    } catch (err: any) {
      setError(err?.message || t("verificationFailed"));
    } finally {
      setLoading(false);
    }
  };

  // mask email same as yours...
  const maskEmail = (email?: string | null) => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const [local, domain] = parts;
    if (local.length <= 2) {
      return `${local[0]}${"*".repeat(Math.max(1, local.length - 1))}@${domain}`;
    }
    const stars = "*".repeat(Math.max(3, local.length - 2));
    return `${local[0]}${stars}${local[local.length - 1]}@${domain}`;
  };

  const maskedEmail = maskEmail(tempEmail);
  const isFormValid = otp.length === 6;

  return (
    <>
      <Head>
        <title>{t("verifyOtpTitle")}</title>
      </Head>

      <div
        className="relative flex min-h-screen bg-white dark:bg-[#161616] bg-cover bg-center z-0 overflow-x-hidden"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />

        <div className="container mx-auto relative md:flex gap-4">
          <div className="z-10 w-full md:w-1/2 flex flex-col text-white">
            <div className="flex flex-col items-start mt-10 md:mt-48 relative">
              <p className="text-xl md:text-2xl font-medium">
                {isRegisterFlow ? t("verifyRegistrationOtp") : t("verifyOtp")}
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold mt-2 relative z-10">
                {t("codeSentToEmail")}
              </h1>
              <div className="bg-primary h-2 md:h-4 w-1/3 -mt-2 md:-mt-4 z-0" />
            </div>

            <AuthFooterLinks />
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-end pb-20 pt-12 md:py-12 z-10 mb-40 md:mb-0">
            <div className="w-full md:min-w-[395px] lg:max-w-[404px]">
              <div className="bg-[#F8F8F8] dark:bg-[#141414] p-4 md:p-8 rounded-2xl dark:border dark:border-[#303030]">
                <div className="text-center mb-10 flex flex-col justify-center items-center">
                  <FullLogo />
                </div>

                <h2 className="font-bold mb-4 text-lg">
                  Additional Verification Required!
                </h2>

                <div className="mb-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We’ve sent a 6-digit code to your{" "}
                    <span className="font-semibold">({maskedEmail})</span>.
                    Please enter it below to continue.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <OtpInput
                    ref={otpRef}
                    value={otp}
                    onChange={setOtp}
                    length={6}
                    autoFocus
                    label="Enter Your Verification Code"
                    labelClassName="text-sm font-bold"
                  />

                  {error && (
                    <p className="text-sm text-red-600 text-center mt-3">
                      {error}
                    </p>
                  )}

                  <p className="mt-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {t("didntReceiveCode")}{" "}
                    <button
                      type="button"
                      className={`font-semibold ${
                        resendCountdown > 0 || resendLoading
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                      }`}
                      onClick={handleResendOTP}
                      disabled={resendCountdown > 0 || resendLoading}
                    >
                      {resendLoading
                        ? t("sending")
                        : resendCountdown > 0
                          ? `${t("resend")} (${resendCountdown}s)`
                          : t("resendAgain")}
                    </button>
                  </p>

                  <Button
                    type="submit"
                    btnType="primary"
                    disabled={!isFormValid || loading}
                    className="w-full py-3 px-5"
                  >
                    <span>
                      {loading
                        ? t("verifying")
                        : isRegisterFlow
                          ? t("verifyCreateAccount")
                          : t("verifyOtpButton")}
                    </span>
                  </Button>
                </form>

                <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
                  {isRegisterFlow ? t("alreadyHaveAccount") : t("wrongEmail")}{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {t("backToLogin")}
                  </Link>
                </p>
              </div>

              <p className="text-center text-gray-200 text-sm mt-8">
                © {new Date().getFullYear()} Gamingty. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
