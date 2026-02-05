"use client";

import ButtonArrowIcon from "@/public/icons/ButtonArrowIcon";
import { useCartStore, CartItem } from "@/zustand/store";

export default function AddToCartButton({
  item,
  className = "",
}: {
  item: Omit<CartItem, "quantity"> & { paymentMethods?: string[] };
  className?: string;
}) {
  const addToCart = useCartStore((s) => s.addToCart);

  const handleAdd = () => {
    const ok = addToCart(item);
    if (!ok) {
      // cart has different metaType already
      alert("You can't mix different item types in the cart.");
    }
  };

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[18px] font-semibold text-background hover:opacity-95 transition ${className}`}
    >
      Order Now
      <ButtonArrowIcon className="w-4 h-4"/>
    </button>
  );
}
