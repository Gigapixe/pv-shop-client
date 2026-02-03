"use client";

import { FiHeart } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function WishlistHeaderSection() {
  const t = useTranslations("wishlist");
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-border-dark">
      <FiHeart className="text-xl text-emerald-500" />
      <h2 className="text-2xl font-semibold text-[#161616] dark:text-[#FFFFFF]">
        {t("title")}
      </h2>
    </div>
  );
}
