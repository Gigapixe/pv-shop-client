"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { IoMoveOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
import CurrencyDisplay from "@/components/ui/currency/CurrencyDisplay";

type WishlistItemsGridProps = {
  items: any[];
  onOpenMove: (id: string) => void;
  onRemove: (id: string) => void;
  currency: string;
  formatPrice: (n: number) => string;
  formatTitle: (title: any) => string;
};

export default function WishlistItemsGrid({
  items,
  onOpenMove,
  onRemove,
  currency,
  formatPrice,
  formatTitle,
}: WishlistItemsGridProps) {
  const t = useTranslations("wishlist");

  return (
    <div
      className="
        grid gap-3 lg:gap-4
        grid-cols-2
        md:grid-cols-3 
        lg:grid-cols-5
        2xl:grid-cols-6
      "
    >
      {items.map((product) => (
        <div
          key={product._id}
          className="
            w-full
            overflow-hidden
            rounded-2xl
            border border-gray-100 dark:border-border-dark
            bg-white dark:bg-background-dark
            shadow-sm hover:shadow-md
            transition-shadow
          "
        >
          {/* Image */}
          <Link
            href={`/product/${product.slug}`}
            className="relative block w-full aspect-square overflow-hidden"
          >
            <Image
              src={product.image?.[0] || "/placeholder.png"}
              alt={formatTitle(product.title)}
              fill
              sizes="(max-width: 640px) 50vw,
                     (max-width: 768px) 33vw,
                     (max-width: 1024px) 25vw,
                     (max-width: 1280px) 20vw,
                     16vw"
              className="object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          </Link>

          {/* Content */}
          <div className="p-2 sm:p-3 flex flex-col">
            {/* Title + old price */}
            <div className="min-h-[52px] sm:min-h-[60px]">
              <h3 className="font-bold text-xs sm:text-sm text-[#161616] dark:text-white hover:text-primary transition-colors line-clamp-2">
                <Link href={`/product/${product.slug}`}>
                  {formatTitle(product.title)}
                </Link>
              </h3>

              {product?.prices?.originalPrice > product?.prices?.price && (
                <p className="mt-1 text-[11px] sm:text-xs text-gray-600 dark:text-[#E5E5E5]">
                  {t("price")}:{" "}
                  <span className="line-through">
                    USD<CurrencyDisplay amount={product.prices.originalPrice} />
                  </span>
                </p>
              )}
            </div>

            {/* Price + actions */}
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-border-dark flex flex-col md:flex-row items-center justify-between gap-2">
              <p className="text-xs sm:text-sm font-semibold text-[#161616] dark:text-white whitespace-nowrap">
                USD<CurrencyDisplay amount={product.prices.price} />
              </p>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenMove(product._id)}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary/70 transition-colors"
                  title={t("moveToCategory")}
                >
                  <IoMoveOutline className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(product._id)}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
                  title={t("removeFromWishlist")}
                >
                  <FiTrash2 className="w-4 h-4 " />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
