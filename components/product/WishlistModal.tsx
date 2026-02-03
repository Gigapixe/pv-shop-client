"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";

type Props = {
  open: boolean;
  onClose: () => void;

  wishlist: Record<string, any[]>;
  selectedCategory: string | null;
  setSelectedCategory: (v: string) => void;

  showNewCategoryInput: boolean;
  setShowNewCategoryInput: (v: (prev: boolean) => boolean) => void;

  newCategory: string;
  setNewCategory: (v: string) => void;

  handleAddToWishlist: () => void;
};

export default function WishlistModal({
  open,
  onClose,
  wishlist,
  selectedCategory,
  setSelectedCategory,
  showNewCategoryInput,
  setShowNewCategoryInput,
  newCategory,
  setNewCategory,
  handleAddToWishlist,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-999999 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add to Wishlist"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 z-1 cursor-default"
      />

      {/* Panel */}
      <div className="relative z-2 w-full max-w-md rounded-xl bg-background p-6 shadow-2xl dark:bg-background-dark dark:backdrop-blur-lg dark:border dark:border-white/10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold text-content-default dark:text-white">
            Add to Wishlist
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Categories */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-1">
            {Object.keys(wishlist || {}).length > 0 ? (
              <div className="space-y-2">
                {Object.keys(wishlist || {}).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                      selectedCategory === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-default dark:border-border-muted hover:border-primary/60 hover:bg-background-subtle dark:hover:bg-background-subtle dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cat}</span>
                      <span className="text-sm text-content-subtle dark:text-gray-400">
                        ({(wishlist?.[cat] || []).length} items)
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-content-subtle dark:text-gray-400">
                No categories yet — create one below.
              </div>
            )}
          </div>

          {/* Create Category Button */}
          <button
            type="button"
            onClick={() => setShowNewCategoryInput((v) => !v)}
            className="w-full flex items-center gap-2 p-3 text-primary border border-primary rounded-lg hover:bg-primary/10 transition-all duration-200"
          >
            <IoAdd className="w-5 h-5" />
            <span>Create New Category</span>
          </button>

          {/* New category input */}
          <div
            className={`overflow-hidden transition-all duration-200 ${
              showNewCategoryInput ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-1 mx-0.75">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                className="w-full p-3 border border-default dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 bg-background dark:bg-background-dark dark:text-white"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition-all duration-200 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAddToWishlist}
              disabled={!selectedCategory && !newCategory.trim()}
              className="px-6 py-2 rounded-lg transition-all duration-200 bg-primary text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
