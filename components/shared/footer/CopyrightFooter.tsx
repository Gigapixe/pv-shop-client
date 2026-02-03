"use client";

import { useTranslations } from "next-intl";

export default function CopyrightFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <div className="dark:bg-background-dark bg-background-light">
      <div className="container mx-auto  py-4 space-y-2 text-xs flex md:flex-row flex-col-reverse text-center md:text-left md:justify-between md:items-center gap-2">
        <p className="lg:max-w-2xl max-w-lg">{t("footer.copyright.notice")}</p>
        <p>{t("footer.copyright.rights", { year })}</p>
      </div>
    </div>
  );
}
