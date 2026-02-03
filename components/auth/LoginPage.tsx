"use client";
import Head from "next/head";
import LoginForm from "@/components/auth/LoginForm";

import Link from "next/link";
import backgroundImage from "@/public/images/bg-login.webp";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FullLogo from "@/components/ui/FullLogo";
import AuthFooterLinks from "@/components/auth/AuthFooterLinks";
import AuthToggle from "@/components/auth/AuthToggle";
import TermsText from "@/components/auth/TermsText";
import { useTranslations } from "next-intl";
import SocialLoginButtons from "./SocialLoginButtons";
// Using inline SVG icons to avoid adding react-icons dependency in this UI-only page

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <>
      <Head>
        <title>{t("signInTitle")}</title>
      </Head>

      <div
        className="relative flex min-h-screen bg-cover bg-center z-0 overflow-x-hidden"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />

        <div className="container mx-auto relative lg:flex">
          {/* Left hero column */}
          <div className="z-10 w-full lg:w-1/2 flex flex-col text-white">
            <div className="flex flex-col items-start mt-10 lg:mt-48 relative">
              <p className="text-xl lg:text-2xl font-medium">
                {t("helloThere")}
              </p>
              <h1 className="text-4xl lg:text-6xl font-extrabold mt-2 relative z-10">
                {t("welcomeBack")}
              </h1>
              <div className="bg-emerald-500 h-2 lg:h-4 w-1/3 -mt-2 lg:-mt-4 z-0" />
            </div>

            <AuthFooterLinks />
          </div>

          {/* Right form column — UI only, no state */}
          <div className="w-full lg:w-1/2 flex items-center justify-end py-12 z-10 mb-40 lg:mb-0">
            <div className="w-full lg:max-w-md">
              <div className="bg-[#F8F8F8] dark:bg-[#141414] p-8 rounded-2xl dark:border dark:border-[#303030]">
                <div className="text-center flex flex-col justify-center items-center mb-10">
                  <FullLogo />
                </div>

                <AuthToggle activeTab="signin" />

                {/* Login form */}
                <LoginForm />

                <TermsText />

                {/* Social login buttons (reusable) */}
                <SocialLoginButtons />
                {/* <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-[#F8F8F8] dark:bg-[#141414] text-gray-500 dark:text-gray-400">
                      Or Continue With
                    </span>
                  </div>
                </div> */}
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
