"use client";

import { MdOutlineArrowOutward } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import WalletIcon from "@/public/icons/user/WalletIcon";
import { useTranslations } from "next-intl";
import CurrencyDisplay from "@/components/ui/currency/CurrencyDisplay";

type Props = {
  currencySymbol: string;
  balance: number;

  amount: string;
  onAmountChange: (val: string) => void;

  numericAmount: number;
  isLoading: boolean;
  existingTopUpItem: boolean;

  onAddToCart: () => void;
};

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function TopUpSection({
  currencySymbol,
  balance,
  amount,
  onAmountChange,
  numericAmount,
  isLoading,
  existingTopUpItem,
  onAddToCart,
}: Props) {
  const t = useTranslations("wallet");
  const disabled =
    isLoading ||
    numericAmount <= 0 ||
    numericAmount < 10 ||
    numericAmount > 1000 ||
    existingTopUpItem;

  return (
    <div className="bg-[#FFF] dark:bg-background-dark border border-[#DBDBDB] dark:border-[#303030] rounded-lg p-6 ">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <div className="flex items-center">
            <WalletIcon color="#12B47E" className="mr-2" size={30} />
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-[#FFFFFF]">
              {t("title")}
            </h2>
          </div>
          <p className="text-gray-500 dark:text-[#E5E5E5] mt-1">
            {t("subtitle")}
          </p>
        </div>

        <div className="text-center bg-[#FAFAFA] dark:bg-[#161616] border border-[#DBDBDB] dark:border-[#303030] p-4 rounded-xl w-full sm:w-auto ">
          <p className="text-lg text-gray-500 dark:text-[#E5E5E5]">
            {t("totalBalance")}
          </p>
          <p className="text-4xl font-bold text-primary mt-3">
            {/* {currencySymbol} */}
            <CurrencyDisplay amount={balance} />
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-[#FFFFFF] mb-2">
          {t("topUpWallet")}
        </h3>

        <label
          htmlFor="top-up-amount"
          className="block text-sm font-medium text-gray-500 dark:text-[#E5E5E5] mb-2"
        >
          {t("enterAmount")}
        </label>

        <input
          id="top-up-amount"
          type="text"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder={t("amountPlaceholder")}
          className="
    w-full px-4 py-3 text-sm mb-6 rounded-md
    bg-[#FAFAFA] dark:bg-[#161616]
    text-gray-700 dark:text-gray-300
    border border-gray-300 dark:border-[#303030]
    focus:outline-none
    focus:border-primary
    focus:ring-1 focus:ring-primary
  "
        />
      </div>

      <div className="mt-8 border-t border-[#DBDBDB] dark:border-[#303030] pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="bg-emerald-100/60 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-3 rounded-md text-sm w-full md:w-auto">
            {t("amountRange")} <br />
            <span className="font-semibold text-base">{t("rangeValue")}</span>
          </div>

          <div className="w-full md:max-w-xs space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 dark:text-[#E5E5E5]">
                {t("amount")}:
              </p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {formatCurrency(numericAmount)}
              </p>
            </div>

            <button
              onClick={onAddToCart}
              disabled={disabled}
              className="w-full relative flex items-center justify-center py-3 px-5 font-semibold bg-emerald-500 text-white rounded-full hover:bg-emerald-600 focus:outline-none transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <FiLoader className="animate-spin text-white mr-2" />
              ) : existingTopUpItem ? (
                t("alreadyOnCart")
              ) : (
                t("addToCart")
              )}
              <div className="absolute right-3 rounded-full text-emerald-500 bg-white p-1.5">
                <MdOutlineArrowOutward className="h-5 w-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
