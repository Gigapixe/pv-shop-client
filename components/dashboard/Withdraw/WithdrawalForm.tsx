"use client";

import { Radio } from "@/components/ui/Radio";
import {
  ExternalPayoutType,
  WithdrawalFormState,
  WithdrawalMethod,
} from "@/types/withdraw";
import { FiLoader, FiSend } from "react-icons/fi";
import { useTranslations } from "next-intl";

const MIN_WALLET_WITHDRAWAL = 10;
const MIN_EXTERNAL_WITHDRAWAL = 20;

type Props = {
  withdrawableBalance: number;
  loadingStats: boolean;
  isSubmitting: boolean;
  form: WithdrawalFormState;
  externalPayoutType: ExternalPayoutType;
  setForm: React.Dispatch<React.SetStateAction<WithdrawalFormState>>;
  setExternalPayoutType: React.Dispatch<
    React.SetStateAction<ExternalPayoutType>
  >;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function WithdrawalForm({
  withdrawableBalance,
  loadingStats,
  isSubmitting,
  form,
  externalPayoutType,
  setForm,
  setExternalPayoutType,
  onSubmit,
}: Props) {
  const t = useTranslations("withdraw");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name in form.walletDetails) {
      setForm((prev) => ({
        ...prev,
        walletDetails: { ...prev.walletDetails, [name]: value },
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }) as WithdrawalFormState);
  };

  const handleExternalTypeChange = (type: ExternalPayoutType) => {
    setExternalPayoutType(type);

    if (type === "paypal") {
      setForm((prev) => ({
        ...prev,
        walletDetails: { ...prev.walletDetails, cryptoAddress: "" },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        walletDetails: { ...prev.walletDetails, paypalEmail: "" },
      }));
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
        <FiSend className="text-emerald-500" />
        {t("requestWithdrawal")}
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
          >
            {t("amountLabel")}
          </label>

          <input
            type="number"
            name="amount"
            id="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full px-5 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-emerald-500"
            placeholder={t("amountPlaceholder")}
            min="0.01"
            step="0.01"
            required
          />

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 pl-2">
            {t("availableAmount", { amount: withdrawableBalance.toFixed(2) })}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            {t("withdrawalMethod")}
          </label>

          <div className="mt-2 space-y-2 md:space-y-0 md:flex md:space-x-4">
            <Radio
              id="walletMethod"
              name="method"
              value="wallet"
              checked={form.method === "wallet"}
              onChange={handleChange}
              label={t("walletMethod", { amount: MIN_WALLET_WITHDRAWAL })}
            />
            <Radio
              id="externalMethod"
              name="method"
              value="external"
              checked={form.method === "external"}
              onChange={handleChange}
              label={t("externalMethod", { amount: MIN_EXTERNAL_WITHDRAWAL })}
            />
          </div>
        </div>

        {form.method === "external" && (
          <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50 mt-4 dark:border-gray-700 dark:bg-gray-900/50">
            <h3 className="text-md font-semibold text-gray-700 dark:text-white">
              {t("externalPayoutDetails")}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                {t("choosePayoutMethod")}
              </label>

              <div className="mt-2 flex space-x-4">
                <Radio
                  id="payoutPaypal"
                  name="externalPayoutType"
                  value="paypal"
                  checked={externalPayoutType === "paypal"}
                  onChange={() => handleExternalTypeChange("paypal")}
                  label={t("paypal")}
                />
                <Radio
                  id="payoutCrypto"
                  name="externalPayoutType"
                  value="crypto"
                  checked={externalPayoutType === "crypto"}
                  onChange={() => handleExternalTypeChange("crypto")}
                  label={t("cryptoTRC20")}
                />
              </div>
            </div>

            {externalPayoutType === "paypal" && (
              <div>
                <label
                  htmlFor="paypalEmail"
                  className="block text-sm font-medium text-gray-600 mb-2 dark:text-gray-300"
                >
                  {t("paypalEmailLabel")}
                </label>

                <input
                  type="email"
                  name="paypalEmail"
                  id="paypalEmail"
                  value={form.walletDetails.paypalEmail}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                  placeholder={t("paypalEmailPlaceholder")}
                  required
                />
              </div>
            )}

            {externalPayoutType === "crypto" && (
              <div>
                <label
                  htmlFor="cryptoAddress"
                  className="block text-sm font-medium text-gray-600 mb-2 dark:text-gray-300"
                >
                  {t("cryptoAddressLabel")}
                </label>

                <input
                  type="text"
                  name="cryptoAddress"
                  id="cryptoAddress"
                  value={form.walletDetails.cryptoAddress}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                  placeholder={t("cryptoAddressPlaceholder")}
                  required
                />

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 pl-2">
                  {t("cryptoAddressHint")}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || loadingStats}
            className="w-full md:w-auto relative inline-flex items-center justify-center py-3 pl-6 pr-14 font-semibold bg-emerald-500 text-white rounded-full hover:bg-emerald-600 focus:outline-none transition-all duration-300 ease-in-out shadow-md disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin h-5 w-5 mr-3" />
                {t("processing")}
              </>
            ) : (
              <span>{t("requestWithdrawal")}</span>
            )}

            {!isSubmitting && (
              <div className="absolute right-2 rounded-full text-emerald-500 bg-white p-1.5">
                <FiSend className="h-5 w-5" />
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
