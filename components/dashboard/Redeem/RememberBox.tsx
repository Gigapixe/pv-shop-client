import { FiSun } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function RememberBox() {
  const t = useTranslations("redeem");
  return (
    <div className="bg-[#FAFAFA] dark:bg-background-dark border border-[#DBDBDB] dark:border-gray-700 p-6 rounded-xl">
      <p className="font-semibold text-base text-[#161616] dark:text-[#FFFFFF] mb-4">
        {t("rememberTitle")}
      </p>
      <ul className="space-y-3 text-xs lg:text-sm text-[#6B7280] dark:text-[#E5E5E5]">
        <li className="flex items-center gap-3">
          <FiSun className="w-5 h-5 text-yellow-500 shrink-0" />
          <span>{t("singleUse")}</span>
        </li>
        <li className="flex items-center gap-3">
          <FiSun className="w-5 h-5 text-yellow-500 shrink-0" />
          <span>{t("expiredCards")}</span>
        </li>
        <li className="flex items-center gap-3">
          <FiSun className="w-5 h-5 text-yellow-500 shrink-0" />
          <span>{t("addedToWallet")}</span>
        </li>
      </ul>
    </div>
  );
}
