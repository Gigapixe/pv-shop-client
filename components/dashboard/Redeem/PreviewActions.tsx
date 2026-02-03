
"use client";

import { FiLoader } from "react-icons/fi";

type Props = {
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function PreviewActions({ loading, onConfirm, onCancel }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#DBDBDB] dark:border-gray-700">
      <button
        onClick={onConfirm}
        disabled={loading}
        className={`w-full flex items-center justify-center bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 ${
          loading ? "cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin h-5 w-5 mr-3" />
            Redeeming...
          </>
        ) : (
          "Confirm & Redeem Card"
        )}
      </button>

      <button
        onClick={onCancel}
        type="button"
        className="w-full flex items-center justify-center bg-[#F1F5F9] text-[#6B7280] py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-background-dark dark:text-[#E5E5E5] dark:hover:bg-gray-700"
        disabled={loading}
      >
        Cancel & Enter Different Code
      </button>
    </div>
  );
}
