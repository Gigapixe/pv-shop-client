"use client";

import { useTranslations } from "next-intl";

export default function BestSellerHeaderClient() {
  const t = useTranslations("bestseller");

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
      <h1 className="text-2xl lg:text-4xl font-bold ">{t("heroTitle")}</h1>
      <p className="text-xs sm:text-sm lg:text-base mt-2">
        {t("heroSubtitle")}
      </p>
    </div>
  );
}
