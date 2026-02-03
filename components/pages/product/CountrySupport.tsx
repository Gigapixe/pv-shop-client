"use client";

import { useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";
import { FiGlobe } from "react-icons/fi";
import {
  getProductsByFilters,
  getAllCountries,
} from "@/services/productService";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import CheckIcon from "@/public/icons/CheckIcon";
import GlobeIcon from "@/public/icons/GlobeIcon";
import { useTranslations } from "next-intl";

interface Country {
  _id: string;
  name: string;
}

interface ProductLike {
  slug?: string;
  countrySupport?: string;
  category?: { flag?: string };
}

export default function CountrySupport({ slug }: { slug?: string }) {
  const t = useTranslations("product");
  const [isRestrictionsModalOpen, setIsRestrictionsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [product, setProduct] = useState<ProductLike | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState<{ data?: Country[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [storeData, countryData] = await Promise.all([
          getProductsByFilters(undefined, undefined, slug),
          getAllCountries(),
        ]);

        const found =
          storeData?.products?.find((p: any) => p.slug === slug) ||
          storeData?.product ||
          null;
        setProduct(found);
        setUserCountry(storeData?.userCountry || null);
        setCountries(countryData || null);
      } catch (err: any) {
        setError(err?.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const isCountrySupported = product?.countrySupport
    ? product.countrySupport === "Global" ||
      product.countrySupport === userCountry
    : true;

  const countrySupportMessage = isCountrySupported
    ? product?.countrySupport === "Global"
      ? t("canActivateIn", { country: userCountry ?? "" })
      : t("canActivateIn", { country: userCountry ?? "" })
    : t("cantActivateIn", { country: userCountry ?? "" });

  const filteredCountries =
    countries?.data?.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const isSpecificCountryMatch =
    product?.countrySupport &&
    product.countrySupport !== "Global" &&
    product.countrySupport.toLowerCase().includes(searchQuery.toLowerCase());

  if (isLoading) {
    return (
      <div className="animate-pulse mt-2">
        <div className="flex items-center gap-1 text-base font-semibold">
          <div className="bg-gray-200 p-2 rounded-lg w-8 h-8 dark:bg-gray-700"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-1 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-base font-semibold">
          <div className="bg-gray-200 p-2 rounded-lg w-8 h-8 dark:bg-gray-700"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm mt-2 dark:text-red-400">
        {t("errorLoadingData", { error: error ?? "" })}
      </div>
    );
  }

  return (
    <>
      {product?.countrySupport && userCountry && (
        <div className="mt-2">
          <div className="flex flex-col">
            {isCountrySupported ? (
              <div>
                <h1 className="mb-2 font-bold">{t("activation")}</h1>
                <div className="flex items-center gap-1 text-base font-semibold">
                  <span className="text-emerald-500">
                    <CheckIcon fill="#12B47E" />
                  </span>
                  <h2 className="font-bold dark:text-gray-300">
                    {countrySupportMessage}
                  </h2>
                </div>
                <button
                  onClick={() => setIsRestrictionsModalOpen(true)}
                  className="underline text-sm"
                >
                  {t("checkCountryRestrictions")}
                </button>
                <hr className="my-4 border-border-light dark:border-border-dark" />
              </div>
            ) : (
              <div>
                <h1 className="mb-2 font-bold">{t("activation")}</h1>
                <div className="flex items-center gap-1 text-base font-semibold">
                  <div className="text-red-500">
                    <MdBlockFlipped size={20} />
                  </div>
                  <h2 className="text-red-600 dark:text-red-400 text-base">
                    {countrySupportMessage}
                  </h2>
                </div>
                <button
                  onClick={() => setIsRestrictionsModalOpen(true)}
                  className="text-red-600 underline hover:text-red-800 text-sm dark:text-red-400 dark:hover:text-red-300 text-left"
                >
                  {t("checkCountryRestrictions")}
                </button>
                <hr className="my-4 border-border-light dark:border-border-dark" />
              </div>
            )}

            <div>
              <h2 className="mb-2 font-bold">{t("productRegion")}</h2>
              <div className="flex items-center gap-1 text-base font-semibold">
                <GlobeIcon />
                <h2 className="font-bold dark:text-gray-300">
                  {product?.countrySupport}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isRestrictionsModalOpen}
        onClose={() => setIsRestrictionsModalOpen(false)}
      >
        <div className="">
          <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">{t("regionRestrictions")}</h3>
            <button
              onClick={() => setIsRestrictionsModalOpen(false)}
              className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            {isCountrySupported ? (
              <div className="flex items-center gap-1 text-base font-semibold">
                <div className="bg-emerald-500 p-2 rounded-lg text-white dark:bg-emerald-600">
                  <IoCheckmarkCircle size={20} />
                </div>
                <h2 className="text-emerald-500 dark:text-emerald-400">
                  {t("canBeActivatedIn", { country: userCountry ?? "" })}
                </h2>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-base font-semibold">
                <div className="bg-red-600 p-2 rounded-lg text-white dark:bg-red-700">
                  <MdBlockFlipped size={20} />
                </div>
                <h2 className="text-red-600 dark:text-red-400 text-xs">
                  {t("cantBeActivatedIn", { country: userCountry ?? "" })}
                </h2>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div>
              <h3 className="font-semibold dark:text-white text-lg">
                {t("yourCountry")}
              </h3>
              <p className="dark:text-gray-300 font-semibold">{userCountry}</p>
            </div>
            <div>
              <h3 className="font-semibold dark:text-white text-lg">
                {t("productRegion")}
              </h3>
              <p className="dark:text-gray-300 font-semibold">
                {product?.countrySupport}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 dark:text-white text-sm">
              {t("listOfAllowedCountries")}
            </h3>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchCountry")}
              className="rounded-lg"
            />
            <div className="max-h-48 overflow-y-auto min-h-40 mt-4">
              {product?.countrySupport === "Global" ? (
                filteredCountries.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {filteredCountries.map((country) => (
                      <p key={country._id} className="dark:text-gray-300">
                        {country.name}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("noCountryFound")}
                  </p>
                )
              ) : isSpecificCountryMatch ? (
                <p className="text-sm dark:text-gray-300">
                  {product?.countrySupport}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("noCountryFound")}
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
