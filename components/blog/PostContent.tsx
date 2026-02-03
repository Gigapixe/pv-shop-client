export default function PostContent({ html }: { html: string }) {
  return (
    <article
      className="lg:col-span-8 prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-gray-800
        prose-p:text-gray-700 prose-a:text-cyan-600 hover:prose-a:text-cyan-700
        prose-img:rounded-xl
        dark:prose-headings:text-white dark:prose-p:text-gray-300
        dark:prose-a:text-cyan-400 dark:hover:prose-a:text-cyan-300"
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
