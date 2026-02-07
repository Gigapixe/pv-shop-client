"use client";

import CheckIcon from "@/public/icons/CheckIcon";
import AddToCartButton from "./AddToCartButton";
import { CartItemType } from "@/zustand/store";

type PackageCardProps = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  subtitle?: string; // new
  features: string[];
  type?: CartItemType;
  image?: string; // not needed for this design
  paymentMethods?: string[];
};

export default function PackageCard({
  _id,
  title,
  slug,
  price,
  subtitle = "Best value, zero compromise",
  features,
  type = "DIGITAL_PINS",
  paymentMethods,
}: PackageCardProps) {
  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-[var(--color-tertiary)] shadow-sm">
      <div className="p-8">
        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-text-dark dark:text-white">
          {title}
        </h3>

        {/* Subtitle */}
        <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
          {subtitle}
        </p>

        {/* Price */}
        <div className="mt-6 text-3xl font-extrabold text-primary">
          {price}$
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-gray-200 dark:bg-white/10" />

        {/* Features */}
        <ul className="space-y-4">
          {features.map((f, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckIcon className="mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-white/70 leading-relaxed">
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* Button */}
        <div className="mt-8">
          <AddToCartButton
            item={{
              _id,
              title,
              slug,
              price,
              originalPrice: undefined,
              image: "", 
              type,
              paymentMethods,
            }}
            className="w-full h-12 rounded-full text-base font-semibold"
            
          />
        </div>
      </div>
    </div>
  );
}
