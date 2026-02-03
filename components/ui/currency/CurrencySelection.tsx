"use client";

import { CURRENCY_SYMBOLS } from "@/services/currencyService";
import { useState, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import Modal from "@/components/ui/Modal";
import { useTranslations } from "next-intl";

interface CurrencyOption {
  value: string;
  label: string;
  countryCode?: string;
}

const currencyOptions: CurrencyOption[] = [
  { value: "USD", label: "USD", countryCode: "US" },
  { value: "EUR", label: "EUR", countryCode: "EU" },
  { value: "GBP", label: "GBP", countryCode: "GB" },
  { value: "RUB", label: "RUB", countryCode: "RU" },
  { value: "AED", label: "AED", countryCode: "AE" },
  { value: "SAR", label: "SAR", countryCode: "SA" },
  { value: "CNY", label: "CNY", countryCode: "CN" },
  { value: "DKK", label: "DKK", countryCode: "DK" },
  { value: "BRL", label: "BRL", countryCode: "BR" },
  { value: "JPY", label: "JPY", countryCode: "JP" },
];

interface CurrencySelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CurrencySelection({
  isOpen,
  onClose,
}: CurrencySelectionProps) {
  const t = useTranslations("common");
  const [selectedValue, setSelectedValue] = useState<string>("USD");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("selected_currency");
      if (saved && currencyOptions.some((c) => c.value === saved)) {
        setSelectedValue(saved);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const handleCurrencyChange = (value: string) => {
    setSelectedValue(value);
    try {
      localStorage.setItem("selected_currency", value);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      // ignore storage errors
    }
    onClose();
  };

  if (!mounted) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("languageAndCurrency")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Currency List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Select Currency
          </h3>
          {currencyOptions.map((option) => {
            const symbol = CURRENCY_SYMBOLS[option.value] || "";
            return (
              <button
                key={option.value}
                onClick={() => handleCurrencyChange(option.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  option.value === selectedValue
                    ? "bg-primary text-white font-semibold"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
              >
                {option.countryCode && (
                  <ReactCountryFlag
                    countryCode={option.countryCode}
                    svg
                    aria-label={option.label}
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  />
                )}
                <span className="flex-1 text-left flex items-center gap-2">
                  {symbol && (
                    <span className="font-semibold min-w-6">{symbol}</span>
                  )}
                  <span>{option.label}</span>
                </span>
                {option.value === selectedValue && (
                  <span className="text-lg">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
