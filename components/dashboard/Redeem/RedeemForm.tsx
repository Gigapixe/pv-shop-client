"use client";

import { FiLoader } from "react-icons/fi";
import { CiSquarePlus } from "react-icons/ci";
import { useTranslations } from "next-intl";

type Props = {
  code: string;
  setCode: (v: string) => void;
  previewLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function RedeemForm({
  code,
  setCode,
  previewLoading,
  onSubmit,
}: Props) {
  const t = useTranslations("redeem");
  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="code"
        className="block text-sm lg:text-base font-medium text-[#6B7280] dark:text-[#E5E5E5] mb-2"
      >
        {t("enterCode")}
      </label>

      <div className="relative flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="
    w-full px-4 py-3 pr-5 lg:pr-56
    bg-[#FAFAFA] dark:bg-background-dark
    border border-[#DBDBDB] dark:border-gray-700
    rounded-full
    text-[#161616] dark:text-white
    placeholder-[#A0A0A0]
    shadow-sm
    transition-colors duration-200

    focus:outline-none
    focus:ring-2 focus:ring-primary
    focus:border-primary
  "
          placeholder={t("codePlaceholder")}
          autoComplete="off"
          autoFocus
          required
        />

        {/* Desktop button */}
        <button
          type="submit"
          disabled={previewLoading || !code}
          className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-emerald-600 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {previewLoading ? (
            <FiLoader className="animate-spin h-5 w-5" />
          ) : (
            <>
              <CiSquarePlus className="w-5 h-5" />
              <span className="text-sm font-medium">{t("getPreview")}</span>
            </>
          )}
        </button>

        {/* Mobile button */}
        <button
          type="submit"
          disabled={previewLoading || !code}
          className="w-full md:hidden flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-emerald-600 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
        >
          {previewLoading ? (
            <FiLoader className="animate-spin h-5 w-5" />
          ) : (
            <>
              <CiSquarePlus className="w-5 h-5" />
              <span className="text-sm font-medium">{t("getPreview")}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
