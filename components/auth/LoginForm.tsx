"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { customerLogin } from "@/services/customerService";
import { useAuthStore } from "@/zustand/authStore";
import ReCaptchaComponent from "../shared/ReCaptcha";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";


export default function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { setAuth, setTempAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const searchParams = useSearchParams();
  const callbackUrl =
  searchParams.get("callbackUrl")?.startsWith("/")
    ? searchParams.get("callbackUrl")
    : "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) return setError(t("emailInvalid"));
    if (!password) return setError(t("enterPassword"));

    try {
      setLoading(true);
      const res = (await customerLogin(email, password)) as any;

      if (res?.status === "success" && res?.requiredOTP) {
        setTempAuth(email, res.token, false);
        // router.push("/auth/verify-otp");
        router.push(`/auth/verify-otp?callbackUrl=${encodeURIComponent(callbackUrl!)}`);
      } else if (res?.status === "success" && res?.token) {
        // Response contains user data directly, not nested
        setAuth(res);
        // router.push("/");
        router.replace(callbackUrl || "/");
      } else {
        setError(res?.message || t("loginFailed"));
      }
    } catch (err: any) {
      setError(err?.message || t("loginRequestFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        id="loginEmail"
        name="loginEmail"
        type="email"
        label={t("email")}
        placeholder="example@mail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-3 bg-white dark:bg-[#1F1F1F] border-gray-200 dark:border-gray-700 rounded-lg text-sm"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label={t("password")}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-3 bg-white dark:bg-[#1F1F1F] border-gray-200 dark:border-gray-700 rounded-lg text-sm"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="text-left">
        <a
          href="/auth/forget-password"
          className="text-sm underline font-medium text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
        >
          {t("forgotPassword")}
        </a>
      </div>
      <div className="flex justify-center">
        <ReCaptchaComponent onChange={(token) => setCaptchaToken(token)} />
      </div>
      <Button
        type="submit"
        btnType="primary"
        className="w-full py-3 px-5"
        disabled={loading || !captchaToken}
      >
        <span>{loading ? t("signingIn") : t("signIn")}</span>
      </Button>
    </form>
  );
}
