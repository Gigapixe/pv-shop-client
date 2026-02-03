"use client";

import { useTranslations } from "next-intl";

export default function BestSellerSectionClient() {
  const t = useTranslations("bestseller");

  return (
    <>
      <h2 className="text-2xl lg:text-4xl font-bold mb-6">
        {t("sectionTitle")}
      </h2>
      {/* <p className="mt-2 text-center text-gray-600 dark:text-gray-300 md:text-base text-sm mb-4">
        {t("sectionDescription")}
      </p> */}
    </>
  );
}
