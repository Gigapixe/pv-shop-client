
"use client";

import { MdArrowOutward } from "react-icons/md";

export default function AffiliateStatCard({
  title,
  value,
  change,
  loading,
  isLifetime,
}: {
  title: string;
  value: string | number;
  change: string;
  loading?: boolean;
  isLifetime?: boolean;
}) {
  return (
    <div className="group p-5 rounded-xl border transition-all duration-300 bg-white dark:bg-background-dark border-gray-200 dark:border-border-dark hover:shadow-lg hover:bg-primary hover:border-primary">
      <div className="flex justify-between items-start">
        <p className="text-xl font-semibold text-gray-800 dark:text-[#E5E5E5] group-hover:text-white">
          {title}
        </p>
        <div className="bg-primary/10 group-hover:bg-white p-2 rounded-full">
          <MdArrowOutward className="w-5 h-5 text-primary group-hover:text-primary" />
        </div>
      </div>
      <h3 className="text-4xl font-bold text-gray-900 dark:text-[#FFFFFF] group-hover:text-white">
        {loading ? "..." : value}
      </h3>
      <p className="text-sm mt-2 text-gray-500 dark:text-[#E5E5E5] group-hover:text-white/80">
        {isLifetime ? (
          <span className="font-semibold text-primary group-hover:text-white">{change}</span>
        ) : (
          <>
            <span className="font-semibold text-primary group-hover:text-white">{change}</span> Higher than
            last month
          </>
        )}
      </p>
    </div>
  );
}
