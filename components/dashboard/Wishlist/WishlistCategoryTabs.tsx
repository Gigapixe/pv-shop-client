"use client";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function WishlistCategoryTabs({
  wishlist,
  activeTab,
  setActiveTab,
  editing,
  setEditing,
  onSaveEdit,
  onDelete,
  disabled,
}: {
  wishlist: Record<string, any[]>;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  editing: { name: string | null; value: string };
  setEditing: (v: { name: string | null; value: string }) => void;

  onSaveEdit: (oldName: string) => void;
  onDelete: (categoryName: string) => void;

  disabled: boolean;
}) {
  const t = useTranslations("wishlist");
  const entries = Object.entries(wishlist || {});
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {entries.map(([category, items]) => {
        const count = Array.isArray(items) ? items.length : 0;

        if (editing.name === category) {
          return (
            <div key={category} className="flex items-center gap-2">
              <input
                type="text"
                value={editing.value}
                onChange={(e) =>
                  setEditing({ ...editing, value: e.target.value })
                }
                className="p-2 border border-primary rounded-lg text-sm bg-transparent dark:text-white"
                autoFocus
                disabled={disabled}
                onKeyDown={(e) => e.key === "Enter" && onSaveEdit(category)}
              />
              <button
                type="button"
                onClick={() => onSaveEdit(category)}
                disabled={disabled}
                className="text-sm px-3 py-2 rounded-lg bg-primary text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                {t("save")}
              </button>
              <button
                type="button"
                onClick={() => setEditing({ name: null, value: "" })}
                disabled={disabled}
                className="text-sm px-3 py-2 rounded-lg bg-gray-200 border hover:dark:bg-gray-700 hover:bg-gray-300 dark:bg-background-dark dark:text-white disabled:opacity-60"
              >
                {t("cancel")}
              </button>
            </div>
          );
        }

        return (
          <div
            key={category}
            onClick={() => setActiveTab(category)}
            className={`group relative flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors ${
              activeTab === category
                ? "bg-primary text-white"
                : "bg-[#FAFAFA] dark:bg-background-dark text-[#6B7280] dark:text-[#E5E5E5] border border-[#DBDBDB] dark:border-border-dark hover:border-primary"
            }`}
          >
            <span>
              {category} ({count})
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing({ name: category, value: category });
                }}
                disabled={disabled}
                className="text-current opacity-60 hover:opacity-100 disabled:opacity-40"
                title={t("editCategory")}
              >
                <FiEdit className="w-4 h-4" />
              </button>

              {category !== "General" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category);
                  }}
                  disabled={disabled}
                  className="text-current opacity-60 hover:opacity-100 disabled:opacity-40"
                  title={t("deleteCategory")}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
