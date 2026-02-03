
"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function PaginationControls({
  pagination,
  pageCount,
  totalDocs,
  onPageChange,
  loading,
}: any) {
  const { pageIndex, pageSize } = pagination;
  const currentPage = pageIndex + 1;

  const showingFrom = totalDocs > 0 ? pageIndex * pageSize + 1 : 0;
  const showingTo = Math.min((pageIndex + 1) * pageSize, totalDocs);

  return (
    <div className="p-4 border-t border-gray-100 dark:border-border-dark flex justify-between items-center text-sm text-gray-500 dark:text-[#E5E5E5]">
      <p>
        Showing {showingFrom}-{showingTo} of {totalDocs} results
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1 || loading}
          onClick={() => onPageChange((prev: any) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-border-dark disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>
        <span className="font-semibold">
          Page {currentPage} of {pageCount || 1}
        </span>
        <button
          disabled={currentPage === pageCount || loading || pageCount === 0}
          onClick={() => onPageChange((prev: any) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-border-dark disabled:opacity-50"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
