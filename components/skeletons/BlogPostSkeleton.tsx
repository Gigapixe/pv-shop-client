// app/blog/[slug]/loading.jsx (or wherever your route's loading UI lives)
const BlogPostSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Back to Blog Link */}
        <div className="mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
        </div>

        <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 dark:bg-gray-800 dark:shadow-xl">
          {/* Banner Image */}
          <div className="relative h-64 md:h-80 lg:h-96 w-full rounded-2xl overflow-hidden mb-8 bg-gray-200 animate-pulse dark:bg-gray-700" />

          {/* Header Section */}
          <header className="mb-8">
            {/* Title */}
            <div className="animate-fadeIn">
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4 dark:bg-gray-700" />
              <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 animate-fadeIn animation-delay-200">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
            </div>
          </header>

          {/* Content and Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content */}
            <article className="lg:col-span-8 space-y-4 animate-fadeIn animation-delay-300">
              <div className="h-6 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
              <div className="h-6 w-11/12 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
              <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
              <div className="h-6 w-11/12 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
              <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Categories Skeleton */}
                <div className="bg-gray-50 rounded-xl p-6 animate-pulse dark:bg-gray-700">
                  <div className="h-7 w-2/3 bg-gray-200 rounded mb-4 dark:bg-gray-600" />
                  <div className="space-y-3">
                    <div className="h-5 w-full bg-gray-200 rounded dark:bg-gray-600" />
                    <div className="h-5 w-11/12 bg-gray-200 rounded dark:bg-gray-600" />
                    <div className="h-5 w-5/6 bg-gray-200 rounded dark:bg-gray-600" />
                  </div>
                </div>

                {/* Tags Skeleton */}
                <div className="bg-gray-50 rounded-xl p-6 animate-pulse dark:bg-gray-700">
                  <div className="h-7 w-1/3 bg-gray-200 rounded mb-4 dark:bg-gray-600" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded-full dark:bg-gray-600" />
                    <div className="h-8 w-24 bg-gray-200 rounded-full dark:bg-gray-600" />
                    <div className="h-8 w-16 bg-gray-200 rounded-full dark:bg-gray-600" />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;
