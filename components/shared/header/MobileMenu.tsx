"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/lib/ThemeToggle";

import NoticeServices from "@/services/noticeServices";
import CartIcon from "@/public/icons/CartIcon";
import Button from "@/components/ui/Button";
import SearchCloseIcon from "@/public/icons/SearchCloseIcon";
import MenuIcon from "@/public/icons/MenuIcon";

interface Props {
  userInfo?: any;
  token?: string | null;
  unreadCount?: number;
  openSettingsModal?: () => void;
  LangCurrency?: React.ReactNode;
}

const NAV_LINKS = [
  { label: "Best Sellers", href: "/bestseller" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
];

export default function MobileMenu({
  userInfo,
  token,
  LangCurrency,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const getFirstName = (fullName?: string) => {
    if (!fullName) return null;
    const first = String(fullName).trim().split(" ")[0];
    return first ? first.charAt(0).toUpperCase() + first.slice(1) : null;
  };

  const fetchUserNotices = useCallback(async () => {
    if (!userInfo || !token) return;

    try {
      const countRes = await NoticeServices.getUnreadCount({ token });
      if (countRes?.status === "success") {
        setUnreadCount(countRes.data.unreadCount ?? 0);
      } else {
        const res = await NoticeServices.getUserNotices(
          { page: 1, limit: 8 },
          { token }
        );
        const notices = res?.data?.notices ?? [];
        setUnreadCount(notices.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch user notices:", err);
    }
  }, [userInfo, token]);

  // outside click + ESC
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // unread count
  useEffect(() => {
    if (!userInfo || !token) {
      setUnreadCount(0);
      return;
    }
    fetchUserNotices();
    const interval = setInterval(fetchUserNotices, 60000);
    return () => clearInterval(interval);
  }, [userInfo, token, fetchUserNotices]);

  // notice events
  useEffect(() => {
    const onNoticeRead = () => setUnreadCount((p) => Math.max(0, p - 1));
    const onAllRead = () => setUnreadCount(0);

    window.addEventListener("noticeRead", onNoticeRead as any);
    window.addEventListener("noticesMarkedAllRead", onAllRead as any);

    return () => {
      window.removeEventListener("noticeRead", onNoticeRead as any);
      window.removeEventListener("noticesMarkedAllRead", onAllRead as any);
    };
  }, []);

  // lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <div className="w-full" ref={ref}>
      {/* Header bar (matches screenshot) */}
      <div className="w-full bg-background dark:bg-background-dark">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          {/* Left: Menu */}
          <button
            onClick={() => setIsOpen((s) => !s)}
            className="p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? <SearchCloseIcon /> : <MenuIcon />}
          </button>

          {/* Center: Full logo */}
          <Link href="/" className="flex-1 flex justify-center" onClick={() => setIsOpen(false)}>
            <Image
              src="/logo/logo.png"
              alt="Pvaeshop"
              width={180}
              height={40}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Right: round cart icon (mobile look) */}
          <Link
            href="/cart"
            className="p-2 -mr-2 rounded-full block md:hidden border border-primary/30 bg-primary/5 hover:bg-primary/10 transition"
            aria-label="Cart"
          >
            <CartIcon className="w-5 h-5 text-primary" fill="none" />
          </Link>

          {/* Tablet row (md): Login + Cart amount pills like screenshot */}
          <div className="hidden md:flex items-center justify-end gap-3 px-4">
            {!userInfo ? (
              <Link href="/login" className="inline-flex">
                <Button variant="outline" size="md" className="text-primary border-primary/40">
                  Login
                </Button>
              </Link>
            ) : (
              <Link href="/user" className="inline-flex">
                <Button variant="outline" size="md" className="text-primary border-primary/40">
                  {getFirstName(userInfo?.name) ?? "Account"}
                </Button>
              </Link>
            )}

            <div className="rounded-full flex items-center gap-2 border border-primary/40 bg-primary/5 px-5 py-2 font-semibold text-primary">
              <CartIcon className="w-5 h-5" fill="none" />
              $0.00
            </div>
          </div>
        </div>


      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/50 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed left-0 right-0 top-16 z-40 bg-background dark:bg-background-dark shadow-lg">
            <div className="px-4 py-6">
              <h1 className="text-xl font-bold mb-4 text-text-dark dark:text-background">
                Quick Links
              </h1>

              <div className="space-y-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block rounded-xl px-3 py-3 font-semibold text-text-dark dark:text-background hover:bg-black/5 dark:hover:bg-white/10 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="my-5 h-px w-full bg-black/10 dark:bg-white/10" />

              {/* Settings row */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-dark dark:text-background">
                    Theme Mode
                  </span>
                  <ThemeToggle />
                </div>

                {/* {userInfo && (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-dark dark:text-background">
                      Notifications
                    </span>
                    <Link href="/user/notifications" onClick={() => setIsOpen(false)}>
                      <button
                        type="button"
                        className="relative p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
                        aria-label="Open notifications"
                      >
                        <NotificationIcon className="dark:text-white" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </Link>
                  </div>
                )} */}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-dark dark:text-background">
                    Language & Currency
                  </span>


                </div>
              </div>

              {/* Mobile actions */}
              <div className="mt-6 flex gap-3 md:hidden">
                {!userInfo ? (
                  <Link href="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="md" className="w-full text-primary border-primary/40">
                      Login
                    </Button>
                  </Link>
                ) : (
                  <Link href="/user" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="md" className="w-full text-primary border-primary/40">
                      {getFirstName(userInfo?.name) ?? "Account"}
                    </Button>
                  </Link>
                )}

                <Link href="/packages" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Packages
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
