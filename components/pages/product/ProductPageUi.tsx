"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SelectValueCard from "@/components/pages/product/SelectValueCard";
import BuyNow from "@/components/pages/product/Buynow";
import type { ProductPageData } from "@/types/product";
import RegionSelector from "@/components/shared/RegionSelector";
import RichTextCollapse from "@/components/ui/RichTextCollapse";
import Confidence from "../category/Confidence";
import YouMayLike from "@/components/product/YouMayLike";
import WishlistButton from "@/components/product/WishlistButton";
import { useTranslations } from "next-intl";

interface ProductPageUiProps {
  data: ProductPageData;
}

// Convert related products to SelectValueCard Value format
interface ValueCardItem {
  id: number;
  _id?: string;
  price: number;
  originalPrice: number;
  discount: number;
  slug: string;
  name?: string;
  image?: string;
  isHot?: boolean;
  isStock?: boolean;
}

export default function ProductPageUi({
  data,
  youMayLike,
}: ProductPageUiProps & { youMayLike: any }) {
  const t = useTranslations("product");
  const router = useRouter();
  const { product, filterCategory, relatedProducts } = data;
  const [selectedSlug, setSelectedSlug] = useState<string | null>(product.slug);

  const handleRegionChange = (slug: string) => {
    router.push(`/category/${slug}`);
  };

  // Handle product selection from SelectValueCard
  const handleProductSelect = (slug: string) => {
    setSelectedSlug(slug);
    router.push(`/product/${slug}`);
  };

  // Convert related products to value card format (sorted by price: low -> high)
  const sortedRelated = [...relatedProducts].sort(
    (a, b) => a.prices.price - b.prices.price,
  );

  const values: ValueCardItem[] = sortedRelated.map((prod, index) => ({
    id: index,
    _id: prod?._id,
    price: prod.prices.price,
    originalPrice: prod.prices.originalPrice,
    discount: prod.prices.discount,
    slug: prod.slug,
    name: prod.title.en,
    image: prod.image[0],
    isStock: prod.isStock,
    isHot: prod.isHot,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-6">
        <ol className="flex items-center gap-1  border border-border-light dark:border-border-dark rounded-full px-4 py-2 w-full md:w-fit overflow-hidden">
          <li>
            <Link
              href="/"
              className="hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {t("home")}
            </Link>
          </li>
          <li>›</li>
          {product.category?.slug ? (
            <>
              <li>
                <Link
                  href={`/category/${product.category.slug}`}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 truncate"
                >
                  {product.category.name.en}
                </Link>
              </li>
              <li>›</li>
            </>
          ) : (
            <li>›</li>
          )}
          <li className="text-emerald-600 dark:text-emerald-400 font-medium capitalize truncate md:w-auto">
            {product.title.en}
          </li>
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content */}
        <div className="md:col-span-7 lg:col-span-9">
          <div className="lg:hidden">
            <BuyNow
              values={values}
              selectedSlug={selectedSlug}
              categoryImage={product.image[0]}
              product={product}
              showActivation={true}
              // showAmount={false}
              // showBuyButton={false}
              // showQuantity={false}
              className="bg-transparent shado border-none"
            />
          
          </div>
          {/* Product Header */}
          <div className="mb-6 lg:mt-0 mt-6">
            <h1 className="text-lg hidden lg:block md:text-xl lg:text-3xl font-bold mb-3 dark:text-white">
              {product.title.en}
            </h1>
            <div className="items-center hidden lg:flex gap-4 mb-4">
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                {t("noReviews")}
              </span>
              {/* Wishlist Button */}
              <WishlistButton product={product} iconSize="w-6 h-6" />
            </div>

            {/* Product Description */}
            {product.sortDescription && (
              <p className="text-gray-600 dark:text-gray-300 mb-6 hidden lg:block">
                {product.sortDescription}
              </p>
            )}

            {/* Region Selector */}
            {filterCategory.length > 0 && (
              <div className="mb-6 max-w-xs">
                <RegionSelector
                  regions={filterCategory}
                  selectedSlug={product.category.slug}
                  onRegionChange={handleRegionChange}
                  label={t("region")}
                  showLabel={true}
                />
              </div>
            )}
          </div>

          {relatedProducts.length > 0 ? (
            <SelectValueCard
              values={values}
              digitalValues={values}
              stock={true}
              onProductSelect={handleProductSelect}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {t("noProductValues")}
              </p>
            </div>
          )}
          <div className="mt-6">
            <RichTextCollapse
              title={t("productDescription")}
              html={(() => {
                const desc = (product as any)?.description;
                if (!desc) return "";
                if (typeof desc === "string") return desc;
                // If it's an object with `en` key (or other translations), prefer `en` then first non-empty value
                if (typeof desc === "object") {
                  return (desc.en ??
                    Object.values(desc).find((v) => Boolean(v)) ??
                    "") as string;
                }
                return "";
              })()}
              initiallyOpen={true}
            />
          </div>
          <div className="mt-4">
            <RichTextCollapse
              title={t("termsConditions")}
              html={(() => {
                const desc = (product as any)?.termsAndConditions;
                if (!desc) return "";
                if (typeof desc === "string") return desc;
                // If it's an object with `en` key (or other translations), prefer `en` then first non-empty value
                if (typeof desc === "object") {
                  return (desc.en ??
                    Object.values(desc).find((v) => Boolean(v)) ??
                    "") as string;
                }
                return "";
              })()}
              initiallyOpen={false}
            />
          </div>
          <div className="mt-4">
            <RichTextCollapse
              title={t("howToRedeem")}
              html={(() => {
                const desc = (product as any)?.howToRedeem;
                if (!desc) return "";
                if (typeof desc === "string") return desc;
                // If it's an object with `en` key (or other translations), prefer `en` then first non-empty value
                if (typeof desc === "object") {
                  return (desc.en ??
                    Object.values(desc).find((v) => Boolean(v)) ??
                    "") as string;
                }
                return "";
              })()}
              initiallyOpen={false}
            />
          </div>
          <div className="mt-4">
            <RichTextCollapse
              title={t("faqs")}
              html={(() => {
                const desc = (product as any)?.benefits;
                if (!desc) return "";
                if (typeof desc === "string") return desc;
                // If it's an object with `en` key (or other translations), prefer `en` then first non-empty value
                if (typeof desc === "object") {
                  return (desc.en ??
                    Object.values(desc).find((v) => Boolean(v)) ??
                    "") as string;
                }
                return "";
              })()}
              initiallyOpen={false}
            />
          </div>
          <div className="mt-6 xl:hidden">
            <Confidence />
          </div>
        </div>

        {/* Sidebar - Buy Now Component */}
        <div className="md:col-span-5 lg:col-span-3 hidden lg:block">
          <div className="">
            <BuyNow
              values={values}
              selectedSlug={selectedSlug}
              categoryImage={product.image[0]}
              product={product}
              showActivation={true}
            />
          </div>
          <div className="mt-6 hidden xl:block">
            <Confidence />
          </div>
        </div>
      </div>
      <YouMayLike youMayLike={youMayLike} />
    </div>
  );
}
