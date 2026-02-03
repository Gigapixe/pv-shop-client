import React from "react";

type StatusBadgeProps = {
  status?: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = "" }) => {
  const normalized = status.toLowerCase();

  const statusClasses: Record<string, string> = {
    pending:
      "bg-primary/10 text-primary border border-primary/30 dark:bg-background-dark dark:text-primary",
    processing:
      "bg-primary/10 text-primary border border-primary/30 dark:bg-background-dark dark:text-primary",
    delivered:
      "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:bg-background-dark dark:text-emerald-400",
    cancel:
      "bg-red-500/10 text-red-600 border border-red-500/30 dark:bg-background-dark dark:text-red-400",
    cancelled:
      "bg-red-500/10 text-red-600 border border-red-500/30 dark:bg-background-dark dark:text-red-400",
    failed:
      "bg-red-500/10 text-red-600 border border-red-500/30 dark:bg-background-dark dark:text-red-400",
    refunded:
      "bg-purple-500/10 text-purple-600 border border-purple-500/30 dark:bg-background-dark dark:text-purple-400",
    "on hold":
      "bg-gray-500/10 text-gray-700 border border-gray-400/30 dark:bg-background-dark dark:text-gray-300",
  };

  const className =
    statusClasses[normalized] ||
    "bg-gray-100 text-gray-700 border border-gray-300 dark:bg-background-dark dark:text-gray-300";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
