"use client";

import { FiDollarSign } from "react-icons/fi";

type Props = {
  title: string;
  value: string;
  loading?: boolean;
};

export default function BalanceCard({ title, value, loading }: Props) {
  return (
    <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center gap-3">
        <FiDollarSign className="text-3xl text-emerald-500" />
        <div>
          <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
            {title}
          </p>
          <h3 className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">
            {loading ? "$..." : value}
          </h3>
        </div>
      </div>
    </div>
  );
}
