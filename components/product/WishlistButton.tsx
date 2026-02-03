"use client";

import { useState, useEffect } from "react";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { useWishlist } from "@/app/context/WishlistContext";
import WishlistModal from "./WishlistModal";

type Product = {
  title?: string | { en?: string; zh?: string };
  prices?: { price: number; originalPrice?: number; discount?: number };
  DigitalPrice?: { price: number };
  image?: string | string[];
  isStock?: boolean;
  stock?: number;
  slug: string;
  _id?: string;
  id?: string;
  isGiftCard?: boolean;
  type?: string;
};

interface WishlistButtonProps {
  product: Product;
  className?: string;
  iconSize?: string;
  showLabel?: boolean;
}

export default function WishlistButton({
  product,
  className = "",
  iconSize = "text-2xl",
  showLabel = false,
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } =
    useWishlist();

  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "General",
  );
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const imageSrc = Array.isArray(product.image)
    ? product.image[0]
    : product.image || "/images/placeholder.png";

  const titleText =
    typeof product.title === "string"
      ? product.title
      : (product.title?.en ?? product.title?.zh ?? "");

  const productId = product._id ?? product.id ?? product.slug;
  const productInWishlist = isInWishlist(productId);

  const resetWishlistModalState = () => {
    setSelectedCategory(null);
    setNewCategory("");
    setShowNewCategoryInput(false);
  };

  const closeWishlistModal = () => {
    setIsWishlistModalOpen(false);
    resetWishlistModalState();
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (productInWishlist) {
      const category = Object.keys(wishlist || {}).find((cat) =>
        (wishlist?.[cat] || []).some(
          (item: any) => (item?._id ?? item?.id ?? item?.slug) === productId,
        ),
      );

      if (!category) {
        toast.error("Unable to find wishlist category");
        return;
      }

      removeFromWishlist(productId, category);
      toast.success("Removed from wishlist");
      return;
    }

    if (
      Object.keys(wishlist || {}).length > 1 ||
      Object.keys(wishlist || {}).length === 0
    ) {
      setIsWishlistModalOpen(true);
      return;
    }

    const onlyCategory = Object.keys(wishlist || {})[0] ?? "General";

    // Add to wishlist - context will handle login check and show error if needed
    const success = await addToWishlist(
      {
        ...product,
        _id: productId,
        image: Array.isArray(product.image) ? product.image : [imageSrc],
      },
      onlyCategory,
    );

    // Only show success toast if addToWishlist returned true
    if (success) {
      toast.success("Added to wishlist");
    }
  };

  const handleAddToWishlist = async () => {
    const category = newCategory.trim() || selectedCategory;
    if (!category) return;

    const success = await addToWishlist(
      {
        ...product,
        _id: productId,
        image: Array.isArray(product.image) ? product.image : [imageSrc],
      } as any,
      category,
    );

    if (success) {
      closeWishlistModal();
      toast.success("Added to wishlist");
    }
  };

  useEffect(() => {
    if (!isWishlistModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWishlistModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isWishlistModalOpen]);

  return (
    <>
      <WishlistModal
        open={isWishlistModalOpen}
        onClose={closeWishlistModal}
        wishlist={wishlist}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showNewCategoryInput={showNewCategoryInput}
        setShowNewCategoryInput={setShowNewCategoryInput}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddToWishlist={handleAddToWishlist}
      />

      <button
        onClick={handleWishlistClick}
        className={`${iconSize} transition-colors ${
          productInWishlist
            ? "text-red-500"
            : "text-content-subtle hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
        } ${className}`}
        aria-label={
          productInWishlist ? "Remove from wishlist" : "Add to wishlist"
        }
      >
        {showLabel ? (
          <span className="flex items-center gap-2">
            {productInWishlist ? (
              <IoHeartSharp className="w-6 h-6" />
            ) : (
              <IoHeartOutline className="w-6 h-6" />
            )}
            {productInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </span>
        ) : productInWishlist ? (
          <IoHeartSharp className="w-6 h-6" />
        ) : (
          <IoHeartOutline className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
