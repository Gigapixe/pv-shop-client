import Link from "next/link";
import { FiChevronsRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

function getCategoryLabel(name: unknown) {
  if (typeof name === "string") return name;
  if (name && typeof name === "object") {
    const maybeEn = (name as any).en;
    if (typeof maybeEn === "string") return maybeEn;
  }
  return "Category";
}

export default function Sidebar({
  categories,
  blog,
}: {
  categories: any[];
  blog: any;
}) {
  const t = useTranslations("blog");
  const safeCategories = Array.isArray(categories)
    ? categories.filter(
        (c) => c && typeof c === "object" && typeof c.slug === "string",
      )
    : [];

  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-24">
        {safeCategories.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 dark:bg-gray-700 dark:shadow-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {t("categories")}
            </h3>

            <ul className="space-y-2">
              {safeCategories.map((category) => (
                <li key={category._id ?? category.slug}>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="flex items-center justify-between text-gray-700 hover:text-cyan-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-cyan-400"
                  >
                    <span>{getCategoryLabel(category.name)}</span>
                    <FiChevronsRight className="h-4 w-4 dark:text-gray-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(blog?.tags) && blog.tags.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 dark:bg-gray-700 dark:shadow-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {t("tags")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
