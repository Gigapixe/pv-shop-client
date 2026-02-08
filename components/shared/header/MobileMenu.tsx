"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/lib/ThemeToggle";
import NoticeServices from "@/services/noticeServices";
import CartIcon from "@/public/icons/CartIcon";
import Button from "@/components/ui/Button";
import MenuIcon from "@/public/icons/MenuIcon";
import SearchCloseIcon from "@/public/icons/SearchCloseIcon";
import DownArrowIcon from "@/public/icons/DownArrowIcon";

interface Props {
  userInfo?: any;
  token?: string | null;
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Checkout", href: "/checkout" },
];

type CategoryItem = {
  label: string;
  href?: string; // optional if you want parent clickable too
  children?: { label: string; href: string }[];
};

const categories: CategoryItem[] = [
  {
    label: "Google",
    children: [
      { label: "Gmail PVA", href: "/category/google/gmail" },
      { label: "Google Voice", href: "/category/google/voice" },
      { label: "Recovery Email", href: "/category/google/recovery" },
    ],
  },
  {
    label: "Outlook/Hotmail",
    children: [
      { label: "Hotmail PVA", href: "/category/outlook/hotmail" },
      { label: "Outlook PVA", href: "/category/outlook/outlook" },
    ],
  },
  {
    label: "Yahoo",
    children: [
      { label: "Yahoo PVA", href: "/category/yahoo/pva" },
      { label: "Aged Yahoo", href: "/category/yahoo/aged" },
    ],
  },
  {
    label: "Youtube",
    children: [
      { label: "Youtube PVA", href: "/category/youtube/pva" },
      { label: "Monetized", href: "/category/youtube/monetized" },
    ],
  },
  {
    label: "Twitter",
    children: [
      { label: "X PVA", href: "/category/twitter/pva" },
      { label: "Aged X", href: "/category/twitter/aged" },
    ],
  },
  {
    label: "Others",
    children: [
      { label: "Tinder", href: "/category/others/tinder" },
      { label: "Pinterest", href: "/category/others/pinterest" },
    ],
  },
];

const getFirstName = (fullName?: string) => {
  if (!fullName) return null;
  const first = String(fullName).trim().split(" ")[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : null;
};

export default function MobileMenu({ userInfo, token }: Props) {
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false); // keep mounted while closing
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const openDrawer = () => {
    setMounted(true);
    // IMPORTANT: allow first paint with translate-x-full
    requestAnimationFrame(() => setOpen(true));
  };

  const closeDrawer = () => {
    setOpen(false);
    setActiveCategory(null);
    setTimeout(() => setMounted(false), 300); // must match duration-300
  };


  // mount/unmount with animation
  useEffect(() => {
    if (open) setRender(true);
    if (!open && render) {
      const t = setTimeout(() => setRender(false), 260); // match duration
      return () => clearTimeout(t);
    }
  }, [open, render]);

  const fetchUserNotices = useCallback(async () => {
    if (!userInfo || !token) return;
    try {
      const countRes = await NoticeServices.getUnreadCount({ token });
      if (countRes?.status === "success") {
        setUnreadCount(countRes.data.unreadCount ?? 0);
      }
    } catch {
      // silent
    }
  }, [userInfo, token]);

  useEffect(() => {
    if (!userInfo || !token) {
      setUnreadCount(0);
      return;
    }
    fetchUserNotices();
  }, [userInfo, token, fetchUserNotices]);

  // ESC closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // lock scroll
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);


  return (
    <div className="lg:hidden">
      {/* TOP BAR */}
      <div className="sticky top-0 z-40 w-full bg-background dark:bg-background-dark">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={openDrawer}
            className="p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          <Link href="/" className="flex-1 flex justify-center">
            <Image
              src="/logo/logo.png"
              alt="Pvaeshop"
              width={170}
              height={40}
              priority
              className="h-7 w-auto object-contain"
            />
          </Link>

          <Link
            href="/cart"
            className="p-2 -mr-2 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 transition"
            aria-label="Cart"
          >
            <CartIcon className="w-5 h-5 text-primary" fill="none" />
          </Link>
        </div>
      </div>

      {mounted && (
        <>
          {/* Backdrop */}
          <div
            className={[
              "fixed inset-0 z-40 bg-black/45 transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside
            className={[
              "fixed left-0 top-0 z-50 h-full w-full",
              "bg-white dark:bg-background-dark shadow-xl overflow-y-auto",
              "transition-transform duration-300 ease-out will-change-transform",
              open ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
              <button
                onClick={closeDrawer}
                className="p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
                aria-label="Close menu"
              >
                <SearchCloseIcon />
              </button>

              <Link href="/" onClick={closeDrawer} className="flex-1 flex justify-center">
                <Image
                  src="/logo/logo.png"
                  alt="Pvaeshop"
                  width={140}
                  height={36}
                  className="h-7 w-auto object-contain"
                  priority
                />
              </Link>

              <Link
                href="/cart"
                onClick={closeDrawer}
                className="p-2 -mr-2 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 transition"
                aria-label="Cart"
              >
                <CartIcon className="w-5 h-5 text-primary" fill="none" />
              </Link>
            </div>

            {/* Search row */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <ThemeToggle />
                </div>

                <Button
                  variant="outline"
                  className=" border border-gray-200 py-2.5 text-text-dark dark:bg-background-dark-2 dark:text-background dark:border-white/10"
                >
                  English <DownArrowIcon className="w-3 h-3 opacity-90" />
                </Button>

                {userInfo ? (
                  <Link
                    href="/user"
                    className="rounded-full border border-primary px-8 py-2 text-[18px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition"
                  >
                    {getFirstName(userInfo.name) ?? "Account"}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-full border border-primary px-8 py-2 flex items-center justify-center text-[18px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition"
                  >
                    Login
                  </Link>
                )}
              </div>


            </div>

            {/* Quick Links */}
            <div className="px-4 pt-4">
              <p className="text-xs text-gray-500 dark:text-background/60 mb-2">Quick Links</p>
              <div className="space-y-2">
                {quickLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={closeDrawer}
                    className={[
                      "block text-sm font-semibold",
                      l.label === "Home"
                        ? "text-primary"
                        : "text-text-dark dark:text-background",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="my-4 h-px bg-black/10 dark:bg-white/10" />

            {/* Categories (dropdown like screenshot) */}
            <div className="px-4 pb-6">
              <p className="text-xs text-gray-500 dark:text-background/60 mb-2">Categories</p>

              <div className="divide-y divide-black/5 dark:divide-white/10">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.label;

                  return (
                    <div key={cat.label} className="py-1">
                      {/* row */}
                      <button
                        type="button"
                        onClick={() => setActiveCategory((p) => (p === cat.label ? null : cat.label))}
                        className="w-full flex items-center justify-between py-2 text-left"
                      >
                        <span className="text-sm font-semibold text-text-dark dark:text-background">
                          {cat.label}
                        </span>

                        <span
                          className={[
                            "transition-transform duration-200 text-gray-400",
                            isActive ? "rotate-90" : "rotate-0",
                          ].join(" ")}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M9 18a1 1 0 0 1-.7-1.7l4.6-4.6-4.6-4.6A1 1 0 0 1 9.7 5.7l5.3 5.3a1 1 0 0 1 0 1.4l-5.3 5.3A1 1 0 0 1 9 18z"
                            />
                          </svg>
                        </span>
                      </button>

                      {/* dropdown under row */}
                      <div
                        className={[
                          "grid transition-all duration-300 ease-in-out",
                          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        ].join(" ")}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-3 pl-3">
                            <div className="flex flex-col gap-2">
                              {(cat.children ?? []).map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={closeDrawer}
                                  className="text-sm text-gray-600 dark:text-background/70 hover:text-primary transition"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </>
      )}

    </div>
  );
}
