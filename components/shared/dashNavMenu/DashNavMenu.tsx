"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { usePathname, useRouter } from "next/navigation";
import UserProfile from "@/components/user/UserProfile";
import UserNavLinks from "@/components/user/UserNavLinks";
import ArrowIcon from "@/public/icons/user/ArrowIcon";
import CloseIcon from "@/public/icons/user/CloseIcon";
import { getNavItems } from "@/components/user/navData";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/zustand/authStore";
import Link from "next/link";
import NotificationIcon from "@/public/icons/user/NotificationIcon";
import NoticeServices from "@/services/noticeServices";

interface DashNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashNavMenu({ isOpen, onClose }: DashNavMenuProps) {
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user: userInfo, token } = useAuthStore();
  const t = useTranslations("user.nav");
  const c = useTranslations("common");
  const [unreadCount, setUnreadCount] = useState(0);

  // resolved items (translated)
  const items = getNavItems(t);
  // Filter to show first 5 links when showMore is false, otherwise show all
  const visibleLinks = showMore ? items : items.slice(0, 5);

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
    if (!userInfo || !token) {
      setUnreadCount(0);
      return;
    }

    fetchUserNotices();

    const interval = setInterval(fetchUserNotices, 60000);
    return () => clearInterval(interval);
  }, [userInfo, token, fetchUserNotices]);

  // Sync with global events
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

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/auth/login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 max-h-[70vh]">
        {/* Profile Section - Fixed at the top */}
        <div className="sticky top-0 z-10 bg-white dark:bg-background-dark">
          <UserProfile />
        </div>

        <hr className="w-full border-border-light dark:border-border-dark" />

        {/* Notification Section */}
        <div className="">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold">{c("notifications")}</h1>
            <Link href="/user/notifications" onClick={onClose}>
              <button
                type="button"
                className="relative cursor-pointer pt-2 mr-2"
                aria-label="Open notifications"
              >
                <NotificationIcon className="dark:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>

        <hr className="w-full border-border-light dark:border-border-dark" />

        {/* Nav Links - Scrollable */}
        <nav className="flex flex-col w-full max-h-[calc(70vh-200px)] overflow-y-auto">
          <UserNavLinks
            items={visibleLinks}
            activePath={pathname}
            onClose={onClose}
            onLogout={handleLogout}
          />

          {/* Toggle See More */}
          {items.length > 5 && (
            <button
              className="bg-primary/10 text-primary px-4 py-2.5 rounded-lg mx-4 hover:bg-primary/20 transition-colors text-left mt-2"
              onClick={() => setShowMore((prev) => !prev)}
            >
              <p className="flex gap-2 justify-between items-center w-full">
                <span className="text-sm font-medium">
                  {showMore ? t("seeLess") : t("seeMore")}
                </span>
                <span className="px-2 py-1 bg-primary rounded-full">
                  <ArrowIcon
                    className={`inline-block transition-transform text-white w-3 h-3 ${
                      showMore ? "rotate-[-135deg]" : "rotate-45"
                    }`}
                  />
                </span>
              </p>
            </button>
          )}
        </nav>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 p-4 bg-white dark:bg-background-dark rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <CloseIcon />
        </button>
      </div>
    </Modal>
  );
}
