import Link from "next/link";


export const metadata = {
  title: "404 - Page Not Found | Gamingty",
  description:
    "This page doesn't exist or was removed. We suggest you go back to home.",
};

export default function NotFound() {
  return (
    <div className="px-6 py-10 lg:py-20 min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Oops!
        </h1>
        <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          This Page doesn&apos;t exist or was removed! We suggest you go back to
          home.
        </p>

        <div className="mt-8 mb-8 flex justify-center">
          <div className="w-full max-w-[520px] sm:max-w-[640px] px-4">
            {/* <ErrorPageIcon className="w-full h-auto mx-auto" /> */}
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 mx-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full px-6 sm:px-8 py-3 shadow-md transition-all duration-200 w-full sm:w-auto max-w-xs"
          aria-label="Back to home"
        >
          <span className="inline-block transform">
            {/* <BackArrowIcon /> */}
          </span>
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
}
