"use client";

export default function ReviewableCardSkeleton() {
  return (
    <div className="bg-[#FAFAFA] dark:bg-background-dark rounded-xl border border-[#DBDBDB] dark:border-[#303030] overflow-hidden">
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="border-t border-[#DBDBDB] dark:border-[#303030] pt-3 mt-3 space-y-2">
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
