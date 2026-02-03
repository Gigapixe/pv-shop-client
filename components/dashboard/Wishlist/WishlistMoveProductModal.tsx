"use client";

import { IoReloadCircleOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

export default function WishlistMoveProductModal({
  open,
  onClose,
  wishlist,
  activeTab,
  targetCategory,
  setTargetCategory,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;

  wishlist: Record<string, any[]>;
  activeTab: string;

  targetCategory: string;
  setTargetCategory: (v: string) => void;

  onConfirm: () => void;
  isLoading: boolean;
}) {
  const t = useTranslations("wishlist");
  if (!open) return null;

  const categories = Object.keys(wishlist || {}).filter((c) => c !== activeTab);

  return (
    <div className="fixed inset-0 z-9999999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={() => !isLoading && onClose()}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-1 cursor-default"
      />

      {/* Panel */}
      <div className="relative z-2 bg-white p-6 rounded-xl shadow-2xl max-w-md w-full dark:bg-background-dark dark:border dark:border-border-dark max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-5">
          <h3 className="text-2xl font-bold text-[#161616] dark:text-[#FFFFFF]">
            {t("moveProduct")}
          </h3>

          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <select
            className="
    w-full p-3 rounded-lg
    border border-[#DBDBDB]
    bg-white text-gray-900
    dark:bg-background-dark dark:text-[#E5E5E5]
    dark:border-border-dark

    focus:outline-none
    focus:ring-2 focus:ring-primary
  "
            value={targetCategory}
            onChange={(e) => setTargetCategory(e.target.value)}
            disabled={isLoading}
          >
            <option value="" disabled>
              {t("selectTargetCategory")}
            </option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => !isLoading && onClose()}
              className="px-5 py-2.5 text-[#6B7280] bg-[#FAFAFA] border rounded-lg hover:bg-gray-200 hover:dark:bg-gray-700 transition disabled:opacity-60 dark:text-[#E5E5E5] dark:bg-background-dark dark:hover:bg-opacity-80"
              disabled={isLoading}
            >
              {t("cancel")}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading || !targetCategory}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition inline-flex items-center gap-2"
            >
              {isLoading ? (
                <IoReloadCircleOutline className="animate-spin w-5 h-5" />
              ) : null}
              {t("move")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
