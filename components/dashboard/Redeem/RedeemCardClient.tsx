// src/app/(dashboard)/redeem/RedeemCardClient.tsx
"use client";

import { useContext, useState } from "react";
import { useTranslations } from "next-intl";
import type { GiftCardPreview } from "@/services/redeemService";
import { previewGiftCard, redeemGiftCard } from "@/services/redeemService";
import toast from "react-hot-toast";
import RedeemHeader from "./RedeemHeader";
import RedeemForm from "./RedeemForm";
import RememberBox from "./RememberBox";
import GiftCardPreviewSection from "./GiftCardPreview";
import { useAuthStore } from "@/zustand/authStore";
import { getCustomerBalance } from "@/services/customerService";

export default function RedeemCardClient() {
  const t = useTranslations("redeem");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDetails, setPreviewDetails] = useState<GiftCardPreview | null>(
    null,
  );

  const handlePreviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error(t("enterCodeError"));
      return;
    }

    setPreviewLoading(true);
    setShowPreview(false);
    setPreviewDetails(null);

    try {
      const response = await previewGiftCard({ cardNumber: code.trim() });

      if (response.status === "success") {
        setPreviewDetails(response.data);
        setShowPreview(true);
      } else {
        toast.error(response.message || t("previewError"));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || t("previewError"),
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleRedeemConfirm = async () => {
    if (!code.trim()) {
      toast.error(t("enterCodeError"));
      return;
    }

    setLoading(true);
    try {
      const response = await redeemGiftCard({ cardNumber: code.trim() });

      if (response.status === "success") {
        const newBalance = response.data?.newWalletBalance;
        if (typeof newBalance === "number") {
          useAuthStore.getState().setUserBalance(newBalance);
        } else {
          // fallback: refetch balance from API
          try {
            const balRes = await getCustomerBalance();
            const data = (balRes as any)?.data;
            const b = data?.balance ?? data?.newWalletBalance;
            if (typeof b === "number") {
              useAuthStore.getState().setUserBalance(b);
            }
          } catch (err) {
            // ignore
          }
        }

        toast.success(response.message || t("redeemSuccess"));
        setCode("");
        setShowPreview(false);
        setPreviewDetails(null);
      } else {
        toast.error(response.message || t("redeemError"));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || t("redeemError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setPreviewDetails(null);
    setCode("");
  };

  return (
    <>
      <div className="bg-[#FFF] dark:bg-[#161616] p-6 rounded-xl shadow-sm border border-[#DBDBDB] dark:border-gray-700">
        {!showPreview ? (
          <>
            <RedeemHeader />

            <div className="space-y-8">
              <RedeemForm
                code={code}
                setCode={setCode}
                previewLoading={previewLoading}
                onSubmit={handlePreviewSubmit}
              />

              <RememberBox />
            </div>
          </>
        ) : (
          previewDetails && (
            <GiftCardPreviewSection
              code={code}
              previewDetails={previewDetails}
              loading={loading}
              onConfirm={handleRedeemConfirm}
              onCancel={handleCancelPreview}
            />
          )
        )}
      </div>
    </>
  );
}
