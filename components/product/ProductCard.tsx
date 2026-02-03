"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/zustand/store";
import { IoBagAddSharp, IoBagCheckOutline } from "react-icons/io5";
import WishlistButton from "./WishlistButton";
import CurrencyDisplay from "@/components/ui/currency/CurrencyDisplay";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";

type Product = {
  title: string | { en?: string; zh?: string };
  prices?: { price: number; originalPrice?: number; discount?: number };
  DigitalPrice?: { price: number };
  image?: string | string[];
  isStock?: boolean;
  stock?: number;
  slug: string;
  _id?: string;
  id?: string;
  isGiftCard?: boolean;
  type?: string;
  paymentMethods?: string[] | { _id: string }[];
  category?: {
    paymentMethods?: string[] | { _id: string; name?: string }[];
    parentId?: {
      paymentMethods?: string[] | { _id: string }[];
    };
  };
};

type ProductCardProps = {
  product: Product;
  className?: string;
};

export default function ProductCard({
  product,
  className = "",
}: ProductCardProps) {
  const { addToCart, openCart, items } = useCartStore();

  const imageSrc = Array.isArray(product.image)
    ? product.image[0]
    : product.image || "/images/placeholder.png";

  const price = product.prices?.price ?? product.DigitalPrice?.price ?? 0;
  const originalPrice = product.prices?.originalPrice;

  const outOfStock = product.isStock === false;

  const titleText =
    typeof product.title === "string"
      ? product.title
      : (product.title?.en ?? product.title?.zh ?? "");

  const productId = product._id ?? product.id ?? product.slug;

  const isInCart = items.some((item) => item._id === productId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const paymentMethodsSet = new Set<string>();

    const addIds = (list: any[]) => {
      if (!Array.isArray(list)) return;
      list.forEach((item) => {
        if (typeof item === "string") paymentMethodsSet.add(item);
        else if (item?._id) paymentMethodsSet.add(item._id);
      });
    };

    if (product.paymentMethods) addIds(product.paymentMethods as any[]);

    if (product.category?.paymentMethods) {
      addIds(product.category.paymentMethods as any[]);
    }
    if (product.category?.parentId?.paymentMethods) {
      addIds(product.category.parentId.paymentMethods as any[]);
    }

    const success = addToCart({
      _id: productId,
      productId: product._id ?? product.id ?? product.slug,
      title: titleText,
      slug: product.slug,
      price,
      originalPrice,
      image: imageSrc,
      isGiftCard: product.isGiftCard || false,
      type: (product.type as any) || "DIGITAL_PINS",
      paymentMethods: Array.from(paymentMethodsSet),
    });

    if (success) {
      openCart();
    } else {
      toast.error("Please complete or remove the wallet topup.");
      openCart();
    }
  };

  return (
    <div
      className={`group hover:-translate-y-1 transition-all duration-200 rounded-xl bg-background-light dark:bg-white/5 max-w-50.5 ${className}`}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative pt-[100%]">
          <Image
            src={imageSrc}
            alt={titleText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center rounded-t-xl"
            loading="eager"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              outOfStock
                ? "bg-primary/20 text-red-500 dark:bg-primary/20 dark:text-red-500 font-semibold"
                : "bg-primary/20 text-primary dark:bg-primary/20 dark:text-primary"
            }`}
          >
            {outOfStock ? "Out of Stock" : "In Stock"}
          </div>

          <WishlistButton product={product} />
        </div>

        <Link href={`/product/${product.slug}`}>
          <h2
            id={`product-title-${product.slug}`}
            className="text-base font-medium text-content-default mt-1 mb-2 line-clamp-1 cursor-pointer hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary overflow-hidden text-ellipsis whitespace-nowrap"
            data-tooltip-content={titleText}
          >
            {titleText}
          </h2>
        </Link>

        <Tooltip
          anchorSelect={`#product-title-${product.slug}`}
          place="top"
          className="z-50 bg-background-light dark:bg-background-dark! rounded-full! px-3 py-1 text-[10px]! dark:text-white shadow-lg max-w-xs"
        />

        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col">
            <span className="text-primary dark:text-primary font-bold text-sm whitespace-nowrap">
              <CurrencyDisplay amount={price} showCurrency />
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-content-subtle text-xs line-through dark:text-gray-400 whitespace-nowrap">
                <CurrencyDisplay amount={originalPrice} showCurrency />
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={isInCart ? "View Cart" : "Add to cart"}
            className={`${
              outOfStock
                ? "bg-gray-400 cursor-not-allowed dark:bg-gray-600"
                : isInCart
                  ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  : "bg-primary hover:bg-primary-600 dark:bg-primary dark:hover:bg-primary-700"
            } text-white p-2.5 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md flex items-center justify-center dark:shadow-none dark:hover:shadow-none`}
          >
            {isInCart ? (
              <IoBagCheckOutline className="text-xl" />
            ) : (
              <IoBagAddSharp className="text-xl" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
