"use client";

import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import { useTranslations } from "next-intl";

export default function HeaderBar({ withdrawable }: { withdrawable: number }) {
  const t = useTranslations("referral");
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 ">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
        {t("title")}
      </h1>

      <Link
        href="/user/withdraw"
        className="relative inline-flex items-center justify-center py-3 pl-6 pr-14 font-semibold bg-primary text-white rounded-full hover:opacity-90 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
      >
        <span>
          {t("withdrawEarnings", { amount: withdrawable.toFixed(2) })}
        </span>
        <div className="absolute right-2 rounded-full text-primary bg-white p-1.5">
          <MdArrowOutward className="h-5 w-5" />
        </div>
      </Link>
    </div>
  );
}
