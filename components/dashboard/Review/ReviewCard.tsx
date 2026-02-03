"use client";

import dayjs from "dayjs";
import { FiStar } from "react-icons/fi";
import type { Review } from "@/types/reviews";

type Props = {
  review: Review;
  fallbackImg: string;
};

export default function ReviewCard({ review, fallbackImg }: Props) {
  const img = review.product?.image?.[0] || fallbackImg;
  const title = review.product?.title?.en || "Product";

  return (
    <div className="bg-white dark:bg-background-dark rounded-lg p-4 border border-gray-200 dark:border-[#303030] shadow-sm">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden shrink-0">
          <img src={img} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="min-w-0">
          <h3 className="text-xs tracking-wider font-semibold text-[#161616] dark:text-[#FFFFFF]">
            {title}
          </h3>

          <p className="text-xs text-[#6B7280] dark:text-[#E5E5E5]">
            {dayjs(review.createdAt).format("DD MMMM, YYYY")}
          </p>

          {review.userName ? (
            <p className="text-xs text-[#6B7280] dark:text-[#BDBDBD] mt-0.5">
              by {review.userName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => (
          <FiStar
            key={index}
            className={`w-5 h-5 ${
              index < review.rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-[#6B7280] dark:text-[#E5E5E5] leading-relaxed line-clamp-3">
        {review.comment}
      </p>
    </div>
  );
}
