const BlogSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse dark:bg-gray-800 dark:shadow-lg">
      <div className="relative h-40 lg:h-40 xl:h-36 w-full bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 dark:bg-gray-700"></div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-4 dark:text-gray-400">
          <div className="h-3 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;