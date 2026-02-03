import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  pageSize?: number;
}

export interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const PaginationControls: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  loading = false,
}) => {
  const { currentPage, totalPages = 1, totalDocs, pageSize = 10 } = pagination;
  const showingFrom = totalDocs > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const showingTo = Math.min(currentPage * pageSize, totalDocs);

  const handlePrev = () => onPageChange(Math.max(currentPage - 1, 1));
  const handleNext = () => onPageChange(Math.min(currentPage + 1, totalPages));

  return (
    <div className="p-4 border-t border-border-light dark:border-border-dark flex justify-between items-center text-sm text-gray-500 dark:text-text-light">
      <p>
        Showing {showingFrom}-{showingTo} of {totalDocs} results
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1 || loading}
          onClick={handlePrev}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-border-dark disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>
        <span className="font-semibold">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage >= totalPages || loading}
          onClick={handleNext}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-border-dark disabled:opacity-50"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
