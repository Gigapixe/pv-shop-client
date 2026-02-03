import {
  getBlogBySlugSSG,
  getRelatedBlogsSSG,
  incrementBlogViews,
} from "@/services/blogService";
import { getAllBlogCategoriesSSG } from "@/services/categoryService";
import Breadcrumbs from "./Breadcrumbs";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import Sidebar from "./Sidebar";
import AuthorCard from "./AuthorCard";
import RelatedPosts from "./RelatedPosts";

type Props = { slug: string };

export default async function BlogPostView({ slug }: Props) {
  // 1) Blog
  const blogRes = await getBlogBySlugSSG(slug, { next: { revalidate: 60 } });
  const blog = blogRes?.blog ?? blogRes?.data?.blog;

  try {
    await incrementBlogViews(blog._id);
  } catch {}

  // 3) Categories
  const catRes: any = await getAllBlogCategoriesSSG({
    next: { revalidate: 300 },
  });
  const categories =
    catRes?.categories ?? catRes?.data?.categories ?? catRes?.data ?? [];

  // 4) Related
  const relRes = blog?._id
    ? await getRelatedBlogsSSG(blog._id, 4, { next: { revalidate: 60 } })
    : null;
  const relatedPosts = relRes?.blogs ?? relRes?.data?.blogs ?? [];

  return (
    <>
      <div className="min-h-screen container pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Breadcrumbs blog={blog} />
          </div>

          <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 dark:bg-gray-800 dark:shadow-xl">
            <PostHeader blog={blog} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <PostContent html={blog.content} />
              <Sidebar categories={categories} blog={blog} />
            </div>
          </main>

          {blog.author && <AuthorCard blog={blog} />}

          {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
        </div>
      </div>
    </>
  );
}
