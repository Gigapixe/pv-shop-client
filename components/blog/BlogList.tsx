import BlogCard from "@/components/ui/BlogCard";
import { getAllBlogsSSG } from "@/services/blogService";
import BlogPagination from "./BlogPagination";

type Props = {
  currentPage: number;
};

export default async function BlogList({ currentPage }: Props) {
  const pageSize = 12;

  const data = await getAllBlogsSSG(currentPage, pageSize, {
    next: { revalidate: 60 },
  });

  const blogs = data?.blogs ?? data?.data?.blogs ?? [];
  const total = data?.total ?? data?.data?.total ?? 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {blogs.map((blog: any, index: number) => (
          <BlogCard key={blog._id} blog={blog} index={index} />
        ))}
      </div>

      {total > pageSize && (
        <div className="mt-10">
          <BlogPagination page={currentPage} pageSize={pageSize} total={total} />
        </div>
      )}
    </>
  );
}
