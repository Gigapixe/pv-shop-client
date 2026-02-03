"use client";

import { CURRENCY_SYMBOLS } from "@/services/currencyService";
import { useState, useRef, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";

interface CurrencyOption {
  value: string;
  label: string;
  countryCode?: string; // ISO country code used for flag
}

// Optimized currency list based on supported languages (en, ar, ru, es, fr, da, pt, it, zh)
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

export default function CurrencyDropdown() {
  const [mounted, setMounted] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("USD");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fix hydration error by only reading localStorage after mount
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

  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
    try {
      localStorage.setItem("selected_currency", value);
      // Trigger storage event for other components to react
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      // ignore storage errors
    }
    setIsOpen(false);
  };

  const selectedOption =
    currencyOptions.find((option) => option.value === selectedValue) ||
    currencyOptions[0];
  const selectedLabel = selectedOption.label;
  // Try to show a small currency symbol so the user can see the active currency at a glance
  const selectedSymbol = CURRENCY_SYMBOLS[selectedValue] || "";

  return (
    <div
      className={`relative inline-block text-white hover:text-white/80 py-4 px-4 ${
        isOpen ? "bg-secondary/10 " : ""
      }`}
      ref={dropdownRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      <button
        type="button"
        className="flex items-center justify-between focus:outline-none min-w-15 "
      >
        <span className="mr-2 inline-flex items-center gap-2">
          {selectedOption.countryCode && (
            <ReactCountryFlag
              countryCode={selectedOption.countryCode}
              svg
              aria-label={selectedOption.label}
              style={{ width: "1.2rem", height: "1.2rem" }}
              className="mr-1"
            />
          )}
          {/* show symbol + label (symbol might be empty for unknown codes) */}
          <span className="flex items-center gap-1">
            {selectedSymbol ? (
              <span className="font-semibold">{selectedSymbol}</span>
            ) : null}
            <span>{selectedLabel}</span>
          </span>
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
        <div className="absolute top-13 left-0 z-10 w-34 mt-1 shadow-lg bg-primary text-text-light">
          {currencyOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center px-2 py-1 cursor-pointer hover:bg-secondary/30 ${
                option.value === selectedValue
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
              <span className="flex items-center gap-2">
                <span className="min-w-7 text-sm">
                  {CURRENCY_SYMBOLS[option.value] ?? ""}
                </span>
                <span>{option.label}</span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
