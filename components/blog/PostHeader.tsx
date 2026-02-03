import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiTag, FiUser } from "react-icons/fi";
import ShareButton from "./ShareButton";

export default function PostHeader({ blog }: { blog: any }) {
  return (
    <>
      <div className="relative h-64 md:h-80 lg:h-96 w-full rounded-2xl overflow-hidden mb-8">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          loading="eager"
          priority
          sizes="(max-width: 768px) 100vw,
           (max-width: 1024px) 100vw,
           100vw"
          className="object-cover"
        />
      </div>

      <header className="mb-8">
        {blog.category && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Link
              href={`/blog/category/${blog.category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors duration-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:hover:bg-cyan-800/30"
            >
              <FiTag className="mr-1.5 h-3.5 w-3.5" />
              {blog.category.name}
            </Link>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 dark:text-white">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FiCalendar className="mr-2 h-4 w-4" />
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {blog.author && (
            <div className="flex items-center">
              <Link
                href={`/blog/author/${blog.author.slug}`}
                className="flex items-center hover:text-cyan-600 dark:hover:text-cyan-400"
              >
                <FiUser className="mr-2 h-4 w-4" />
                <span>{blog.author.name || "Anonymous"}</span>
              </Link>
            </div>
          )}

          <ShareButton title={blog.title} text={blog.excerpt} />
        </div>
      </header>
    </>
  );
}
