import React from "react";

const CategorySliderSkeleton: React.FC = () => {
  return (
    <div className="relative w-full container mx-auto animate-pulse py-4">
      {/* Grid matching real slider behavior */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        {[0, 1, 2, 3].map((idx) => {
          const visibility =
            idx === 2 ? "hidden md:block" : idx === 3 ? "hidden xl:block" : "";
          return (
            <div key={idx} className={`shrink-0 p-2 ${visibility}`}>
              <div className="group border border-white dark:border-white/10 rounded-xl shadow flex flex-col lg:flex-row gap-2 lg:gap-4 items-center p-6 bg-background-light dark:bg-background-dark-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Left Arrow Skeleton */}
      <div className="absolute top-1/2 left-0 transform rotate-180 -translate-y-1/2 z-10 bg-gray-300 dark:bg-gray-600 p-2 rounded-full shadow-md w-9 h-9" />
      {/* Right Arrow Skeleton */}
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-gray-300 dark:bg-gray-600 p-2 rounded-full shadow-md w-9 h-9" />
    </div>
  );
};

export default CategorySliderSkeleton;
