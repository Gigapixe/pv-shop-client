"use client";

import Link from "next/link";
import { useCartStore } from "@/zustand/cartStore";

export default function CartButton() {
  const totalQty = useCartStore((s) => s.totalQty());
  const totalPrice = useCartStore((s) => s.totalPrice());

  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition"
    >
      <span>🛒</span>
      <span className="whitespace-nowrap">
        ৳ {totalPrice.toFixed(2)}
      </span>
      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-white text-xs px-1">
        {totalQty}
      </span>
    </Link>
  );
}
