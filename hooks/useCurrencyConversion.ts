"use client";

import { useEffect, useState } from "react";
import {
  fetchExchangeRate,
  CURRENCY_SYMBOLS,
  type FxRate,
} from "@/services/currencyService";

// In-memory cache for exchange rates
const rateCache = new Map<string, FxRate>();

// Cache duration: 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Get selected currency from localStorage
 */
function getSelectedCurrency(): string {
  if (typeof window === "undefined") return "USD";

  try {
    return localStorage.getItem("selected_currency") || "USD";
  } catch {
    return "USD";
  }
}

/**
 * Hook for automatic currency conversion
 * Similar to useDynamicTranslation but for prices
 *
 * Usage:
 * const { convertedPrice, symbol, currency } = useCurrencyConversion(100);
 * // Returns: { convertedPrice: "93.50", symbol: "€", currency: "EUR" }
 */
export function useCurrencyConversion(priceInUSD: number) {
  const [mounted, setMounted] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [convertedPrice, setConvertedPrice] = useState(priceInUSD);
  const [isLoading, setIsLoading] = useState(false);

  // Fix hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currency = getSelectedCurrency();
    setSelectedCurrency(currency);

    // If USD, no conversion needed
    if (currency === "USD") {
      setConvertedPrice(priceInUSD);
      return;
    }

    // Check cache first
    const cacheKey = `${currency}_USD`;
    const cached = rateCache.get(cacheKey);

    // Use cached rate if valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const converted = priceInUSD * cached.rate;
      setConvertedPrice(converted);
      return;
    }

    // Fetch new rate
    setIsLoading(true);
    fetchExchangeRate(currency, "USD")
      .then((fxRate) => {
        // Cache it
        rateCache.set(cacheKey, fxRate);

        // Also store in localStorage for persistence
        try {
          localStorage.setItem(`fx_rate_${currency}`, JSON.stringify(fxRate));
        } catch (e) {
          // Ignore storage errors
        }

        const converted = priceInUSD * fxRate.rate;
        setConvertedPrice(converted);
      })
      .catch((error) => {
        console.warn("Currency conversion failed:", error);
        // Fallback to original price
        setConvertedPrice(priceInUSD);
      })
      .finally(() => setIsLoading(false));
  }, [priceInUSD, selectedCurrency, mounted]);

  // Listen for currency changes
  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = () => {
      const newCurrency = getSelectedCurrency();
      if (newCurrency !== selectedCurrency) {
        setSelectedCurrency(newCurrency);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedCurrency, mounted]);

  const symbol = CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency;

  return {
    convertedPrice: convertedPrice.toFixed(2),
    symbol,
    currency: selectedCurrency,
    isLoading,
  };
}
