import RedeemGiftCardIcon from "@/public/icons/user/RedeemGiftCardIcon";
import { useTranslations } from "next-intl";

export default function RedeemHeader() {
  const t = useTranslations("redeem");
  return (
    <div className="flex items-center gap-3 mb-6">
      <RedeemGiftCardIcon className="h-7 w-7 text-primary" />
      <h1 className="text-xl lg:text-2xl font-semibold text-[#161616] dark:text-[#FFFFFF]">
        {t("title")}
      </h1>
    </div>
  );
}
