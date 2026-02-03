import Link from "next/link";
import { useTranslations } from "next-intl";

export default function TermsText() {
  const t = useTranslations("auth");

  return (
    <p className="text-xs text-center text-gray-500 dark:text-gray-400 my-5">
      {t("byClickingSignUp")}{" "}
      <Link
        href="/terms-and-conditions"
        className="text-emerald-600 hover:underline"
      >
        {t("termsAndConditions")}
      </Link>{" "}
      {t("and")}{" "}
      <Link href="/privacy-policy" className="text-emerald-600 hover:underline">
        {t("privacyPolicy")}
      </Link>
      .
    </p>
  );
}
