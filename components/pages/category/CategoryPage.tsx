"use client";

import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import SearchIcon from "@/public/icons/SearchIcon";
import type { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CategoryCard from "./CategoryCard";

interface BreadCrumbItem {
  _id?: string;
  name?: { [lang: string]: string } | string;
  slug: string;
}

interface Props {
  categories: Category[];
  slug?: string;
  breadCrumbs?: BreadCrumbItem[];
  categoryImage?: string | null;
}

export default function CategoryPageUi({
  categories: initialCategories,
  slug,
  breadCrumbs,
  categoryImage,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 42;

  // helper to get display name from Category.name object
  const getName = (c: Category) => {
    if (!c || !c.name) return "";
    return c.name.en || Object.values(c.name)[0] || "";
  };

  // breadcrumbs: prefer API-provided breadCrumbs (categoryList), fallback to slug or first category
  const breadcrumbs = useMemo(() => {
    if (breadCrumbs && breadCrumbs.length > 0) {
      return breadCrumbs.map((b) => {
        const name =
          typeof b.name === "string"
            ? b.name
            : b.name?.en || Object.values(b.name || {})[0] || "";
        return { name, slug: b.slug };
      });
    }

    if (slug) return [{ name: slug.replace(/-/g, " "), slug }];

    if (initialCategories && initialCategories.length > 0) {
      return [
        {
          name: getName(initialCategories[0]),
          slug: initialCategories[0].slug,
        },
      ];
    }

    return [] as { name: string; slug: string }[];
  }, [initialCategories, slug, breadCrumbs]);

  // determine if API-provided breadcrumbs already include a Home entry
  const hasHomeCrumb = breadcrumbs.some(
    (b) =>
      (b.slug || "").toLowerCase() === "home" ||
      (b.name || "").toLowerCase() === "home",
  );
  const showDefaultHome = !hasHomeCrumb;

  const bannerImage = categoryImage ?? "/images/category-banner.png"; // no banner info in API payload currently

  const normalize = (s: string) =>
    (s || "")
      .toLowerCase()
      .replace(/[\._\-]+/g, " ")
      .replace(/[^a-z0-9 ]/g, "")
      .trim();

  const isUSABased = (c: Category) => {
    const name = normalize(getName(c));
    const slugVal = normalize(c.slug || "binance" || "");

    // match: "usa", "us", "united states", etc.
    return (
      slugVal === "usa" ||
      slugVal === "us" ||
      slugVal.includes("usa") ||
      slugVal.includes("united states") ||
      name === "usa" ||
      name === "us" ||
      name.includes("usa") ||
      name.includes("united states") ||
      name.toLowerCase().endsWith("usdt")
    );
  };

  // Filter categories based on search query (searching in name.en fallback)
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return [...initialCategories]
      .sort((a, b) => {
        const aUSA = isUSABased(a);
        const bUSA = isUSABased(b);
        if (aUSA !== bUSA) return aUSA ? -1 : 1; 
        return getName(a).localeCompare(getName(b)); 
      })
      .filter((category) => getName(category).toLowerCase().includes(q));
  }, [initialCategories, searchQuery]);

  // Pagination logic
  const totalItems = filteredCategories.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Reset to first page if filtered results change significantly
  useEffect(() => {
    if (currentPage > Math.ceil(totalItems / itemsPerPage) && totalItems > 0) {
      setCurrentPage(1);
    }
  }, [totalItems, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const TranslatedName: React.FC<{ name: string }> = ({ name }) => <>{name}</>;

  return (
    <>
      <div className="w-full relative mb-6 h-62.5 lg:h-87.5">
        <Image
          src={bannerImage || "/images/category-banner.png"}
          alt="Category Banner"
          fill
          className="object-fill w-full h-full"
          priority
        />
        {/* Blurred overlay */}
        <div className="absolute inset-0 bg-black/40  rounded-lg z-10" />
        {/* Breadcrumb centered on image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <ol className="flex items-center gap-1 md:gap-2 text-xs md:text-sm flex-wrap border border-border-light dark:border-border-dark rounded-full px-4 py-2 bg-primary/10 text-white dark:bg-background-dark/70 backdrop-blur-md shadow">
            {showDefaultHome && (
              <>
                <li>
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                <li className="shrink-0">{">"}</li>
              </>
            )}

            {breadcrumbs.map((crumb, idx) => {
              const isLast =
                crumb.slug === breadcrumbs[breadcrumbs.length - 1]?.slug;
              const href =
                (crumb.slug || "").toLowerCase() === "home"
                  ? "/"
                  : `/category/${crumb.slug}`;
              return (
                <li
                  key={crumb.slug}
                  className="flex items-center gap-1 md:gap-2"
                >
                  {idx > 0 && <span>{">"}</span>}
                  <Link
                    href={href}
                    className={`hover:text-primary capitalize block truncate max-w-25 md:max-w-full ${isLast ? "text-primary" : ""}`}
                    title={crumb.name}
                  >
                    <TranslatedName name={crumb.name} />
                  </Link>
                </li>
              );
            })}
          </ol>

          {breadcrumbs.length > 0 && (
            <div className="mt-4 text-lg md:text-2xl font-semibold text-primary drop-shadow-lg text-center capitalize">
              <TranslatedName name={breadcrumbs[breadcrumbs.length - 1].name} />
            </div>
          )}

          <div className="mt-2 text-sm text-white">
            {`Subcategories (Total ${filteredCategories.length} items)`}
          </div>
        </div>
      </div>

      <div className="container mx-auto md:py-8 py-4">
        <nav className="mb-6 flex md:flex-row flex-col justify-between gap-4 ">
          <ol className="md:flex items-center gap-1 md:gap-2 text-xs md:text-sm flex-wrap border border-border-light dark:border-border-dark rounded-full px-4 py-2 w-full md:w-fit hidden">
            {showDefaultHome && (
              <>
                <li>
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                <li className="shrink-0 md:hidden">{">"}</li>
              </>
            )}

            <div className="flex md:hidden items-center gap-1 md:gap-2">
              {breadcrumbs.length > 2 && (
                <>
                  <li className="shrink-0">…</li>
                  <li className="shrink-0">{">"}</li>
                </>
              )}

              {breadcrumbs.slice(-2).map((crumb, idx) => {
                const isLast =
                  crumb.slug === breadcrumbs[breadcrumbs.length - 1]?.slug;
                const href =
                  (crumb.slug || "").toLowerCase() === "home"
                    ? "/"
                    : `/category/${crumb.slug}`;
                return (
                  <li
                    key={crumb.slug}
                    className="flex items-center gap-1 md:gap-2"
                  >
                    {idx > 0 && <span>{">"}</span>}
                    <Link
                      href={href}
                      className={`hover:text-primary capitalize block truncate max-w-25 ${isLast ? "text-primary" : ""}`}
                      title={crumb.name}
                    >
                      <TranslatedName name={crumb.name} />
                    </Link>
                  </li>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-2">
              {breadcrumbs.map((crumb, idx) => {
                const isLast =
                  crumb.slug === breadcrumbs[breadcrumbs.length - 1]?.slug;
                const href =
                  (crumb.slug || "").toLowerCase() === "home"
                    ? "/"
                    : `/category/${crumb.slug}`;
                return (
                  <li
                    key={crumb.slug}
                    className="flex items-center gap-1 md:gap-2"
                  >
                    {idx > 0 && <span>{">"}</span>}
                    <Link
                      href={href}
                      className={`hover:text-primary max-w-25 truncate lg:max-w-full capitalize ${isLast ? "text-primary" : ""}`}
                      title={crumb.name}
                    >
                      <TranslatedName name={crumb.name} />
                    </Link>
                  </li>
                );
              })}
            </div>
          </ol>

          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Search categories..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </nav>

        {currentCategories.length > 0 ? (
          <div className="grid xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 grid-cols-2 justify-items-center gap-4 mb-4">
            {currentCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-center ">No categories found</p>
        )}

        {totalItems > 35 && (
          <Pagination
            page={currentPage}
            pageSize={itemsPerPage}
            total={totalItems}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}
