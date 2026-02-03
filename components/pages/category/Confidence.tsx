import dssWhite from "../../../public/assets/dss-white.png";
import dssBlack from "../../../public/assets/dss-black.png";
import pci from "../../../public/assets/pci.png";
import secureBlack from "../../../public/assets/secure-black.png";
import secureWhite from "../../../public/assets/secure-white.png";

import CheckIcon from "@/public/icons/CheckIcon";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Confidence = () => {
  const t = useTranslations("product");
  return (
    <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-border-light dark:border-border-dark ">
        <h1 className="lg:text-lg font-bold mt-4 leading-8">
          {t("haveAnyQuestion")}
        </h1>
        <div className="flex items-center gap-2 my-4">
          <CheckIcon fill="#0DB561" />
          <h1 className=" font-bold">{t("buyerConfidence")}</h1>
        </div>
        <Button href="/contact-us" className="w-full">
          {t("contactSupport")}
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-border-light dark:border-border-dark  ">
        <h1 className="lg:text-lg font-bold mt-4 leading-8">
          {t("safeCheckoutGuaranteed")}
        </h1>
        <div className="flex flex-wrap gap-2 items-center xl:mt-4">
          <Image
            alt="image"
            src={pci}
            width={600}
            height={600}
            className="w-16 h-12.25"
          />
          <Image
            src={dssWhite}
            width={600}
            height={600}
            className="w-16 h-12.25 hidden dark:block"
            alt="image"
          />
          <Image
            src={dssBlack}
            width={600}
            height={600}
            className="w-16 h-12.25 dark:hidden"
            alt="image"
          />

          <Image
            src={secureBlack}
            width={600}
            height={600}
            className="w-24 h-12.25 hidden dark:block"
            alt="image"
          />
          <Image
            src={secureWhite}
            width={600}
            height={600}
            className="w-24 h-12.25 dark:hidden"
            alt="image"
          />
        </div>
      </div>
    </div>
  );
};

export default Confidence;
