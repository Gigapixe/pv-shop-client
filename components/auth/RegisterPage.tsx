"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import backgroundImage from "@/public/images/form-bg.webp";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FullLogo from "@/components/ui/FullLogo";
import CountryPhoneInput from "@/components/ui/CountryPhoneInput";
import AuthFooterLinks from "@/components/auth/AuthFooterLinks";
import AuthToggle from "@/components/auth/AuthToggle";
import TermsText from "@/components/auth/TermsText";
import { parsePhoneNumber } from "libphonenumber-js";
import ReCaptchaComponent from "@/components/shared/ReCaptcha";
import { sendRegistrationDataAndOtp } from "@/services/customerService";
import { useAuthStore } from "@/zustand/authStore";
import { useTranslations } from "next-intl";
import SocialLoginButtons from "./SocialLoginButtons";

type PasswordHintProps = {
  label: string;
  test: boolean;
  className?: string;
};

export function PasswordHint({ label, test, className }: PasswordHintProps) {
  return (
    <div
      className={[
        "flex items-center gap-2 text-sm transition-colors",
        test ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400",
        className ?? "",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {test ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
      </svg>
      <span>{label}</span>
    </div>
  );
}


export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  // If you already have a temp token setter in your store, use that.
  // I’m using setTempAuth(email, token) because you already showed it in LoginForm.
  const { setTempAuth } = useAuthStore();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const validatePhone = (fullNumber: string) => {
    try {
      const parsed = parsePhoneNumber(fullNumber);
      return parsed && parsed.isValid();
    } catch {
      return false;
    }
  };

  const validatePassword = (pwd: string) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[!@#$%^&*\-\_\+]/.test(pwd)
    );
  };

  const isFormValid =
    name.trim() !== "" &&
    validateEmail(email) &&
    phone.trim() !== "" &&
    validatePhone(phone) &&
    validatePassword(password) &&
    confirmPassword === password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (loading) return;

    const newErrors: { [k: string]: string } = {};

    if (!name.trim()) newErrors.name = t("fullNameRequired");

    if (!email.trim()) newErrors.email = t("emailRequired");
    else if (!validateEmail(email)) newErrors.email = t("emailInvalid");

    if (!phone.trim()) newErrors.phone = t("phoneRequired");
    else if (!validatePhone(phone)) newErrors.phone = t("phoneInvalid");

    if (!password) newErrors.password = t("passwordRequired");
    else if (!validatePassword(password))
      newErrors.password = t("passwordRequirements");

    if (!confirmPassword)
      newErrors.confirmPassword = t("confirmPasswordRequired");
    else if (password !== confirmPassword)
      newErrors.confirmPassword = t("passwordsDoNotMatch");

    if (!captchaToken) newErrors.captcha = t("completeCaptcha");

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    const finalPayload = {
      name,
      email,
      phone,
      phoneCountry,
      password,
      confirmPassword,
      captchaToken,
    };

    try {
      setLoading(true);

      const res: any = await sendRegistrationDataAndOtp(finalPayload);
      if (res?.status === "success") {
        setTempAuth(email, res.token, true);

        router.push("/auth/verify-otp");
        return;
      }

      setErrors((prev) => ({
        ...prev,
        form: res?.message || t("otpSendFailed"),
      }));
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form: err?.message || t("otpRequestFailed"),
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("signUpTitle")}</title>
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
                {t("helloThere")}
              </p>
              <h1 className="text-4xl lg:text-6xl font-extrabold mt-2 relative z-10">
                {t("createAccount")}
              </h1>
              <div className="bg-primary h-2 lg:h-4 w-1/3 -mt-2 lg:-mt-4 z-0" />
            </div>

            <AuthFooterLinks />
          </div>

          {/* Right form column */}
          <div className="w-full lg:w-1/2 flex items-center justify-end py-12 z-10 mb-40 lg:mb-0">
            <div className="w-full lg:max-w-md">
              <div className="bg-[#F8F8F8] dark:bg-background-dark p-8 rounded-2xl dark:border dark:border-border-dark">
                <div className="text-center mb-10 flex flex-col justify-center items-center">
                  <FullLogo />
                </div>

                <AuthToggle activeTab="signup" />

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    label={t("fullName")}
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    className="px-4 py-3 bg-white dark:bg-[#1F1F1F] border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  />

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

                  <CountryPhoneInput
                    id="phone"
                    name="phone"
                    label={t("phoneNumber")}
                    placeholder="555 123 4567"
                    onChange={(fullNumber, country) => {
                      setPhone(fullNumber);
                      setPhoneCountry(country);
                      setErrors((s) => ({ ...s, phone: undefined }));
                    }}
                    error={errors.phone}
                  />

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    label={t("password")}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    className="px-4 py-3 bg-white dark:bg-[#1F1F1F] border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  />

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label={t("confirmPassword")}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    className="px-4 py-3 bg-white dark:bg-[#1F1F1F] border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  />

                  {/* Password hints */}
                  <div className="mt-2 space-y-1 text-xs">
                    <PasswordHint
                      label={t("passwordHint8Chars")}
                      test={password.length >= 8}
                    />
                    <PasswordHint
                      label={t("passwordHintUppercase")}
                      test={/[A-Z]/.test(password)}
                    />
                    <PasswordHint
                      label={t("passwordHintNumber")}
                      test={/[0-9]/.test(password)}
                    />
                    <PasswordHint
                      label={t("passwordHintSpecial")}
                      test={/[!@#$%^&*\-\_\+]/.test(password)}
                    />
                  </div>

                  <div className="flex justify-center">
                    <ReCaptchaComponent onChange={(t) => setCaptchaToken(t)} />
                  </div>

                  {errors.form && (
                    <p className="text-sm text-red-600">{errors.form}</p>
                  )}
                  {errors.captcha && (
                    <p className="text-sm text-red-600">{errors.captcha}</p>
                  )}

                  <Button
                    type="submit"
                    btnType="primary"
                    disabled={!isFormValid || !captchaToken || loading}
                    className="w-full py-3 px-5"
                  >
                    <span>{loading ? "Sending OTP..." : "Register"}</span>
                  </Button>
                </form>

                <TermsText />

                {/* Social login buttons (reusable) */}
                <SocialLoginButtons />

                <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Sign In
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
