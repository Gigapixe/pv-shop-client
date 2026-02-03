"use client";

import CategoryIcon from "@/public/icons/footer/CategoryIocn";
import VectorIcon from "@/public/icons/VectorIcon";
import { useCategoryStore } from "@/zustand/store";
import { useTranslations } from "next-intl";

export default function CategoryToggleButton() {
  const t = useTranslations("common");
  return (
    <button
      onClick={() => useCategoryStore.getState().openCategory()}
      className="lg:flex lg:justify-between lg:bg-primary-dark lg:py-4 items-center lg:p-2 lg:px-4 lg:w-auto lg:hover:bg-primary-dark/60"
    >
      <div className="hidden lg:flex items-center gap-2">
        <VectorIcon className="text-white" />
        <h1 className="text-white">{t("allCategories")}</h1>
      </div>
      <div className="lg:hidden mx-auto flex flex-col items-center">
        <CategoryIcon className="w-6 h-6 text-white" />
        <h1 className="text-white lg:hidden text-xl">{t("category")}</h1>
      </div>
    </button>
  );
}
