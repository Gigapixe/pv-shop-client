"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SelectValueCard from "@/components/pages/product/SelectValueCard";
import BuyNow from "@/components/pages/product/Buynow";
import type {
  CategoryData,
  CategoryProduct,
  FilterCategory,
  BreadcrumbItem,
} from "@/types/category";
import Confidence from "./Confidence";
import RichTextCollapse from "@/components/ui/RichTextCollapse";
import YouMayLike from "@/components/product/YouMayLike";
import RegionSelector from "@/components/shared/RegionSelector";
import { useTranslations } from "next-intl";

interface CategoryProductsProps {
  category: CategoryData;
  products: CategoryProduct[];
  filterCategory: FilterCategory[];
  categoryList: BreadcrumbItem[];
}

// Convert CategoryProduct to SelectValueCard Value format
interface ValueCardItem {
  id: number;
  _id?:string;
  price: number;
  originalPrice: number;
  discount: number;
  slug: string;
  name?: string;
  image?: string;
  isHot?: boolean;
  isStock?: boolean;
}

export default function CategoryProducts({
  category,
  products,
  filterCategory,
  categoryList,
  youMayLike,
}: CategoryProductsProps & { youMayLike: any }) {
  const t = useTranslations("product");
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const handleRegionChange = (slug: string) => {
    router.push(`/category/${slug}`);
  };

  // Handle product selection from SelectValueCard
  // Note: Don't update selectedSlug here - let navigation handle it
  // to prevent BuyNow UI from changing before route transition
  const handleProductSelect = (slug: string) => {
    // Navigation is handled by SelectValueCard internally
  };

  // Convert products to value card format (sorted by price: low -> high)
  const sortedProducts = [...products].sort(
    (a, b) => a.prices.price - b.prices.price,
  );

  const values: ValueCardItem[] = sortedProducts.map((product, index) => ({
    id: index,
    _id:product?._id,
    price: product.prices.price,
    originalPrice: product.prices.originalPrice,
    discount: product.prices.discount,
    slug: product.slug,
    name: product.title.en,
    image: product.image[0],
    isStock: product.isStock,
    isHot: product.isHot,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-6 w-full">
        <ol className="flex items-center gap-1 flex-nowrap border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 w-full overflow-hidden md:w-fit bg-white dark:bg-background-dark">
          {categoryList.map((item, index) => (
            <li key={item._id} className="flex items-center gap-1">
              {index === categoryList.length - 1 ? (
                <span
                  title={item.name.en}
                  className="capitalize truncate max-w-25 md:max-w-none md:w-auto text-primary"
                  aria-current="page"
                >
                  {item.name.en}
                </span>
              ) : (
                <Link
                  href={item.slug === "home" ? "/" : `/category/${item.slug}`}
                  title={item.name.en}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 capitalize truncate  md:w-auto"
                >
                  {item.name.en}
                </Link>
              )}

              {index < categoryList.length - 1 && (
                <span className="text-gray-400">›</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content */}
        <div className="md:col-span-7 lg:col-span-9">
          {/* Category Header */}
          <div className="mb-6">
            <div className=" items-center gap-4 mb-4 hidden lg:flex capitalize">
              <h1 className="text-2xl font-bold dark:text-white ">
                {category.name.en}
              </h1>
            </div>
            <div className="lg:hidden">
              <BuyNow
                values={values}
                selectedSlug={selectedSlug}
                categoryImage={category.icon}
                categoryName={category.name.en}
              />
            </div>

            {/* Region Selector */}
            {filterCategory.length > 0 && (
              <div className="max-w-xs mt-6 lg:mt-0">
                <RegionSelector
                  regions={filterCategory}
                  selectedSlug={category.slug}
                  onRegionChange={handleRegionChange}
                  label={t("region")}
                  showLabel={true}
                />
              </div>
            )}
          </div>
          <hr className="my-4 border-border-light dark:border-border-dark" />
          {/* Select Value Section */}
          <h2 className="text-xl font-semibold dark:text-white">
            {t("selectValue")}
          </h2>
          {/* Products Selection - Using SelectValueCard */}
          {products.length > 0 ? (
            <SelectValueCard
              values={values}
              digitalValues={values}
              stock={true}
              onProductSelect={handleProductSelect}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {t("noProductsInCategory")}
              </p>
            </div>
          )}

          {/* Category Description */}
          <div className="mt-6">
            <RichTextCollapse
              title={t("productDescription")}
              html={(() => {
                const desc = (category as any)?.description;
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
        <div className="md:col-span-5 lg:col-span-3 hidden lg:block sticky top-40 self-start">
          <div className="">
            <BuyNow
              values={values}
              selectedSlug={selectedSlug}
              categoryImage={category.icon}
              categoryName={category.name.en}
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
