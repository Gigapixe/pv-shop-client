"use client";

import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";

interface CurrencyDisplayProps {
  amount: number; // Price in USD
  className?: string;
  showCurrency?: boolean; // Show currency code (e.g., "EUR")
}

/**
 * Component for displaying prices with automatic currency conversion
 *
 * Usage:
 * <CurrencyDisplay amount={100} />
 * // Renders: $100.00 (if USD selected)
 * // Renders: €93.50 (if EUR selected)
 *
 * <CurrencyDisplay amount={100} showCurrency />
 * // Renders: $100.00 USD
 */
export default function CurrencyDisplay({
  amount,
  className = "",
  showCurrency = false,
}: CurrencyDisplayProps) {
  const { convertedPrice, symbol, currency } = useCurrencyConversion(amount);

  return (
    <span className={className} suppressHydrationWarning>
      {showCurrency && ` ${currency}`} {symbol}
      {convertedPrice}
    </span>
  );
}
