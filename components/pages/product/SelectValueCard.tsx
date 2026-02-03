"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import HotIcon from "@/public/icons/product/HotIcon";
import CurrencyDisplay from "@/components/ui/currency/CurrencyDisplay";
import { useTranslations } from "next-intl";

interface Value {
  id: number;
  price: number;
  originalPrice: number;
  discount: number;
  slug: string;
  name?: string;
  image?: string;
  isHot?: boolean;
  isStock?: boolean;
}

interface SelectValueCardProps {
  stock?: boolean;
  values: Value[];
  digitalValues?: Value[];
  topupValues?: Value[];
  onProductSelect?: (slug: string) => void; // Optional callback for product selection
}

export default function SelectValueCard({
  values,
  stock = true,
  digitalValues = [],
  topupValues = [],
  onProductSelect,
}: SelectValueCardProps) {
  const t = useTranslations("product");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSlug = pathname.split("/").pop();
  // Default to digital-pin if topupValues is empty or tab is invalid
  const initialTab =
    topupValues.length > 0 && searchParams.get("tab") === "topup-pin"
      ? "topup-pin"
      : "digital-pin";
  const [activeTab, setActiveTab] = useState<"digital-pin" | "topup-pin">(
    initialTab,
  );
  const [selected, setSelected] = useState<number | null>(() => {
    const currentValues =
      initialTab === "digital-pin" ? digitalValues : topupValues;
    const index = currentValues.findIndex(
      (value) => value.slug === currentSlug,
    );
    return index !== -1 ? index : null;
  });
  // Sync selected value when slug or tab changes
  useEffect(() => {
    const currentValues =
      activeTab === "digital-pin" ? digitalValues : topupValues;
    const index = currentValues.findIndex(
      (value) => value.slug === currentSlug,
    );
    setSelected(index !== -1 ? index : null);
  }, [currentSlug, activeTab, digitalValues, topupValues]);

  // Sync activeTab with query parameter changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    // Only set to topup-pin if topupValues exists
    if (tab === "topup-pin" && topupValues.length > 0) {
      setActiveTab("topup-pin");
    } else {
      setActiveTab("digital-pin");
    }
  }, [searchParams, topupValues]);

  const handleSelect = (index: number, tab: "digital-pin" | "topup-pin") => {
    const selectedValue = (tab === "digital-pin" ? digitalValues : topupValues)[
      index
    ];
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", tab);

    // Navigate first - selected state will update via useEffect after navigation
    router.push(`/product/${selectedValue.slug}?${newParams.toString()}`);

    // Call the callback if provided
    if (onProductSelect) {
      onProductSelect(selectedValue.slug);
    }
  };

  const handleTabChange = (tab: "digital-pin" | "topup-pin") => {
    // Prevent switching to topup-pin if topupValues is empty
    if (tab === "topup-pin" && topupValues.length === 0) return;
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", tab);
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="mt-6">
      <div className="flex mt-4">
        <button
          className={`px-8 py-4 rounded-t-lg font-medium ${
            activeTab === "digital-pin"
              ? "dark:bg-background-dark-2 bg-background-light "
              : "dark:hover:bg-background-dark-2/70 hover:bg-background-light/70"
          }`}
          onClick={() => handleTabChange("digital-pin")}
          disabled={digitalValues.length === 0}
        >
          {t("digitalPin")}
        </button>
        {topupValues.length > 0 && (
          <button
            className={`px-8 py-4 rounded-t-lg font-medium ${
              activeTab === "topup-pin"
                ? "dark:bg-background-dark-2 bg-background-light"
                : "dark:hover:bg-background-dark-2/70 hover:bg-background-light/70"
            }`}
            onClick={() => handleTabChange("topup-pin")}
            disabled={topupValues.length === 0}
          >
            {t("topUpPin")}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-background-light dark:bg-background-dark-2 p-4 rounded-b-lg rounded-r-lg">
        {(activeTab === "digital-pin" ? digitalValues : topupValues).map(
          (value, index) => {
            // Calculate discount/markup safely
            let discountPercent = 0;
            let isDiscount = true;

            if (value.price < value.originalPrice) {
              discountPercent = Math.round(
                ((value.originalPrice - value.price) / value.originalPrice) *
                  100,
              );
              isDiscount = true;
            } else if (value.price > value.originalPrice) {
              discountPercent = Math.round(
                ((value.price - value.originalPrice) / value.originalPrice) *
                  100,
              );
              isDiscount = false;
            }

            const isOutOfStock = value.isStock === false;
            // const ishotproduct = value.isHot === true;
            // console.log(value);

            return (
              <div
                key={value.id}
                className={`cursor-pointer border rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition hover:border-primary ${
                  selected === index
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 dark:border-gray-700"
                } ${isOutOfStock ? "opacity-50 dark:opacity-40" : ""}`}
                onClick={() => handleSelect(index, activeTab)}
              >
                <div>
                  <p className="md:text-lg font-semibold">
                    <CurrencyDisplay amount={value.price} />
                  </p>

                  {isOutOfStock ? (
                    <span className="text-red-500 text-base font-medium mt-1 block">
                      {t("outOfStock")}
                    </span>
                  ) : (
                    <>
                      {discountPercent > 0 && (
                        <div className="flex items-center gap-1 lg:gap-2 mt-1 flex-wrap">
                          <span className="line-through text-gray-400 text-xs">
                            <CurrencyDisplay amount={value.originalPrice} />
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              isDiscount
                                ? "bg-primary text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {isDiscount
                              ? `-${discountPercent}%`
                              : `+${discountPercent}%`}
                          </span>
                          <span>
                            {value.isHot && (
                              <span className="text-red-500 flex items-center gap-1 text-[10px] bg-red-500/20 px-2 py-0.5 rounded-full">
                                <HotIcon fill="#fb2c36" /> {t("hot")}
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <input
                  type="radio"
                  checked={selected === index}
                  onChange={() => handleSelect(index, activeTab)}
                  className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
