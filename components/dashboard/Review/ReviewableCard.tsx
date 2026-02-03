"use client";

import dayjs from "dayjs";
import { MdArrowOutward } from "react-icons/md";
import type { ReviewableItem } from "@/types/reviews";
import CurrencyDisplay from "@/components/ui/currency/CurrencyDisplay";
import { useTranslations } from "next-intl";

type Props = {
  item: ReviewableItem;
  fallbackImg: string;
  onWriteReview: (item: ReviewableItem) => void;
};

export default function ReviewableCard({
  item,
  fallbackImg,
  onWriteReview,
}: Props) {
  const t = useTranslations("reviews");
  const img = item.product.image || fallbackImg;

  return (
    <div className="bg-[#FAFAFA] dark:bg-background-dark rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#DBDBDB] dark:border-[#303030]">
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-t-xl flex items-center justify-center overflow-hidden">
        <img
          src={img}
          alt={item.product.title}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-sm text-[#161616] dark:text-[#FFFFFF] truncate"
          title={item.product.title}
        >
          {item.product.title}
        </h3>

        <p className="text-sm font-medium text-[#6B7280] dark:text-[#E5E5E5] mt-1">
          {t("orderOn")}:{" "}
          {dayjs(item.orderDate).isValid()
            ? dayjs(item.orderDate).format("DD MMMM, YYYY")
            : item.orderDate}
        </p>

        <div className="border-t border-[#DBDBDB] dark:border-[#303030] pt-3 mt-3">
          <p className="text-xl font-bold text-[#161616] dark:text-[#FFFFFF]">
            <CurrencyDisplay amount={item.product.price} />
          </p>

          <button
            onClick={() => onWriteReview(item)}
            className="mt-2 text-sm font-semibold text-[#12B47E] flex items-center gap-1 transition-colors underline"
          >
            {t("writeReview")} <MdArrowOutward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
