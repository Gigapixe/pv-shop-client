/**
 * Currency service for fetching exchange rates from exchangerate-api.com
 * Free API that supports 161+ currencies including AED
 */

export type FxRate = {
  rate: number;
  base: string;
  date: string;
  timestamp: number;
};

/**
 * Fetch the latest exchange rate from exchangerate-api.com
 * Free tier: 1,500 requests/month
 */
export async function fetchExchangeRate(
  targetCurrency: string,
  baseCurrency = "USD"
): Promise<FxRate> {
  // Using exchangerate-api.com free tier (no API key needed for basic usage)
  const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rate: ${response.status}`);
  }

  const data = await response.json();
  const rate = data?.rates?.[targetCurrency];

  if (typeof rate !== "number") {
    throw new Error("Rate not found in response");
  }

  return {
    rate,
    base: data.base,
    date: data.date,
    timestamp: Date.now(),
  };
}

/**
 * Currency metadata with symbols
 * Optimized list based on supported languages (en, ar, ru, es, fr, da, pt, it, zh)
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  RUB: "₽",
  AED: "د.إ",
  SAR: "﷼",
  CNY: "¥",
  DKK: "kr",
  BRL: "R$",
  JPY: "¥",
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  RUB: "Russian Ruble",
  AED: "UAE Dirham",
  SAR: "Saudi Riyal",
  CNY: "Chinese Yuan",
  DKK: "Danish Krone",
  BRL: "Brazilian Real",
  JPY: "Japanese Yen",
};
