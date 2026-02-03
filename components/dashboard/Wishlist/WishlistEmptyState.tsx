"use client";

import Image from "next/image";
import emptyWishlist from "../../../public/icons/empty-wishlist.png";
import { useTranslations } from "next-intl";

export default function WishlistEmptyState() {
  const t = useTranslations("wishlist");
  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-4">
        <Image
          src={emptyWishlist}
          alt="Empty Wishlist"
          width={150}
          height={150}
        />
      </div>
      <h2 className="text-2xl font-semibold text-[#161616] dark:text-[#FFFFFF]">
        {t("noProductsTitle")}
      </h2>
      <p className="text-base text-[#6B7280] dark:text-[#E5E5E5] mt-1">
        {t("noProductsMessage")}
      </p>
    </div>
  );
}
