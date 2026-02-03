import { useMemo } from "react";
import { useWishlist } from "@/app/context/WishlistContext";
import { useAuthStore } from "@/zustand/authStore";
import WishListIcon from "@/public/icons/WishListIcon";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const WishlistButton = () => {
  const { wishlist } = useWishlist();
  const { user } = useAuthStore();
  const router = useRouter();

  const wishlistCount = useMemo(() => {
    return Object.values(wishlist || {}).reduce((sum, items) => {
      return sum + (Array.isArray(items) ? items.length : 0);
    }, 0);
  }, [wishlist]);

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast.error("Please login to view your wishlist");
      return;
    }
    router.push("/user/wishlist");
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className="relative cursor-pointer pt-2"
        aria-label="Open wishlist"
      >
        <WishListIcon className="dark:text-white" />
        {wishlistCount > 0 && (
          <span className="absolute top-0 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </button>
    </div>
  );
};
