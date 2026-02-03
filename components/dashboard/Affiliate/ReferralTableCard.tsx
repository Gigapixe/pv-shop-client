"use client";

import { FiSearch, FiUsers } from "react-icons/fi";
import PaginationControls from "./PaginationControls";
import ReusableTable from "@/components/ui/ReusableTable";
import { IoMdArrowDropdown } from "react-icons/io";

export default function ReferralTableCard({
  title,
  loading,
  error,
  tableRef,
  columns,
  data,
  sortConfig,
  requestSort,
  emptyState,
  pagination,
}: any) {
  return (
    <div
      className="p-6 rounded-xl bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700"
      ref={tableRef}
    >
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <FiUsers className="text-xl text-primary" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search here..."
              className="
            pl-9 pr-3 py-2 w-42 lg:w-48 text-sm
            bg-white dark:bg-[#1C1C1C]
            border border-gray-300 dark:border-border-dark
            rounded-lg
            focus:outline-none
            focus:border-transparent
            focus:ring-2 focus:ring-primary
          "
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#E5E5E5] bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-border-dark px-2 lg:px-4 py-2 rounded-lg">
            This Month <IoMdArrowDropdown />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10">Loading...</div>
      ) : error ? (
        <div className="text-center p-10 text-red-500">{error}</div>
      ) : (
        <>
          <ReusableTable
            columns={columns}
            data={data}
            sortConfig={sortConfig}
            requestSort={requestSort}
            emptyStateComponent={emptyState}
          />
          {data?.length > 0 && <PaginationControls {...pagination} />}
        </>
      )}
    </div>
  );
}
