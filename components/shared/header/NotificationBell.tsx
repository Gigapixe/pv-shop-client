"use client";

import NotificationIcon from "@/public/icons/user/NotificationIcon";
import NoticeServices, { Notice } from "@/services/noticeServices";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useTranslations } from "next-intl";

dayjs.extend(relativeTime);

const NOTICES_PER_PAGE = 5;

type NotificationBellProps = {
  userInfo?: {
    _id?: string;
    name?: string;
  } | null;
  token?: string | null;
};

type NotificationPopupProps = {
  notifications: Notice[];
  isVisible: boolean;
  onClose: () => void;
  isLoading: boolean;
  markAllAsRead: () => Promise<void>;
};

const NotificationPopup = ({
  notifications,
  isVisible,
  onClose,
  isLoading,
  markAllAsRead,
}: NotificationPopupProps) => {
  const router = useRouter();
  const t = useTranslations("notification");

  if (!isVisible) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-background-dark rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white">
          {t("notifications")}
        </h3>
        <button
          onClick={markAllAsRead}
          className="text-base underline text-primary font-medium"
        >
          {t("markAllAsRead")}
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center">
            <FiBell className="mx-auto text-gray-400 text-3xl mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              {t("noNotifications")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notice) => (
              <div
                key={notice._id}
                className={`py-1 px-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notice.isRead
                    ? "bg-emerald-50/30 dark:bg-emerald-900/10"
                    : "dark:hover:bg-gray-700/50"
                }`}
                onClick={() => {
                  router.push("/user/notifications");
                  onClose();
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grow min-w-0 py-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h3 className="text-xs font-bold text-gray-800 dark:text-white wrap-break-words">
                        {notice.title}
                      </h3>
                    </div>
                    <p className="text-xs pt-1 text-gray-600 dark:text-gray-400 truncate overflow-hidden whitespace-nowrap">
                      {notice.content.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>

                  <div className="shrink-0 ml-2 flex flex-col items-end">
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] whitespace-nowrap">
                      {dayjs(notice.createdAt).fromNow()}
                    </span>
                    {!notice.isRead && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        <button
          onClick={() => {
            router.push("/user/notifications");
            onClose();
          }}
          className="py-2 px-6 rounded-full text-center bg-emerald-500 border border-gray-300 dark:border-gray-600 text-white font-medium transition-colors"
        >
          {t("showAllNotifications")}
        </button>
      </div>
    </div>
  );
};

export default function NotificationBell({
  userInfo,
  token,
}: NotificationBellProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const fetchUserNotices = useCallback(async () => {
    if (!userInfo || !token) return;

    try {
      // Prefer a dedicated unread count API for accuracy
      const countRes = await NoticeServices.getUnreadCount({ token });
      if (countRes?.status === "success") {
        setUnreadCount(countRes.data.unreadCount ?? 0);
      } else {
        // Fallback: request a small page and count unread there
        const res = await NoticeServices.getUserNotices(
          { page: 1, limit: NOTICES_PER_PAGE },
          { token },
        );
        const notices = res?.data?.notices ?? [];
        setUnreadCount(notices.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch user notices:", err);
    }
  }, [userInfo, token]);

  const fetchRecentNotices = useCallback(async () => {
    if (!userInfo || !token) return;

    setIsLoading(true);
    try {
      const res = await NoticeServices.getUserNotices(
        { page: 1, limit: 8 },
        { token },
      );
      setRecentNotices(res?.data?.notices ?? []);
    } catch (err) {
      console.error("Failed to fetch recent notices:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo, token]);

  const markAllAsRead = useCallback(async () => {
    if (!token) return;

    try {
      await NoticeServices.markAllAsRead({ token });
      setUnreadCount(0);
      setRecentNotices((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("noticesMarkedAllRead"));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, [token]);

  const handleOpen = () => {
    if (!userInfo) return router.push("/auth/login");
    if (!token) return;
    if (!isOpen) fetchRecentNotices();
    setIsOpen((v) => !v);
  };

  // load + poll
  useEffect(() => {
    if (!userInfo || !token) {
      setUnreadCount(0);
      setRecentNotices([]);
      return;
    }

    fetchUserNotices();
    fetchRecentNotices();

    const interval = setInterval(fetchUserNotices, 60000);
    return () => clearInterval(interval);
  }, [userInfo, token, fetchUserNotices, fetchRecentNotices]);

  // Listen for global notice events to keep counts in sync across UI
  useEffect(() => {
    const onNoticeRead = () => setUnreadCount((prev) => Math.max(0, prev - 1));
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

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!isOpen) return;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  if (!userInfo) return null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative cursor-pointer pt-2"
        aria-label="Open notifications"
      >
        <NotificationIcon className="dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup */}
      <NotificationPopup
        notifications={recentNotices}
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        isLoading={isLoading}
        markAllAsRead={markAllAsRead}
      />
    </div>
  );
}
