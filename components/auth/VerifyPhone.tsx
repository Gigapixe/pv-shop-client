"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowRight, FiLogOut } from "react-icons/fi";

import Loading from "../blog/Loading";
import OtpInput from "../ui/OtpInput";
import CountryPhoneInput from "../ui/CountryPhoneInput";

import { useAuthStore } from "@/zustand/authStore";
import {
  checkOtpService,
  checkPhoneRegistered,
  sendPhoneOtp,
  updateNameAndPhone,
  verifyPhoneOtp,
} from "@/services/customerService";
import { useTranslations } from "next-intl";

type Step = 1 | 2;

export default function VerifyPhonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");

  const successRedirect = useMemo(() => {
    return searchParams.get("redirect") || "/user/dashboard";
  }, [searchParams]);

  const {token}=useAuthStore()
  // ---- Zustand auth store (adjust keys to match your store) ----
  const userInfo = useAuthStore((s: any) => s.user);
  const setUserInfo = useAuthStore((s: any) => s.updateUserProfile);
  // or just use setAuth if you want to overwrite full user
  const _hasHydrated = useAuthStore((s: any) => s._hasHydrated);

  const logout = useAuthStore((s: any) => s.logout);

  // ---- Local UI state ----
  const [step, setStep] = useState<Step>(1);

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneCountry, setPhoneCountry] = useState<string>("");

  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verificationPhone, setVerificationPhone] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [isRecaptchaActive, setIsRecaptchaActive] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    otp?: string;
  }>({});

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!userInfo)
      router.replace("/?login=true&message=Please%20login%20first!");
  }, [_hasHydrated, userInfo, router]);

  useEffect(() => {
    if (userInfo?.name) {
      setName(userInfo.name);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.phone) {
      setPhone(userInfo.phone);
    }
  }, [userInfo]);

  // ---- Resend timer ----
  useEffect(() => {
    if (!resendDisabled || resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendDisabled, resendTimer]);

  useEffect(() => {
    if (resendDisabled && resendTimer === 0) {
      setResendDisabled(false);
    }
  }, [resendDisabled, resendTimer]);

  // ---- validators ----
  const validateStep1 = () => {
    const nextErrors: typeof errors = {};

    if (name && name.trim().length > 0 && name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }

    // E.164-ish validation
    if (!phone || phone.trim().length === 0) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{7,14}$/.test(phone)) {
      nextErrors.phone = "Invalid phone number format";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateOtp = () => {
    const nextErrors: typeof errors = {};
    if (!otp || otp.length !== 6)
      nextErrors.otp = "Please enter the 6-digit OTP.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ---- handlers ----
  const handleSendOtp = async () => {
    if (!userInfo) return;
    if (!validateStep1()) return;

    setIsLoading(true);
    setResendDisabled(true);
    setResendTimer(60);
    setIsRecaptchaActive(true);

    try {
      // clear token session if used
      sessionStorage.removeItem("idToken");

      if (phone !== userInfo?.phone) {
        const phoneCheck = await checkPhoneRegistered(phone);

        // Your old code: success === false means "already registered"
        if (phoneCheck?.success === false) {
          toast.error(
            "This phone number is already registered to another account.",
          );
          setResendDisabled(false);
          setResendTimer(0);
          return;
        }
      }

      // OTP bypass check
      const bypass = await checkOtpService(phone);
      if (bypass?.success && bypass?.isOtpByPass) {
        await handleUpdateProfileBypass();
        return;
      }

      // reCAPTCHA container
      const recaptchaContainer = document.getElementById(
        "recaptcha-container-verify",
      );
      if (!recaptchaContainer) {
        toast.error("reCAPTCHA setup error. Please refresh.");
        return;
      }
      recaptchaContainer.innerHTML = "";

      // Firebase send OTP (your service)
      const confirmation = await sendPhoneOtp(
        phone,
        "recaptcha-container-verify",
      );

      setConfirmationResult(confirmation);
      setVerificationPhone(phone);

      toast.success("OTP sent to your phone!");
      setStep(2);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send OTP. Please try again.",
      );
      setResendDisabled(false);
      setResendTimer(0);
    } finally {
      setIsLoading(false);
      setIsRecaptchaActive(false);
    }
  };

  const handleVerifyAndUpdate = async () => {
    if (!userInfo) return;
    if (!validateOtp()) return;

    if (!confirmationResult || !verificationPhone) {
      toast.error("Session expired. Please start over.");
      setStep(1);
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP via Firebase
      await verifyPhoneOtp(confirmationResult, otp);

      // Update backend
      const res = await updateNameAndPhone({
        name: name || undefined,
        phone: verificationPhone,
      });

      if (res?.status === "success") {
        toast.success("Profile updated successfully!");

        const updatedUser = { ...userInfo, ...res.data };
        setUserInfo(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));

        router.push(successRedirect);
      } else {
        toast.error(res?.message || "Failed to update profile.");
      }
    } catch (err: any) {
      // Firebase errors
      if (err?.code === "auth/invalid-verification-code") {
        toast.error("Incorrect OTP.");
      } else if (err?.code === "auth/code-expired") {
        toast.error("OTP expired. Please request a new one.");
        setResendDisabled(false);
        setResendTimer(0);
      } else {
        toast.error(
          err?.response?.data?.message ||
            "Failed to verify OTP or update profile.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfileBypass = async () => {
    if (!userInfo) return;

    setIsLoading(true);
    try {
      const res = await updateNameAndPhone({ name: name || undefined, phone });

      if (res?.status === "success") {
        toast.success("Profile updated successfully!");

        const updatedUser = { ...userInfo, ...res.data };
        setUserInfo(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));

        router.push(successRedirect);
      } else {
        toast.error(res?.message || "Failed to update profile.");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update profile after bypass.",
      );
    } finally {
      setIsLoading(false);
      setIsRecaptchaActive(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled || isLoading || isResending || !verificationPhone)
      return;

    setIsResending(true);
    setResendDisabled(true);
    setResendTimer(60);

    try {
      const recaptchaContainer = document.getElementById(
        "recaptcha-container-verify",
      );
      if (recaptchaContainer) recaptchaContainer.innerHTML = "";

      const confirmation = await sendPhoneOtp(
        verificationPhone,
        "recaptcha-container-verify",
      );

      setConfirmationResult(confirmation);
      toast.success("OTP resent successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
      setResendDisabled(false);
      setResendTimer(0);
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = () => {
    setLogoutLoading(true);

    logout();

    localStorage.removeItem("couponInfo");
    sessionStorage.removeItem("idToken");

    router.replace("/");
  };

  if (!_hasHydrated) return <Loading />;
  if (!userInfo) return <Loading />;

  return (
    <>
      <div
        className="flex min-h-screen bg-white dark:bg-[#161616] bg-cover bg-center z-0 overflow-x-hidden"
        style={{ backgroundImage: "url('/assets/form-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />

        <div className="container mx-auto relative lg:flex">
          {/* Left hero column */}
          <div className="z-10 w-full lg:w-1/2 flex flex-col text-white">
            <div className="flex flex-col items-start mt-10 lg:mt-48 relative">
              <p className="text-xl lg:text-2xl font-medium">Almost There</p>
              <h1 className="text-5xl lg:text-7xl font-extrabold mt-2 relative z-10">
                Verify Your Account
              </h1>
              <div className="bg-emerald-500 h-2 lg:h-4 w-1/3 -mt-2 lg:-mt-4 z-0" />
            </div>

            <div className="absolute bottom-12 w-full left-0 lg:left-16">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6 lg:justify-start">
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-gray-300 hover:text-emerald-500 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms-and-conditions"
                    className="text-sm text-gray-300 hover:text-emerald-500 transition-colors duration-200"
                  >
                    Terms and Conditions
                  </Link>
                  <Link
                    href="/contact-us"
                    className="text-sm text-gray-300 hover:text-emerald-500 transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </div>

                <p className="text-base text-gray-400 max-w-lg leading-relaxed text-center lg:text-left">
                  The product names & logos used on this website are for
                  identification purposes only. All trademarks are property of
                  their respective owners.
                </p>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="w-full lg:w-1/2 flex items-center justify-end py-12 z-10 mb-40 lg:mb-0">
            <div className="w-full lg:max-w-md">
              <div className="bg-[#F8F8F8] dark:bg-[#141414] p-8 rounded-2xl dark:border dark:border-[#303030]">
                <div className="text-center mb-10">
                  <Link href="/" className="inline-block">
                    <Image
                      src="/logo/logo-color.png"
                      alt="Gamingty Logo"
                      width={480}
                      height={450}
                      className="dark:hidden w-[180px] h-[50px]"
                      priority
                    />
                    <Image
                      src="/logo/logo-dark.png"
                      alt="Gamingty Logo"
                      width={480}
                      height={450}
                      className="hidden dark:inline-block w-[180px] h-[50px]"
                      priority
                    />
                  </Link>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {step === 1 ? "Update & Verify" : "Enter Verification Code"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 dark:text-gray-300">
                    {step === 1
                      ? "Secure your account by verifying your phone number."
                      : `Enter the OTP we sent to ${verificationPhone || "your phone"}.`}
                  </p>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name (Optional)
                      </label>
                      <input
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors((s) => ({ ...s, name: undefined }));
                        }}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />

                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
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
                    </div>

                    {/* reCAPTCHA container used by Firebase (keep this div) */}
                    <div
                      id="recaptcha-container-verify"
                      className="flex justify-center"
                    />

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading || isRecaptchaActive}
                      className="w-full relative flex items-center justify-center py-3 px-5 font-semibold bg-emerald-500 text-white rounded-full hover:bg-emerald-600 focus:outline-none transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span>
                        {isLoading ? "Sending OTP..." : "Update Profile"}
                      </span>
                      <div className="absolute right-3 rounded-full text-emerald-500 bg-white p-1.5">
                        <FiArrowRight className="h-5 w-5" />
                      </div>
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-5 text-center">
                    <OtpInput
                      value={otp}
                      onChange={(val: string) => {
                        setOtp(val);
                        setErrors((s) => ({ ...s, otp: undefined }));
                      }}
                      length={6}
                      autoFocus
                      label="Enter Your Verification Code"
                      labelClassName="text-sm font-bold"
                    />
                    {errors.otp && (
                      <p className="text-red-500 text-xs -mt-3">{errors.otp}</p>
                    )}

                    <button
                      type="button"
                      onClick={handleVerifyAndUpdate}
                      disabled={isLoading || otp.length !== 6}
                      className="w-full relative flex items-center justify-center py-3 px-5 font-semibold bg-emerald-500 text-white rounded-full hover:bg-emerald-600 focus:outline-none transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span>
                        {isLoading ? "Verifying..." : "Verify & Update"}
                      </span>
                      <div className="absolute right-3 rounded-full text-emerald-500 bg-white p-1.5">
                        <FiArrowRight className="h-5 w-5" />
                      </div>
                    </button>

                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Didn&apos;t receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendDisabled || isLoading || isResending}
                        className="ml-1 font-semibold text-emerald-600 hover:text-emerald-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {isResending
                          ? "Resending..."
                          : resendDisabled
                            ? `Resend in ${resendTimer}s`
                            : "Resend Code"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                        setErrors({});
                      }}
                      className="text-gray-600 hover:text-emerald-700 font-medium"
                    >
                      ← Back to Details
                    </button>
                  </div>
                )}

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutLoading || isLoading}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm inline-flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <FiLogOut className="mr-2" />
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>

              <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-8">
                © {new Date().getFullYear()} Gamingty. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
