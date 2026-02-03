"use client";

import type { GiftCardPreview } from "@/services/redeemService";
import ProductDetailsCard from "./ProductDetailsCard";
import PreviewActions from "./PreviewActions";
import Price from "@/components/ui/Price";
import { useTranslations } from "next-intl";

type Props = {
  code: string;
  previewDetails: GiftCardPreview;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function GiftCardPreviewSection({
  previewDetails,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  const t = useTranslations("redeem");
  return (
    <div className="space-y-6">
      <div className="text-center border-b border-[#DBDBDB] dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-2xl font-semibold text-[#161616] dark:text-[#FFFFFF] mb-2">
          {t("previewTitle")}
        </h2>
        <p className="text-sm text-[#6B7280] dark:text-[#E5E5E5] mb-4">
          {t("aboutToRedeem")}
        </p>

        <div className="inline-flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-bold text-4xl px-8 py-4 rounded-full shadow-inner">
          <Price price={previewDetails.amount} className="tracking-tight" />
        </div>

        <p className="text-xs text-[#6B7280] dark:text-[#E5E5E5] mt-3">
          {t("cardInfo", {
            card: previewDetails.cardNumber,
            expires: new Date(previewDetails.expiryDate).toLocaleDateString(),
          })}
        </p>
      </div>

      {previewDetails.product && (
        <ProductDetailsCard product={previewDetails.product} />
      )}

      <PreviewActions
        loading={loading}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </div>
  );
}
