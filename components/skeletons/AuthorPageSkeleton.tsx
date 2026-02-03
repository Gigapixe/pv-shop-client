// app/author/[slug]/loading.jsx
const AuthorPageSkeleton = () => {
  return (
    <div className="min-h-screen container mx-auto bg-gray-50 py-8 dark:bg-gray-900">
      {/* Back Link */}
      <div className="mb-8">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-8 dark:bg-gray-700" />

        <div className="flex flex-col md:flex-row md:items-start items-center mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden md:mr-6 mr-0 mb-4 md:mb-0 shrink-0 bg-gray-200 animate-pulse dark:bg-gray-700" />
          <div className="flex flex-col md:items-start items-center w-full">
            <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse mb-2 dark:bg-gray-700" />
            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Blog Posts by Author Skeleton */}
      <div>
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-8 dark:bg-gray-700" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <article
              key={i}
              className="overflow-hidden group animate-fadeIn"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative h-40 lg:h-40 xl:h-36 w-full overflow-hidden rounded-md bg-gray-200 animate-pulse dark:bg-gray-700" />
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2 dark:text-gray-400">
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
              </div>
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse mt-2 dark:bg-gray-700" />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorPageSkeleton;
