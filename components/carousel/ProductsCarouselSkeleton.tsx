export default function ProductsCarouselSkeleton() {
  const Card = ({ className = "" }: { className?: string }) => (
    <div
      className={`animate-pulse bg-white dark:bg-background-dark border border-border-muted dark:border-border-dark rounded-xl h-[270px] w-[164.56px] flex flex-col overflow-hidden ${className}`}
    >
      {/* Image area */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <svg
          className="w-14 h-14 text-gray-300 dark:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"
            strokeWidth="1.5"
          />
          <path
            strokeWidth="1.5"
            d="M3 16l4-4a3 3 0 014 0l4 4m0 0l2-2a3 3 0 014 0l2 2"
          />
          <circle cx="9" cy="9" r="1.5" />
        </svg>
      </div>

      {/* Text placeholders */}
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mt-2" />
      </div>
    </div>
  );

  return (
    <div className="w-full container mx-auto py-8 relative">
      <div className="flex gap-4">
        {/* Always visible */}
        <Card />
        <Card />

        {/* md+ */}
        <Card className="hidden md:flex" />
        <Card className="hidden md:flex" />

        {/* xl+ */}
        <Card className="hidden xl:flex" />
        <Card className="hidden xl:flex" />
        <Card className="hidden xl:flex" />
      </div>
    </div>
  );
}
