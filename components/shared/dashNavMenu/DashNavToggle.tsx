"use client";

import { useState } from "react";
import DashNavMenu from "./DashNavMenu";
import { usePathname } from "next/navigation";
import { getNavItems } from "@/components/user/navData";
import { useTranslations } from "next-intl";

export default function DashNavToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("user.nav");

  const activeNavItem = getNavItems(t).find((item) => item.href === pathname);
  const displayText = activeNavItem?.name || t("dashboard");

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          w-full
          rounded-full
          px-5 py-3
          flex items-center justify-between
          bg-primary/10
          border border-emerald-500/25
          shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_10px_30px_rgba(0,0,0,0.45)]
          ring-1 ring-primary/10
          backdrop-blur
          transition
          hover:border-primary/40
          hover:bg-primary/15
          focus:outline-none
          focus:ring-2 focus:ring-primary/30
        "
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Left icon (use active icon if exists, otherwise grid icon like screenshot) */}
          {activeNavItem?.icon ? (
            <activeNavItem.icon className="w-6 h-6 text-primary shrink-0" />
          ) : (
            <svg
              className="w-6 h-6 text-primary shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
          )}

          <span className="text-primary font-medium truncate">
            {displayText}
          </span>
        </div>

        {/* Right chevron */}
        <svg
          className={`w-5 h-5 text-primary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <DashNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
