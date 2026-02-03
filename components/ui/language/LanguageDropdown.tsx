"use client";

import { useState, useRef, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import { useLocale } from "next-intl";
import { useChangeLocale } from "@/hooks/useChangeLocale";
import type { Locale } from "@/i18n";

interface LanguageOption {
  value: Locale;
  label: string;
  countryCode?: string; // ISO country code for the flag
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

export default function LanguageDropdown() {
  const currentLocale = useLocale() as Locale;
  const { changeLocale, isPending } = useChangeLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (value: Locale) => {
    if (value !== currentLocale) {
      changeLocale(value);
    }
    setIsOpen(false);
  };

  const selectedOption =
    languageOptions.find((option) => option.value === currentLocale) ||
    languageOptions[0];
  const selectedLabel = selectedOption.label;

  return (
    <div
      className={`relative inline-block text-white hover:text-white/80 py-4 px-4 ${
        isOpen ? "bg-secondary/10 " : ""
      } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      ref={dropdownRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      <button
        type="button"
        className="flex items-center justify-between focus:outline-none min-w-15"
        disabled={isPending}
      >
        <span className="mr-2 inline-flex items-center gap-2">
          {isPending ? (
            "..."
          ) : (
            <>
              {selectedOption.countryCode && (
                <ReactCountryFlag
                  countryCode={selectedOption.countryCode}
                  svg
                  aria-label={selectedOption.label}
                  style={{ width: "1.2rem", height: "1.2rem" }}
                />
              )}
              <span>{selectedLabel}</span>
            </>
          )}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-13 left-0 z-10 w-full mt-1 shadow-lg bg-primary text-text-light">
          {languageOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center px-2 py-1 cursor-pointer hover:bg-secondary/30 ${
                option.value === currentLocale
                  ? "bg-secondary/20 font-semibold"
                  : ""
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.countryCode && (
                <ReactCountryFlag
                  countryCode={option.countryCode}
                  svg
                  aria-label={option.label}
                  style={{ width: "1.2rem", height: "1.2rem" }}
                  className="mr-2"
                />
              )}
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
