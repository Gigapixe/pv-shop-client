"use client";

import {
  addNewCategory,
  addProductToWishlist,
  deleteNewCategory,
  editNewCategory,
  getWishlist,
  moveNewProduct,
  removeProductFromWishlist,
} from "@/services/wishlistService";
import { useAuthStore } from "@/zustand/authStore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

// ---------- Types ----------
export type WishlistItem = {
  _id: string;
  id?: string;
  slug?: string;
  title?: any;
  image?: any;
  prices?: any;
  DigitalPrice?: any;
  [key: string]: any; // keep flexible because product shape may vary
};

export type WishlistMap = Record<string, WishlistItem[]>;

type PendingAction = {
  type: "ADD_TO_WISHLIST";
  payload: { product: WishlistItem; category: string };
} | null;

export type WishlistContextValue = {
  wishlist: WishlistMap;
  isLoading: boolean;
  error: string | null;

  fetchWishlist: () => Promise<void>;

  addCategory: (categoryName: string) => Promise<boolean>;
  editCategory: (oldName: string, newName: string) => Promise<boolean>;
  deleteCategory: (categoryName: string) => Promise<boolean>;

  addToWishlist: (product: WishlistItem, category?: string) => Promise<boolean>;
  removeFromWishlist: (productId: string, category: string) => Promise<void>;
  moveProduct: (
    productId: string,
    fromCategory: string,
    toCategory: string,
  ) => Promise<void>;

  isInWishlist: (productId: string) => boolean;
  getCategoryForProduct: (productId: string) => string | undefined;

  setError: React.Dispatch<React.SetStateAction<string | null>>;
  clearPendingAction: () => void;
};

// ---------- Helpers ----------
const normalizeWishlistData = (data: unknown): WishlistMap => {
  if (
    !data ||
    typeof data !== "object" ||
    Object.keys(data as object).length === 0
  ) {
    return { General: [] };
  }

  const obj = data as Record<string, unknown>;
  const normalized: WishlistMap = {};
  let hasAtLeastOneCategory = false;

  for (const categoryKey in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, categoryKey)) {
      hasAtLeastOneCategory = true;
      const value = obj[categoryKey];
      normalized[categoryKey] = Array.isArray(value)
        ? (value as WishlistItem[])
        : [];
    }
  }

  if (!hasAtLeastOneCategory) return { General: [] };
  if (!normalized.General) normalized.General = [];

  return normalized;
};

// ---------- Context ----------
const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistMap>(() =>
    normalizeWishlistData({ General: [] }),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const { user, token } = useAuthStore();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(normalizeWishlistData(null));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getWishlist({ token: token ?? undefined });

      if (res && res.status === "success" && res.data) {
        setWishlist(normalizeWishlistData(res.data));
      } else {
        setWishlist(normalizeWishlistData(null));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch wishlist.");
      console.error("Fetch Wishlist Error:", err);
      setWishlist(normalizeWishlistData(null));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Process pending action after login
  useEffect(() => {
    if (!user || !pendingAction) return;

    const { type, payload } = pendingAction;

    if (type === "ADD_TO_WISHLIST") {
      const attemptAdd = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const res = await addProductToWishlist(
            payload.product._id,
            payload.category,
            { token: token ?? undefined },
          );

          if (res && res.status === "success") {
            setWishlist(normalizeWishlistData(res.data));
          } else {
            throw new Error(
              res?.message || "Failed to add pending item to wishlist",
            );
          }
        } catch (err: any) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Error adding pending item.",
          );
          console.error("Pending Add to Wishlist Error:", err);
        } finally {
          setIsLoading(false);
          setPendingAction(null);
        }
      };

      attemptAdd();
    }
  }, [user, pendingAction]);

  // Clear pending action on logout
  useEffect(() => {
    if (!user) setPendingAction(null);
  }, [user]);

  // ---------- Category CRUD ----------
  const addCategory = useCallback(
    async (categoryName: string): Promise<boolean> => {
      if (!user) {
        setError("You must be logged in to add a category.");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await addNewCategory(categoryName, {
          token: token ?? undefined,
        });

        if (res && res.status === "success") {
          setWishlist(normalizeWishlistData(res.data));
          return true;
        }

        setError(res?.message || "Failed to add category");
        return false;
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Error adding category.",
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const editCategory = useCallback(
    async (oldName: string, newName: string): Promise<boolean> => {
      if (!user) {
        setError("You must be logged in to edit a category.");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await editNewCategory(oldName, newName, {
          token: token ?? undefined,
        });

        if (res && res.status === "success") {
          setWishlist(normalizeWishlistData(res.data));
          return true;
        }

        setError(res?.message || "Failed to edit category");
        return false;
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Error editing category.",
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const deleteCategory = useCallback(
    async (categoryName: string): Promise<boolean> => {
      if (!user) {
        setError("You must be logged in to delete a category.");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await deleteNewCategory(categoryName, {
          token: token ?? undefined,
        });

        if (res && res.status === "success") {
          setWishlist(normalizeWishlistData(res.data));
          return true;
        }

        setError(res?.message || "Failed to delete category");
        return false;
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Error deleting category.",
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  // ---------- Product CRUD ----------
  const addToWishlist = useCallback(
    async (
      product: WishlistItem,
      category: string = "General",
    ): Promise<boolean> => {
      if (!user) {
        setError("Please log in to add items to your wishlist.");
        setPendingAction({
          type: "ADD_TO_WISHLIST",
          payload: { product, category },
        });
        toast.error("Please login to add to wishlist");
        return false;
      }

      setIsLoading(true);
      setError(null);
      setPendingAction(null);

      try {
        const res = await addProductToWishlist(product._id, category, {
          token: token ?? undefined,
        });

        if (res && res.status === "success") {
          setWishlist(normalizeWishlistData(res.data));
          return true;
        } else {
          throw new Error(res?.message || "Failed to add product to wishlist");
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Error adding product.",
        );
        console.error("Add to Wishlist Error:", err);
        toast.error(err?.response?.data?.message || "Error adding product");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const removeFromWishlist = useCallback(
    async (productId: string, category: string) => {
      if (!user) {
        setError("You must be logged in to remove from wishlist.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await removeProductFromWishlist(category, productId, {
          token: token ?? undefined,
        });

        if (res && res.status === "success") {
          setWishlist(normalizeWishlistData(res.data));
        } else {
          throw new Error(
            res?.message || "Failed to remove product from wishlist",
          );
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Error removing product.",
        );
        console.error("Remove from Wishlist Error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const moveProduct = useCallback(
    async (productId: string, fromCategory: string, toCategory: string) => {
      if (!user) {
        setError("You must be logged in to move a product.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await moveNewProduct(productId, fromCategory, toCategory, {
          token: token ?? undefined,
        });

        if (res && res.status === "success") {
          setWishlist(normalizeWishlistData(res.data));
        } else {
          throw new Error(res?.message || "Failed to move product");
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Error moving product.",
        );
        console.error("Move Product Error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  // ---------- Derived helpers ----------
  const isInWishlist = useCallback(
    (productId: string) => {
      const values = Object.values(wishlist);
      return values.some(
        (items) =>
          Array.isArray(items) && items.some((item) => item._id === productId),
      );
    },
    [wishlist],
  );

  const getCategoryForProduct = useCallback(
    (productId: string) => {
      return Object.keys(wishlist).find(
        (category) =>
          Array.isArray(wishlist[category]) &&
          wishlist[category].some((item) => item._id === productId),
      );
    },
    [wishlist],
  );

  const clearPendingAction = useCallback(() => setPendingAction(null), []);

  const value: WishlistContextValue = useMemo(
    () => ({
      wishlist,
      isLoading,
      error,
      fetchWishlist,
      addCategory,
      editCategory,
      deleteCategory,
      addToWishlist,
      removeFromWishlist,
      moveProduct,
      isInWishlist,
      getCategoryForProduct,
      setError,
      clearPendingAction,
    }),
    [
      wishlist,
      isLoading,
      error,
      fetchWishlist,
      addCategory,
      editCategory,
      deleteCategory,
      addToWishlist,
      removeFromWishlist,
      moveProduct,
      isInWishlist,
      getCategoryForProduct,
      setError,
      clearPendingAction,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
