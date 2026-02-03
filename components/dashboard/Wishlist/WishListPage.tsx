"use client";

import { useEffect, useMemo, useState } from "react";
import { useWishlist } from "@/app/context/WishlistContext";
import Loading from "@/components/blog/Loading";

import { useTranslations } from "next-intl";
import WishlistHeaderSection from "./WishlistHeaderSection";
import WishlistAddCategoryForm from "./WishlistAddCategoryForm";
import WishlistCategoryTabs from "./WishlistCategoryTabs";
import WishlistEmptyState from "./WishlistEmptyState";
import WishlistItemsGrid from "./WishlistItemsGrid";
import WishlistMoveProductModal from "./WishlistMoveProductModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const t = useTranslations("wishlist");
  const {
    wishlist,
    removeFromWishlist,
    moveProduct,
    addCategory,
    editCategory,
    deleteCategory,
    isLoading: isWishlistLoading,
    error,
    setError,
  } = useWishlist();

  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{
    name: string | null;
    value: string;
  }>({ name: null, value: "" });

  const [activeTab, setActiveTab] = useState<string>("");
  const [moveProductId, setMoveProductId] = useState<string | null>(null);
  const [targetCategory, setTargetCategory] = useState<string>("");
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  // delete-category confirmation state
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const [initialDataProcessed, setInitialDataProcessed] = useState(false);

  // Initial loading gate
  useEffect(() => {
    if (!isWishlistLoading && !initialDataProcessed) {
      setInitialDataProcessed(true);
    }
  }, [isWishlistLoading, initialDataProcessed]);

  // Keep active tab valid
  useEffect(() => {
    if (!initialDataProcessed) return;

    const currentCategories = Object.keys(wishlist || {});
    if (currentCategories.length > 0) {
      if (!activeTab || !(wishlist && wishlist[activeTab])) {
        setActiveTab(currentCategories[0]);
      }
    } else {
      setActiveTab("");
    }
  }, [wishlist, activeTab, initialDataProcessed]);

  // Handle errors
  useEffect(() => {
    if (error) {
      alert(`${t("operationError")}: ${error}`);
      setError(null);
    }
  }, [error, setError, t]);

  const currentCategoryItems = useMemo(() => {
    if (!wishlist || !activeTab) return [];
    const list = wishlist[activeTab];
    return Array.isArray(list) ? list : [];
  }, [wishlist, activeTab]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (trimmed in (wishlist || {})) return;

    const success = await addCategory(trimmed);
    if (success) {
      setNewCategory("");
      setActiveTab(trimmed);
    }
  };

  const handleEditCategory = async (oldName: string) => {
    const trimmed = editingCategory.value.trim();

    if (trimmed && trimmed !== oldName && !(trimmed in (wishlist || {}))) {
      const success = await editCategory(oldName, trimmed);
      if (success) {
        setEditingCategory({ name: null, value: "" });
        if (activeTab === oldName) setActiveTab(trimmed);
        return;
      }
    }

    setEditingCategory({ name: null, value: "" });
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    // open confirmation modal instead of native confirm
    setCategoryToDelete(categoryToDelete);
  };

  const handleConfirmDeleteCategory = async () => {
    const category = categoryToDelete;
    if (!category) return;

    setIsDeletingCategory(true);
    try {
      const success = await deleteCategory(category);
      if (success) {
        // choose next available tab (if any) after deletion
        const remaining = Object.keys(wishlist || {}).filter(
          (c) => c !== category,
        );
        setActiveTab(remaining.length > 0 ? remaining[0] : "");
        toast.success(
          t("deleteSuccess", { category }) || `${category} deleted`,
        );
      } else {
        toast.error(t("deleteFailed") || "Failed to delete category");
      }
    } catch (err: any) {
      console.error("delete category failed", err);
      toast.error(
        err?.message || t("deleteFailed") || "Failed to delete category",
      );
    } finally {
      setIsDeletingCategory(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDeleteCategory = () => {
    setCategoryToDelete(null);
  };

  const openMoveModal = (productId: string) => {
    setMoveProductId(productId);
    setIsMoveModalOpen(true);
  };

  const closeMoveModal = () => {
    setIsMoveModalOpen(false);
    setMoveProductId(null);
    setTargetCategory("");
  };

  const handleMoveProduct = async () => {
    if (!targetCategory || !moveProductId) return;

    const sourceCategory = Object.keys(wishlist || {}).find((cat) =>
      (wishlist[cat] || []).some((item: any) => item._id === moveProductId),
    );

    if (sourceCategory) {
      await moveProduct(moveProductId, sourceCategory, targetCategory);
    }

    closeMoveModal();
  };

  if (!initialDataProcessed) {
    return (
      <div className="bg-white dark:bg-[#161616]">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#FFF] dark:bg-background-dark p-6 mt-10 rounded-xl shadow-sm border border-[#DBDBDB] dark:border-border-dark">
        <WishlistHeaderSection />

        <WishlistAddCategoryForm
          value={newCategory}
          onChange={setNewCategory}
          onSubmit={handleAddCategory}
          disabled={isWishlistLoading}
        />

        <hr className="my-8 border-[#DBDBDB] dark:border-border-dark" />

        <WishlistCategoryTabs
          wishlist={wishlist || {}}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          editing={editingCategory}
          setEditing={setEditingCategory}
          onSaveEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          disabled={isWishlistLoading}
        />

        {isWishlistLoading ? (
          <Loading />
        ) : currentCategoryItems.length === 0 ? (
          <WishlistEmptyState />
        ) : (
          <WishlistItemsGrid
            items={currentCategoryItems}
            onOpenMove={openMoveModal}
            onRemove={(id) => removeFromWishlist(id, activeTab)}
            currency="$"
            formatPrice={(n) => n.toFixed(2)}
            formatTitle={(title) =>
              typeof title === "string"
                ? title
                : (title?.en ?? Object.values(title || {}).find(Boolean) ?? "")
            }
          />
        )}
      </div>

      <WishlistMoveProductModal
        open={isMoveModalOpen}
        onClose={closeMoveModal}
        wishlist={wishlist || {}}
        activeTab={activeTab}
        targetCategory={targetCategory}
        setTargetCategory={setTargetCategory}
        onConfirm={handleMoveProduct}
        isLoading={isWishlistLoading}
      />

      <ConfirmModal
        open={Boolean(categoryToDelete)}
        title={
          categoryToDelete ? `Delete "${categoryToDelete}"?` : "Delete category"
        }
        description={
          categoryToDelete
            ? `This will remove all products from the "${categoryToDelete}" category. This action cannot be undone.`
            : undefined
        }
        onConfirm={handleConfirmDeleteCategory}
        onCancel={handleCancelDeleteCategory}
        isLoading={isDeletingCategory}
        confirmText="Delete"
      />
    </>
  );
}
