"use client";

type PriceProps = {
  price?: number;
  originalPrice?: number;
  card?: boolean;
  className?: string;
};

const formatUSD = (amount?: number) => {
  if (!amount || isNaN(amount)) return "0.00";
  return amount.toFixed(2);
};

export default function Price({
  price = 0,
  originalPrice,
  card,
  className = "",
}: PriceProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex flex-col">
        <span
          className={`${
            card
              ? "text-gray-700 dark:text-white font-semibold text-sm"
              : "font-bold text-2xl text-gray-800 dark:text-white"
          }`}
        >
          USD ${formatUSD(price)}
        </span>

        {typeof originalPrice === "number" && originalPrice > price && (
          <span
            className={`${
              card
                ? "text-gray-400 dark:text-gray-500 text-xs"
                : "text-gray-500 dark:text-gray-400 text-xl"
            } line-through`}
          >
            USD ${formatUSD(originalPrice)}
          </span>
        )}
      </div>
    </div>
  );
}
