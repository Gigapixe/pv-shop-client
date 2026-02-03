"use client";

import { getCategoryProductsSearch } from "@/services/productService";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/ui/SearchLoader";

type RecentItem = {
  type: "query" | "product";
  query?: string;
  timestamp?: number;
  slug?: string;
  title?: string;
  image?: string;
};

type RecentItems = {
  queries: RecentItem[];
  products: RecentItem[];
};

type Product = {
  _id: string;
  slug: string;
  image?: string[];
  title?: { en?: string; zh?: string } | string;
};

type Category = {
  _id: string;
  slug: string;
  icon?: string;
  name?: { en?: string; [key: string]: any } | string;
};

type SearchResponse = {
  success: boolean;
  message?: string;
  products?: Product[];
  categories?: Category[];
};

type Props = {
  view?: string;
};

const PLACEHOLDER_IMG =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

export default function SearchBar({ view = "" }: Props) {
  const t = useTranslations("common");
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItems>({
    queries: [],
    products: [],
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);

  // Debounce & request-taming refs
  const debounceTimerRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);
  const DEBOUNCE_MS = 500;

  // Load recent items
  useEffect(() => {
    const stored = localStorage.getItem("recentItems");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setRecentItems(parsed || { queries: [], products: [] });
    } catch {
      setRecentItems({ queries: [], products: [] });
    }
  }, []);

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      // Invalidate any in-flight requests
      requestIdRef.current++;
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        event.target instanceof Node &&
        !searchRef.current.contains(event.target)
      ) {
        setShowPopup(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProductTitle = (p: Product) => {
    if (!p?.title) return "";
    if (typeof p.title === "string") return p.title;
    return p.title.en ?? p.title.zh ?? "";
  };

  const getProductImage = (p: Product) => {
    const img = Array.isArray(p.image) ? p.image[0] : undefined;
    return img || PLACEHOLDER_IMG;
  };

  const getCategoryName = (c: Category) => {
    if (!c?.name) return "Unknown";
    if (typeof c.name === "string") return c.name;
    return c.name.en || "Unknown";
  };

  const getCategoryIcon = (c: Category) => c?.icon || PLACEHOLDER_IMG;

  const saveRecent = (data: RecentItems) => {
    localStorage.setItem("recentItems", JSON.stringify(data));
    setRecentItems(data);
  };

  const addToRecentItems = (
    item: any,
    type: RecentItem["type"],
    query: string,
  ) => {
    const existing: RecentItems = { ...recentItems };

    if (type === "query") {
      const newItem: RecentItem = {
        type: "query",
        query,
        timestamp: Date.now(),
      };
      existing.queries = [
        newItem,
        ...existing.queries.filter((q) => q.query !== query),
      ].slice(0, 5);
    }

    if (type === "product" && item) {
      const newItem: RecentItem = {
        type: "product",
        slug: item.slug,
        title: getProductTitle(item),
        image: getProductImage(item),
        query,
        timestamp: Date.now(),
      };
      existing.products = [
        newItem,
        ...existing.products.filter((p) => p.slug !== item.slug),
      ].slice(0, 6);
    }

    saveRecent(existing);
  };

  const clearRecentItem = (index: number, type: keyof RecentItems) => {
    const updated: RecentItems = { ...recentItems };
    updated[type] = updated[type].filter((_, i) => i !== index);
    saveRecent(updated);
  };

  const clearAllRecent = () => {
    localStorage.removeItem("recentItems");
    setRecentItems({ queries: [], products: [] });
  };

  // Immediate fetch (non-debounced) - used internally by debounced input or can be used directly
  const fetchSearch = async (search: string) => {
    if (!search) {
      setProducts([]);
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const reqId = ++requestIdRef.current;

    try {
      const res = (await getCategoryProductsSearch({
        title: search,
      })) as SearchResponse;

      // Ensure this is the latest request
      if (reqId !== requestIdRef.current) return;

      setProducts(res?.products || []);
      setCategories(res?.categories || []);
    } catch (err) {
      // console.log(err);
      if (reqId !== requestIdRef.current) return;
      setProducts([]);
      setCategories([]);
    } finally {
      if (reqId === requestIdRef.current) setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchText(value);

    if (!value) {
      // clear
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      requestIdRef.current++;
      setProducts([]);
      setCategories([]);
      setShowSuggestions(false);
      setShowPopup(true);
      setIsLoading(false);
      return;
    }

    // prepare UI
    setShowPopup(false);
    setShowSuggestions(true);

    // debounce fetch
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      fetchSearch(value);
    }, DEBOUNCE_MS);
  };

  const handleSearchClick = (item: any, type: "product" | "query") => {
    setShowSuggestions(false);
    setShowPopup(false);

    addToRecentItems(item, type, searchText);

    if (type === "product") {
      router.push(`/product/${item.slug}`);
      return;
    }

    router.push(
      `/search?query=${searchText.toLowerCase().replace(/\s/g, "+")}`,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchText.trim()) {
      router.push(
        `/search?query=${searchText.toLowerCase().replace(/\s/g, "+")}`,
      );
      addToRecentItems(null, "query", searchText);
      setSearchText("");
      setShowPopup(false);
      setShowSuggestions(false);
    } else {
      router.push("/");
      setSearchText("");
      setShowPopup(false);
      setShowSuggestions(false);
    }
  };

  const dropdownVisible = showPopup || showSuggestions;

  return (
    <div className={`${view} w-full`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative flex-1">
        <div className="relative">
          <input
            type="text"
            className="placeholder:text-gray-400 w-full h-12 pl-4 pr-14 text-sm rounded-full border border-gray-200 bg-white text-gray-700 dark:bg-background-dark dark:border-border-dark dark:text-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition duration-200"
            placeholder={t("searchPlaceholder")}
            value={searchText}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              setShowPopup(true);
              setShowSuggestions(false);
            }}
          />

          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 flex items-center bg-primary hover:bg-primary/80 rounded-full transition-colors"
            aria-label="Search"
          >
            <IoSearchOutline className="h-5 w-5 text-white" />
          </button>
        </div>

        {dropdownVisible && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-background-dark rounded-lg shadow-xl border border-gray-200 dark:border-border-dark overflow-hidden z-999999">
            <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-border-dark dark:scrollbar-track-background-dark">
              {/* RECENTS */}
              {showPopup && !showSuggestions ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {t("recentViewed")}
                    </h3>

                    {(recentItems.queries.length > 0 ||
                      recentItems.products.length > 0) && (
                      <button
                        type="button"
                        onClick={clearAllRecent}
                        className="text-xs text-red-500 hover:text-red-600 transition-colors"
                      >
                        {t("clearAll")}
                      </button>
                    )}
                  </div>

                  {/* Queries */}
                  {recentItems.queries.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {t("queries")}
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {recentItems.queries.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-100 border border-gray-200 dark:border-border-dark dark:bg-background-dark rounded-full px-3 py-1 text-sm hover:text-primary transition-colors font-semibold"
                          >
                            <Link
                              href={`/search?query=${String(item.query || "")
                                .toLowerCase()
                                .replace(/\s/g, "+")}`}
                              onClick={() => {
                                setShowPopup(false);
                                setShowSuggestions(false);
                              }}
                              className="flex items-center"
                            >
                              <span>{item.query}</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => clearRecentItem(index, "queries")}
                              className="ml-2 text-gray-500 hover:text-red-500"
                              aria-label="Remove"
                            >
                              <IoClose className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {recentItems.products.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                        {t("products")}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 justify-items-center xl:flex xl:flex-wrap gap-4">
                        {recentItems.products.map((item: any, index) => (
                          <Link
                            key={`${item.slug}-${index}`}
                            href={`/product/${item.slug}`}
                            className="group block"
                            onClick={() => {
                              setShowPopup(false);
                              setShowSuggestions(false);
                            }}
                          >
                            <div className="relative h-40 w-32 rounded-lg overflow-hidden bg-gray-50 dark:bg-background-dark flex flex-col items-center p-2 border border-gray-100 dark:border-border-dark hover:border-gray-200 hover:dark:border-border-dark transition-colors">
                              <Image
                                width={100}
                                height={100}
                                src={item.image || PLACEHOLDER_IMG}
                                alt={item.title || ""}
                                className="object-cover h-24 w-24 transform transition-transform duration-300 scale-95 group-hover:scale-100"
                              />
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-200 group-hover:text-primary text-center line-clamp-2 transition-colors duration-200">
                                {item.title}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {recentItems.queries.length === 0 &&
                    recentItems.products.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                        {t("noRecentSearches")}
                      </p>
                    )}
                </div>
              ) : (
                // SUGGESTIONS
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      {/* ✅ Categories first */}
                      {categories.length > 0 && (
                        <div className="mb-5">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                            {t("categories")}
                          </h4>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 justify-items-center xl:flex xl:flex-wrap gap-4">
                            {categories.slice(0, 6).map((cat, index) => (
                              <Link
                                key={`${cat._id}-${index}`}
                                href={`/category/${cat.slug}`}
                                className="group block"
                                onClick={() => {
                                  setShowPopup(false);
                                  setShowSuggestions(false);
                                }}
                              >
                                <div className="relative h-40 w-32 rounded-lg overflow-hidden bg-gray-50 dark:bg-background-dark flex flex-col items-center p-2 border border-gray-100 dark:border-border-dark hover:border-gray-200 hover:dark:border-border-dark transition-colors">
                                  <Image
                                    width={100}
                                    height={100}
                                    src={getCategoryIcon(cat)}
                                    alt={getCategoryName(cat)}
                                    className="object-cover h-24 w-24 transform transition-transform duration-300 scale-95 group-hover:scale-100"
                                  />
                                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-200 group-hover:text-primary text-center line-clamp-2 transition-colors duration-200">
                                    {getCategoryName(cat)}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ✅ Products second */}
                      {products.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                            {t("products")}
                          </h4>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 justify-items-center xl:flex xl:flex-wrap gap-4">
                            {products.slice(0, 6).map((item, index) => (
                              <Link
                                key={`${item._id}-${index}`}
                                href={`/product/${item.slug}`}
                                className="group block"
                                onClick={() =>
                                  handleSearchClick(item, "product")
                                }
                              >
                                <div className="relative h-40 w-32 rounded-lg overflow-hidden bg-gray-50 dark:bg-background-dark flex flex-col items-center p-2 border border-gray-100 dark:border-border-dark hover:border-gray-200 hover:dark:border-border-dark transition-colors">
                                  <Image
                                    width={100}
                                    height={100}
                                    src={getProductImage(item)}
                                    alt={getProductTitle(item)}
                                    className="object-cover h-24 w-24 transform transition-transform duration-300 scale-95 group-hover:scale-100"
                                  />
                                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-200 group-hover:text-primary text-center line-clamp-2 transition-colors duration-200">
                                    {getProductTitle(item)}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty state */}
                      {categories.length === 0 && products.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("noResultsFound")}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
