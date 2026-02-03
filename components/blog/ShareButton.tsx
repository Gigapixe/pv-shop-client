"use client";

import { FiShare2 } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function ShareButton({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  const t = useTranslations("blog");
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } else {
        alert(t("sharingNotSupported"));
      }
    } catch {}
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center hover:text-cyan-600 transition-colors duration-200 dark:hover:text-cyan-400"
    >
      <FiShare2 className="mr-2 h-4 w-4" />
      {t("share")}
    </button>
  );
}
