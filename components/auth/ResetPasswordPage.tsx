"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

import backgroundImage from "@/public/images/form-bg.webp";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthFooterLinks from "@/components/auth/AuthFooterLinks";
import { resetPassword } from "@/services/customerService";
import { PasswordHint } from "./RegisterPage";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/zustand/authStore";

export default function ResetPasswordPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { tempToken, clearTempAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canSubmit = useMemo(() => {
    if (!tempToken) return false;
    if (!newPassword || !confirmPassword) return false;
    if (newPassword.length < 8) return false;
    if (newPassword !== confirmPassword) return false;
    return true;
  }, [tempToken, newPassword, confirmPassword]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempToken) return toast.error("Reset token is missing.");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match!");
    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters long!");

    try {
      setLoading(true);

      const res: any = await resetPassword({
        token: tempToken,
        // email,
        newPassword,
      });

      if (res.success === true) {
        clearTempAuth();
        toast.success(res?.message || "Password reset successfully!");
        router.replace("/auth/login");
        return;
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Something went wrong!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen bg-white dark:bg-[#161616] bg-cover bg-center z-0 overflow-x-hidden"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="container mx-auto relative lg:flex">
        {/* Left hero */}
        <div className="z-10 w-full lg:w-1/2 flex flex-col text-white">
          <div className="flex flex-col items-start mt-10 lg:mt-48 relative">
            <p className="text-xl lg:text-2xl font-medium">Security Check</p>
            <h1 className="text-5xl lg:text-7xl font-extrabold mt-2 relative z-10">
              Create a New Password
            </h1>
            <div className="bg-emerald-500 h-2 lg:h-4 w-1/3 -mt-2 lg:-mt-4 z-0" />
          </div>

          <AuthFooterLinks />
        </div>

        {/* Right form */}
        <div className="w-full lg:w-1/2 flex items-center justify-end py-12 z-10 mb-40 lg:mb-0">
          <div className="w-full lg:max-w-md">
            <div className="bg-[#F8F8F8] dark:bg-[#141414] p-8 rounded-2xl dark:border dark:border-[#303030]">
              <div className="text-center mb-10">
                <Link href="/" className="inline-block">
                  <Image
                    src="/logo/logo-color.png"
                    alt="Gamingty Logo"
                    width={180}
                    height={50}
                    className="dark:hidden"
                  />
                  <Image
                    src="/logo/logo-dark.png"
                    alt="Gamingty Logo"
                    width={180}
                    height={50}
                    className="hidden dark:inline-block"
                  />
                </Link>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Reset Your Password
                </h2>
                <p className="text-gray-500 text-sm mt-1 dark:text-gray-300">
                  Enter and confirm your new strong password.
                </p>

                {!tempToken ? (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                    Reset token missing. Please use the reset link from your
                    email.
                  </p>
                ) : null}
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                {/* New password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>

                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-[38px] text-gray-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Confirm password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-[38px] text-gray-500"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Password hints */}
                <div className="mt-2 space-y-1 text-xs">
                  <PasswordHint
                    label={t("passwordHint8Chars")}
                    test={newPassword.length >= 8}
                  />
                  <PasswordHint
                    label={t("passwordHintUppercase")}
                    test={/[A-Z]/.test(newPassword)}
                  />
                  <PasswordHint
                    label={t("passwordHintNumber")}
                    test={/[0-9]/.test(newPassword)}
                  />
                  <PasswordHint
                    label={t("passwordHintSpecial")}
                    test={/[!@#$%^&*\-\_\+]/.test(newPassword)}
                  />
                </div>

                <Button
                  type="submit"
                  btnType="primary"
                  disabled={!canSubmit || loading}
                  className="w-full relative py-3 px-5 rounded-full"
                >
                  <span>{loading ? "Resetting..." : "Reset Password"}</span>
                  <span className="absolute right-3 rounded-full text-emerald-500 bg-white p-1.5">
                    <FiArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Remember your password now?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <p className="text-center text-gray-200 text-sm mt-8">
              © {new Date().getFullYear()} Gamingty. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
