"use client";

import { useMemo } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useTranslations } from "next-intl";

type Props = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  showingFrom: number;
  showingTo: number;
  onPageChange: (p: number) => void;
};

export default function WalletPagination({
  currentPage,
  totalPages,
  totalResults,
  showingFrom,
  showingTo,
  onPageChange,
}: Props) {
  const t = useTranslations("wallet");
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="p-4 border-t border-[#DBDBDB] dark:border-[#303030] flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-[#E5E5E5] gap-2">
      <p className="text-center sm:text-left">
        <span className="hidden md:flex">
          {t("showing", {
            from: showingFrom,
            to: showingTo,
            total: totalResults,
          })}{" "}
          |
        </span>{" "}
        {t("page", { current: currentPage, total: totalPages })}
      </p>

      <div className="flex items-center justify-center gap-1 md:gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-md hover:bg-[#FAFAFA] dark:hover:bg-[#303030] disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>

        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 md:px-3 py-1">
              <FiMoreHorizontal />
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-2 md:px-3 py-1 rounded-md transition-colors duration-200 ease-in-out ${
                currentPage === p
                  ? "bg-emerald-500 text-white font-bold"
                  : "hover:bg-[#FAFAFA] dark:hover:bg-[#303030]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-md hover:bg-[#FAFAFA] dark:hover:bg-[#303030] disabled:opacity-50"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
