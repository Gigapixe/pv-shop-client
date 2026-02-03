"use client";

import { FiPlus } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function WishlistAddCategoryForm({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}) {
  const t = useTranslations("wishlist");
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#161616] dark:text-[#FFFFFF] mb-3">
        {t("addNewCategory")}
      </h3>

      <form onSubmit={onSubmit} className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("enterCategoryName")}
          disabled={disabled}
          className="
           w-full rounded-full
    border dark:border-border-dark
    bg-transparent dark:text-[#E5E5E5]
    py-3 pl-4 pr-28 transition
     text-sm
     dark:bg-[#1C1C1C]
   border-gray-300 
    
    focus:outline-none
    focus:border-transparent
    focus:ring-2 focus:ring-primary
  "
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="absolute right-1 top-1 bottom-1 bg-primary text-white rounded-full px-5 flex items-center gap-2 hover:bg-primary/80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FiPlus />
          {t("add")}
        </button>
      </form>
    </div>
  );
}
