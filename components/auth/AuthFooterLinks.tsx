import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AuthFooterLinks() {
  const t = useTranslations("auth");

  return (
    <div className="absolute bottom-4 sm:bottom-12 w-full left-0 lg:left-16">
      <div className="flex flex-col items-center lg:items-start">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6 lg:justify-start">
          <Link
            href="/privacy-policy"
            className="text-sm text-gray-300 hover:text-emerald-500"
          >
            {t("privacyPolicy")}
          </Link>
          <Link
            href="/terms-and-conditions"
            className="text-sm text-gray-300 hover:text-emerald-500"
          >
            {t("termsAndConditions")}
          </Link>
          <Link
            href="/contact-us"
            className="text-sm text-gray-300 hover:text-emerald-500"
          >
            {t("contactUs")}
          </Link>
        </div>

        <p className="text-base text-gray-400 max-w-lg leading-relaxed text-center lg:text-left">
          {t("trademarkNotice")}
        </p>
      </div>
    </div>
  );
}
