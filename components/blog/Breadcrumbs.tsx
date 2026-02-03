import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function Breadcrumbs({ blog }: { blog: any }) {
  const t = useTranslations("blog");
  return (
    <div className="text-sm text-gray-500 mb-4 dark:text-gray-400">
      <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400">
        {t("home")}
      </Link>{" "}
      <FiChevronRight className="inline-block h-3 w-3 mx-1 dark:text-gray-500" />{" "}
      <Link
        href="/blog"
        className="hover:text-cyan-600 dark:hover:text-cyan-400"
      >
        {t("blog")}
      </Link>
      {blog.category && (
        <>
          {" "}
          <FiChevronRight className="inline-block h-3 w-3 mx-1 dark:text-gray-500" />{" "}
          <Link
            href={`/blog/category/${blog.category.slug}`}
            className="hover:text-cyan-600 dark:hover:text-cyan-400"
          >
            {blog.category.name}
          </Link>
        </>
      )}{" "}
      <FiChevronRight className="inline-block h-3 w-3 mx-1 dark:text-gray-500" />{" "}
      <span className="text-gray-700 dark:text-gray-300">{blog.title}</span>
    </div>
  );
}
