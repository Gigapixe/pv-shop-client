"use client";

import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useLocale, useTranslations } from "next-intl";
import { useChangeLocale } from "@/hooks/useChangeLocale";
import type { Locale } from "@/i18n";
import Modal from "@/components/ui/Modal";

interface LanguageOption {
  value: Locale;
  label: string;
  countryCode?: string;
}

const languageOptions: LanguageOption[] = [
  { value: "en", label: "English", countryCode: "US" },
  { value: "ar", label: "العربية", countryCode: "SA" },
  { value: "ru", label: "Русский", countryCode: "RU" },
  { value: "es", label: "Español", countryCode: "ES" },
  { value: "fr", label: "Français", countryCode: "FR" },
  { value: "da", label: "Dansk", countryCode: "DK" },
  { value: "pt", label: "Português", countryCode: "PT" },
  { value: "it", label: "Italiano", countryCode: "IT" },
  { value: "zh", label: "中文", countryCode: "CN" },
];

interface LanguageSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelection({
  isOpen,
  onClose,
}: LanguageSelectionProps) {
  const t = useTranslations("common");
  const currentLocale = useLocale() as Locale;
  const { changeLocale, isPending } = useChangeLocale();

  const handleLanguageChange = (value: Locale) => {
    if (value !== currentLocale) {
      changeLocale(value);
    }
    onClose();
  };

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

        {/* Language List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Select Language
          </h3>
          {languageOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
              disabled={isPending}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                option.value === currentLocale
                  ? "bg-primary text-white font-semibold"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {option.countryCode && (
                <ReactCountryFlag
                  countryCode={option.countryCode}
                  svg
                  aria-label={option.label}
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              )}
              <span className="flex-1 text-left">{option.label}</span>
              {option.value === currentLocale && (
                <span className="text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
