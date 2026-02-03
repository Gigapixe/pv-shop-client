"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import backgroundImage from "@/public/images/form-bg.webp";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FullLogo from "@/components/ui/FullLogo";
import AuthFooterLinks from "@/components/auth/AuthFooterLinks";
import { useTranslations } from "next-intl";
import ReCaptchaComponent from "../shared/ReCaptcha";
import toast from "react-hot-toast";
import { forgetPassword } from "@/services/customerService";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/zustand/authStore";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { setTempAuth } = useAuthStore();
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl")?.startsWith("/")
    ? searchParams.get("callbackUrl")
    : "/";

  const isFormValid =
    email.trim() !== "" && validateEmail(email) && !!captchaToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    const newErrors: { [k: string]: string } = {};
    if (!email.trim()) newErrors.email = t("emailRequired");
    else if (!validateEmail(email)) newErrors.email = t("emailInvalid");

    if (!captchaToken) newErrors.captcha = t("pleaseCompleteCaptcha");

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const res: any = await forgetPassword(email, captchaToken);
      if (res?.success === true) {
        setTempAuth(email, res?.token, false, true);
        router.push(
          `/auth/verify-otp?callbackUrl=${encodeURIComponent(callbackUrl!)}`,
        );
      } else {
        setErrors(res?.message || "Forgot Password Failed");
      }
    } catch (err: any) {
      toast.error(err?.message || t("loginRequestFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("forgotPasswordTitle")}</title>
      </Head>

      <div
        className="relative flex min-h-screen bg-white dark:bg-[#161616] bg-cover bg-center z-0 overflow-x-hidden"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />

        <div className="container mx-auto relative lg:flex">
          {/* Left hero */}
          <div className="z-10 w-full lg:w-1/2 flex flex-col text-white">
            <div className="flex flex-col items-start mt-10 lg:mt-48 relative">
              <p className="text-xl lg:text-2xl font-medium">
                {t("forgotPassword")}
              </p>
              <h1 className="text-4xl lg:text-6xl font-extrabold mt-2 relative z-10">
                {t("resetItHere")}
              </h1>
              <div className="bg-primary h-2 lg:h-4 w-1/3 -mt-2 lg:-mt-4 z-0" />
            </div>

            <AuthFooterLinks />
          </div>

          {/* Right form column */}
          <div className="w-full lg:w-1/2 flex items-center justify-end py-12 z-10 mb-40 lg:mb-0">
            <div className="w-full lg:max-w-md">
              <div className="bg-[#F8F8F8] dark:bg-[#141414] p-8 rounded-2xl dark:border dark:border-[#303030]">
                <div className="text-center mb-10 flex flex-col justify-center items-center">
                  <FullLogo />
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold ">Forgot Your Password?</h2>
                  <p className="text-gray-500 text-sm mt-1 dark:text-gray-300">
                    {t("noWorries")}
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label={t("email")}
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    className="px-4 py-3 bg-white dark:bg-[#1F1F1F] border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  />

                  <div className="flex justify-center pt-2">
                    <ReCaptchaComponent
                      onChange={(token) => setCaptchaToken(token)}
                    />
                  </div>

                  {errors.captcha ? (
                    <p className="text-xs text-red-600 text-center">
                      {errors.captcha}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    btnType="primary"
                    disabled={!isFormValid || loading}
                    className="w-full py-3 px-5"
                  >
                    <span>{loading ? t("sending") : t("sendOtp")}</span>
                  </Button>
                </form>

                {submitSuccess && (
                  <p className="text-sm text-green-600 text-center mt-4">
                    {t("resetLinkSent")}
                  </p>
                )}

                <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
                  {t("rememberedPassword")}{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {t("signIn")}
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
