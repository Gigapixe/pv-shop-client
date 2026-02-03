"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TbWorld } from "react-icons/tb";
import MenuIcon from "./../../../public/icons/navbar/MenuIcon";
import CloseIcon from "./../../../public/icons/navbar/CloseIcon";
import ThemeToggle from "@/lib/ThemeToggle";
import { useTranslations } from "next-intl";
import LanguageCurrencyModal from "@/components/ui/LanguageCurrencyModal";
import NoticeServices from "@/services/noticeServices";
import NotificationIcon from "@/public/icons/user/NotificationIcon";

interface Props {
  userInfo?: any;
  token?: string | null;
  unreadCount?: number;
  openSettingsModal?: () => void;
  LangCurrency?: React.ReactNode;
}

export default function MobileMenu({
  userInfo,
  token,
  openSettingsModal,
  LangCurrency,
}: Props) {
  const t = useTranslations("common");
  const nav = useTranslations("navigation");
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUserNotices = useCallback(async () => {
    if (!userInfo || !token) return;

    try {
      const countRes = await NoticeServices.getUnreadCount({ token });
      if (countRes?.status === "success") {
        setUnreadCount(countRes.data.unreadCount ?? 0);
      } else {
        const res = await NoticeServices.getUserNotices(
          { page: 1, limit: 8 },
          { token },
        );
        const notices = res?.data?.notices ?? [];
        setUnreadCount(notices.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch user notices:", err);
    }
  }, [userInfo, token]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
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

  useEffect(() => {
    if (!userInfo || !token) {
      setUnreadCount(0);
      return;
    }

    fetchUserNotices();

    const interval = setInterval(fetchUserNotices, 60000);
    return () => clearInterval(interval);
  }, [userInfo, token, fetchUserNotices]);

  // Sync unread counts when other parts of the app change notices
  useEffect(() => {
    const onNoticeRead = () => setUnreadCount((p) => Math.max(0, p - 1));
    const onAllRead = () => setUnreadCount(0);

    if (typeof window !== "undefined") {
      window.addEventListener("noticeRead", onNoticeRead as any);
      window.addEventListener("noticesMarkedAllRead", onAllRead as any);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("noticeRead", onNoticeRead as any);
        window.removeEventListener("noticesMarkedAllRead", onAllRead as any);
      }
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden" ref={ref}>
      {/* Top bar: menu button + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen((s) => !s)}
          className="hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <Link href="/" className="shrink-0" onClick={() => setIsOpen(false)}>
          <div className="h-8 w-8">
            <Image
              width={32}
              height={32}
              className="object-contain"
              priority
              src="/logo/logo-sort.png"
              alt="logo"
            />
          </div>
        </Link>
      </div>

      {/* Full-width dropdown panel */}
      {isOpen && (
        <>
          <div
            className="fixed left-0 right-0 top-16 bottom-0 bg-black/50 z-10 transition-opacity duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed left-0 right-0 top-16 bg-background-light dark:bg-background-dark z-50 py-6 shadow-lg">
            <div className="px-4">
              <div>
                <h1 className="text-2xl font-bold mb-4">{t("quickLinks")}</h1>
              </div>

              <Link
                href="/bestseller"
                className="block py-2 hover:text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {nav("bestsellers")}
              </Link>

              <Link
                href="/about-us"
                className="block py-2 hover:text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {nav("aboutUs")}
              </Link>

              <Link
                href="/contact-us"
                className="block py-2 hover:text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {nav("contactUs")}
              </Link>

              <hr className="my-4 border-gray-600" />

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h1 className="font-semibold">{t("themeMode")}</h1>
                  <ThemeToggle />
                </div>

                {userInfo && (
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold">{t("notifications")}</h1>
                    <Link
                      href="/user/notifications"
                      onClick={() => setIsOpen(false)}
                    >
                      <button
                        type="button"
                        className="relative cursor-pointer pt-2 mr-2"
                        aria-label="Open notifications"
                      >
                        <NotificationIcon className="dark:text-white" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </Link>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <h1 className="font-semibold">{t("languageAndCurrency")}</h1>
                  {LangCurrency ?? (
                    <button
                      onClick={() => {
                        setIsSettingsModalOpen(true);
                        setIsOpen(false);
                      }}
                      className="text-gray-300 hover:text-primary transition-colors mr-2"
                    >
                      <TbWorld className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Language & Currency Modal */}
      <LanguageCurrencyModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
