"use client";

import { FiCopy, FiExternalLink, FiLink } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function ReferralLinkCard({
  loading,
  referralLink,
  onCopy,
}: {
  loading: boolean;
  referralLink: string;
  onCopy: () => void;
}) {
  const t = useTranslations("referral");
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <FiLink className="text-2xl text-primary" />
        <h3 className="text-xl font-semibold">{t("uniqueReferralLink")}</h3>
      </div>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {t("shareYourLink")}
      </p>

      <div className="mt-6">
        <h4 className="font-medium text-base mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          {t("yourReferralLink")} <FiExternalLink className="text-primary" />
        </h4>

        <div className="relative">
          <input
            type="text"
            readOnly
            value={loading ? t("loading") : referralLink || ""}
            className="
              w-full px-5 py-3 pr-20 md:pr-36
              bg-white dark:bg-gray-700
              border border-gray-200 dark:border-gray-600
              rounded-full text-gray-700 dark:text-gray-300
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            "
          />

          <button
            onClick={onCopy}
            disabled={loading}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              flex items-center justify-center gap-2
              bg-primary text-white font-semibold
              py-2 px-2 sm:px-5 rounded-full
              hover:opacity-90 transition-all duration-300 shadow-md
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            <FiCopy />
            <span className="md:block hidden">{t("copyLink")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
