
"use client";

import { FiFolderMinus } from "react-icons/fi";

export default function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-4">
        <FiFolderMinus size={60} className="text-primary/40" />
      </div>
      <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}
