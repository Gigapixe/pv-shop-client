import BlogCard from "../ui/BlogCard";
import { useTranslations } from "next-intl";

export default function RelatedPosts({ posts }: { posts: any[] }) {
  const t = useTranslations("blog");
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
        {t("relatedPosts")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {posts.map((post, index) => (
          <BlogCard key={post._id} blog={post} index={index} />
        ))}
      </div>
    </div>
  );
}
