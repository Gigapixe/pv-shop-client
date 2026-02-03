"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiInbox, FiRefreshCw } from "react-icons/fi";
import NoticeCard from "./NoticeCard";
import NoticeServices, { Notice } from "@/services/noticeServices";
import Loading from "@/components/blog/Loading";
import { useAuthStore } from "@/zustand/authStore";
import { useTranslations } from "next-intl";

const NOTICES_PER_PAGE = 15;

export default function NotificationsClient() {
  const t = useTranslations("notification");
  const { token } = useAuthStore();
  const authToken = token ?? undefined;

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [expandedNotices, setExpandedNotices] = useState<
    Record<string, boolean>
  >({});
  const [hiddenNotices, setHiddenNotices] = useState<string[]>([]);
  const [unreadNumber, setUnreadNumber] = useState<number>(0);

  const fetchNotices = useCallback(
    async (page: number, append = false) => {
      if (!authToken) return;

      setLoading(true);
      try {
        const res = await NoticeServices.getUserNotices(
          { page, limit: NOTICES_PER_PAGE },
          { token: authToken },
        );

        if (res.status === "success") {
          const fetched = res.data?.notices ?? [];
          const hasNextPage = Boolean(res.data?.hasNextPage);

          setNotices((prev) => (append ? [...prev, ...fetched] : fetched));
          setHasMore(hasNextPage);
        } else {
          throw new Error(res.message || "Failed to fetch notifications.");
        }
      } catch (err: any) {
        toast.error(err?.message || t("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [authToken],
  );

  // fetch authoritative unread count
  useEffect(() => {
    if (!authToken) return;

    let mounted = true;
    (async () => {
      try {
        const res = await NoticeServices.getUnreadCount({ token: authToken });
        if (mounted && res?.status === "success")
          setUnreadNumber(res.data.unreadCount ?? 0);
      } catch (err) {
        // ignore — UI will still show local count
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authToken]);

  useEffect(() => {
    if (!authToken) return;
    fetchNotices(1);
  }, [fetchNotices, authToken]);

  const handleToggleNotice = useCallback(
    (notice: Notice) => {
      setExpandedNotices((prev) => ({
        ...prev,
        [notice._id]: !prev[notice._id],
      }));

      if (!notice.isRead) {
        // optimistic
        setNotices((prev) =>
          prev.map((n) => (n._id === notice._id ? { ...n, isRead: true } : n)),
        );

        // update authoritative unread count locally
        setUnreadNumber((prev) => Math.max(0, prev - 1));
        if (typeof window !== "undefined")
          window.dispatchEvent(
            new CustomEvent("noticeRead", { detail: { id: notice._id } }),
          );

        if (!authToken) return;
        NoticeServices.markAsRead(notice._id, { token: authToken }).catch(
          (err) => {
            console.error("Failed to mark notice as read", err);
          },
        );
      }
    },
    [authToken],
  );

  const handleHideNotice = useCallback((noticeId: string) => {
    setHiddenNotices((prev) => [...prev, noticeId]);
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    if (!authToken) return;

    setMarkingAllRead(true);
    try {
      await NoticeServices.markAllAsRead({ token: authToken });
      toast.success(t("allMarkedAsRead"));
      setNotices((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNumber(0);
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("noticesMarkedAllRead"));
    } catch {
      toast.error(t("markAllError"));
    } finally {
      setMarkingAllRead(false);
    }
  }, [authToken]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    fetchNotices(nextPage, true);
    setCurrentPage(nextPage);
  }, [currentPage, fetchNotices]);

  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => !hiddenNotices.includes(n._id))
      .filter((n) => (filter === "unread" ? !n.isRead : true));
  }, [notices, hiddenNotices, filter]);

  const unreadCount = useMemo(() => {
    return notices.filter((n) => !n.isRead && !hiddenNotices.includes(n._id))
      .length;
  }, [notices, hiddenNotices]);

  return (
    <div className="dark:bg-background-dark min-h-screen ">
      <div className="py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t("notification")}{" "}
              {unreadNumber > 0 && (
                <span className="text-base md:text-lg font-normal text-gray-500 dark:text-gray-400">
                  ({unreadNumber} {t("unread")})
                </span>
              )}
            </h1>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAllRead}
              className="text-primary font-semibold text-sm md:text-base transition-colors disabled:opacity-50 self-start sm:self-auto"
            >
              {markingAllRead ? (
                <span className="flex items-center">
                  <FiRefreshCw className="animate-spin mr-2" />
                  {t("marking")}
                </span>
              ) : (
                t("markAllAsRead")
              )}
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
              {t("view")}
            </span>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all ${
                filter === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {t("all")}
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all ${
                filter === "unread"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {t("unreadFilter")}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading && notices.length === 0 ? (
            <div className="py-12">
              <Loading />
            </div>
          ) : filteredNotices.length > 0 ? (
            <>
              {filteredNotices.map((notice, index) => (
                <NoticeCard
                  key={notice._id}
                  notice={notice}
                  isExpanded={Boolean(expandedNotices[notice._id])}
                  onToggle={handleToggleNotice}
                  onHide={handleHideNotice}
                  index={index}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-white dark:bg-[#161616] rounded-lg shadow-sm">
              <FiInbox className="mx-auto text-gray-300 dark:text-gray-600 text-5xl sm:text-6xl mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {t("noNotifications")}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
                {t("allCaughtUp")}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && filteredNotices.length > 0 && (
            <div className="pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full py-3 text-sm sm:text-base font-semibold text-primary bg-white dark:bg-[#161616] hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? t("loading") : t("loadMore")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
