// src/app/(dashboard)/redeem/_components/ProductDetailsCard.tsx
"use client";

import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import type { GiftCardProduct } from "@/services/redeemService";
import Price from "@/components/ui/Price";

export default function ProductDetailsCard({
  product,
}: {
  product: GiftCardProduct;
}) {
  return (
    <div className="bg-[#FAFAFA] dark:bg-background-dark p-6 rounded-xl border border-[#DBDBDB] dark:border-gray-700">
      <h3 className="text-lg font-semibold text-[#161616] dark:text-[#FFFFFF] mb-4 flex items-center">
        <FiShoppingCart className="w-5 h-5 mr-2 text-emerald-500" />
        Associated Product Details
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {product.image?.length ? (
          <div className="relative w-24 h-24 rounded-md overflow-hidden shadow shrink-0">
            <Image
              src={product.image[0]}
              alt={product.title?.en || "Product Image"}
              fill
              style={{ objectFit: "cover" }}
              className="bg-gray-100 dark:bg-gray-600"
            />
          </div>
        ) : null}

        <div className="text-center sm:text-left">
          <h4 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
            {product.title?.en || "N/A"}
          </h4>

          <div className="text-sm text-[#6B7280] dark:text-[#E5E5E5] mt-1">
            Current Market Value:{" "}
            <Price
              price={product.price}
              className="font-medium text-[#161616] dark:text-[#FFFFFF]"
            />
            {typeof product.originalPrice === "number" &&
              typeof product.price === "number" &&
              product.originalPrice > product.price && (
                <Price
                  price={product.originalPrice}
                  className="ml-2 line-through text-xs text-[#A0A0A0] dark:text-[#6B7280]"
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
