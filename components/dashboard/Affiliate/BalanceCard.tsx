
"use client";

export default function BalanceCard({
  title,
  value,
  loading,
  className,
  titleClassName,
  valueClassName,
}: {
  title: string;
  value: string;
  loading: boolean;
  className: string;
  titleClassName: string;
  valueClassName: string;
}) {
  return (
    <div className={`p-6 rounded-xl ${className}`}>
      <p className={`text-lg font-semibold ${titleClassName}`}>{title}</p>
      <h3 className={`text-5xl font-bold mt-2 ${valueClassName}`}>
        {loading ? "$..." : value}
      </h3>
    </div>
  );
}
