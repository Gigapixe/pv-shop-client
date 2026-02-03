"use client";

export default function ReviewCardSkeleton() {
  return (
    <div className="bg-white dark:bg-background-dark rounded-lg p-4 border border-gray-200 dark:border-[#303030] shadow-sm">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      </div>
    </div>
  );
}
