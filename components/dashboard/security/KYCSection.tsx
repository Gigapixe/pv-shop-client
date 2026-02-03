"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { FiCheckCircle, FiCopy } from "react-icons/fi";
import { useKYCVerification } from "./useKYCVerification";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function KYCSection() {
  const t = useTranslations("security");
  const {
    isLoading: isKYCLoading,
    verificationStatus,
    verificationHistory,
    showForm,
    initiateVerification,
  } = useKYCVerification();
  const [isKYCButtonLoading, setIsKYCButtonLoading] = useState(false);
  const onKYCSubmit = async () => {
    setIsKYCButtonLoading(true);
    try {
      await initiateVerification({
        callbackUrl: "https://gamingty.com/user/security",
      });
    } catch (err) {
      toast.error(t("kycVerificationFailed"));
    } finally {
      setIsKYCButtonLoading(false);
    }
  };
  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t("identityVerification")}
        </h2>
        {verificationStatus && <StatusBadge status={verificationStatus} />}
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      {/* Status */}
      {isKYCLoading ? (
        <p className="text-gray-600 dark:text-gray-300">
          {t("loadingKYCStatus")}
        </p>
      ) : (
        <div>
          <p className="mt-2 text-gray-600 dark:text-gray-200">
            {verificationStatus === "approved"
              ? t("kycVerified")
              : t("kycPleaseComplete")}
          </p>

          {showForm && (
            <div className="mt-6">
              <Button onClick={onKYCSubmit} disabled={isKYCButtonLoading}>
                {isKYCButtonLoading ? t("initiating") : t("startVerification")}{" "}
                <FiCheckCircle size={20} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {verificationHistory.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("verificationHistory")}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {t("referenceId")}
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {t("date")}
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {t("status")}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {verificationHistory.map((item) => (
                  <tr key={item.referenceId}>
                    <td className="p-2 md:p-3 text-xs md:text-sm text-gray-800 dark:text-gray-300 font-mono">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Reference ID */}
                        <span className="truncate max-w-[80px] md:max-w-none">
                          {item.referenceId}
                        </span>

                        {/* Copy button (mobile only) */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.referenceId);
                            toast.success("Copied!");
                          }}
                          className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label="Copy reference ID"
                        >
                          <FiCopy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 md:p-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
