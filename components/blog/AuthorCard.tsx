import Image from "next/image";
import Link from "next/link";
import ShareButton from "./ShareButton";
import { useTranslations } from "next-intl";

export default function AuthorCard({ blog }: { blog: any }) {
  const t = useTranslations("blog");
  const author = blog.author;

  return (
    <div className="lg:col-span-8 mt-8 bg-gray-50 rounded-xl flex flex-col lg:flex-row items-center p-6 dark:bg-gray-800 dark:shadow-md">
      <Link
        href={`/blog/author/${author.slug}`}
        className="flex items-center text-gray-700 hover:text-cyan-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-cyan-400"
      >
        <div className="relative w-32 h-32 rounded-full overflow-hidden mr-6 shrink-0">
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name}
              width={1800}
              height={1800}
              className="object-contain"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold dark:bg-gray-700 dark:text-gray-400">
              {author.name?.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm lg:text-lg font-bold mb-2 text-gray-800 dark:text-white">
            {t("writtenBy")}
          </h3>
          <span className="font-medium text-xl hover:underline">
            {author.name || t("anonymous")}
          </span>
        </div>
      </Link>

      <div className="ml-auto dark:text-gray-400">
        <ShareButton title={blog.title} text={blog.excerpt} />
      </div>
    </div>
  );
}
