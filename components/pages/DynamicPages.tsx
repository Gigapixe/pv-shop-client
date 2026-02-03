import { useTranslations } from "next-intl";

export default function DynamicPages({
  pageDetails,
}: {
  pageDetails: { title: string; content: string };
}) {
  const t = useTranslations("common");

  if (!pageDetails) {
    return (
      <main className="container mx-auto py-6">
        <div className="">
          <h1 className="text-2xl font-bold mb-4 text-primary"></h1>
          <p className="text-gray-500">{t("noContentAvailable")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="">
      <div className="">
        <h1 className="flex justify-center  bg-gray-50 w-full dark:bg-gray-900 py-5 lg:py-10 text-xl md:text-3xl lg:text-4xl font-bold text-center ">
          {pageDetails.title}
        </h1>
        <article
          className="prose prose-lg dark:prose-invert max-w-none container mx-auto py-8"
          dangerouslySetInnerHTML={{
            __html: pageDetails.content,
          }}
        />
      </div>
    </main>
  );
}
