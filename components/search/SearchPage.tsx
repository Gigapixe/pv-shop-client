"use client";

import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import ProductsCarouselSkeleton from "../carousel/ProductsCarouselSkeleton";
import { useTranslations } from "next-intl";
import CategoryCard from "../pages/category/CategoryCard";

const EMPTY_ARR: any[] = [];

type Props = {
  query: string;
  initialCategories?: any[];
  initialProducts?: any[];
  usFlag?: string | null;
  usProduct?: any[] | null;
  isLoadingFromServer?: boolean;
};

export default function SearchPage({
  query,
  initialCategories = EMPTY_ARR,
  initialProducts = EMPTY_ARR,
  usFlag = null,
  usProduct = null,
  isLoadingFromServer = false,
}: Props) {
  const t = useTranslations("search");

  const validCategories = useMemo(
    () =>
      (initialCategories || EMPTY_ARR).filter(
        (c) => c && typeof c === "object" && c._id,
      ),
    [initialCategories],
  );

  const validProducts = useMemo(
    () =>
      (initialProducts || EMPTY_ARR).filter(
        (p) => p && typeof p === "object" && p._id,
      ),
    [initialProducts],
  );

  const usProductState = useMemo(
    () => (Array.isArray(usProduct) ? usProduct : EMPTY_ARR),
    [usProduct],
  );

  const usProductsCount = usProductState.length;
  const totalCount =
    validCategories.length + validProducts.length + usProductsCount;

  const getNameEn = (obj: any) => obj?.en || "Unknown";

  const showEmptyState =
    !!query &&
    !isLoadingFromServer &&
    validCategories.length === 0 &&
    validProducts.length === 0 &&
    usProductsCount === 0;

  return (
    <div className="container mx-auto bg-background dark:bg-background-dark">
      <div className="py-10 lg:py-12">
        <div className="w-full">
          {isLoadingFromServer ? (
            <ProductsCarouselSkeleton />
          ) : showEmptyState ? (
            <div className="text-center align-middle mx-auto p-5 my-5 bg-background rounded-lg shadow-md border border-border-muted dark:bg-background-dark dark:border-border-dark">
              <Image
                className="my-4 mx-auto"
                src="/no-result.svg"
                alt="no-result"
                width={400}
                height={380}
              />
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium font-serif text-content-muted dark:text-gray-200">
                {t("noResults")}
              </h2>
            </div>
          ) : (
            <>
              {/* Result Count */}
              {!!query && (
                <div className="mb-6">
                  <div className="w-full bg-background-light dark:bg-background-dark rounded-xl shadow-sm p-4 dark:border dark:border-border-dark">
                    <div className="flex items-center">
                      <span className="mr-2 text-content-muted dark:text-gray-200 font-medium">
                        {t("resultFound")}:
                      </span>
                      <span className="font-bold text-emerald-600">
                        {totalCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories */}
              {validCategories.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-content-default mb-2 dark:text-white">
                    {t("categories")}
                  </h4>

                  <div>
                    {validCategories.length > 0 && (
                      <div className="mb-8">
                        {/* <h4 className="text-xl font-semibold text-content-default mb-2 dark:text-white">
                          {t("categories")}
                        </h4> */}

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                          {validCategories.map((child, i) => (
                            <CategoryCard
                              key={child?._id || i}
                              category={child}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Products */}
              {validProducts.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-content-default mb-2 dark:text-white">
                    {t("products")}
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {validProducts.map((product, i) => (
                      <div key={product?._id || i}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* US Featured */}
              {usProductState.length > 0 && (
                <div id="us-products" className="mb-8">
                  <div className="mb-4">
                    <div className="text-xl font-semibold flex items-center gap-2 whitespace-nowrap text-content-default dark:text-white">
                      {(() => {
                        const first = usProductState[0] || {};
                        const parentName =
                          first?.category?.parentId?.name?.en ||
                          first?.category?.name?.en ||
                          "Featured";
                        const country = first?.countrySupport || "";
                        const flagUrl = usFlag || first?.category?.flag || "";

                        return (
                          <>
                            {parentName}
                            {country ? (
                              <span className="flex items-center gap-2 text-xl">
                                <span className="text-xl font-semibold">
                                  {t("for")}
                                </span>

                                <span className="inline-block w-8 h-5 rounded overflow-hidden border border-border-muted dark:border-border-dark bg-white/10">
                                  {flagUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={flagUrl}
                                      alt={country}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <span className="block w-full h-full bg-gray-200" />
                                  )}
                                </span>

                                <span className="text-xl font-semibold">
                                  {country}
                                </span>
                              </span>
                            ) : null}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {usProductState.map((product, i) => (
                      <div key={product?._id || i}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
