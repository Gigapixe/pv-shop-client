import { apiFetch } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOpts = {
  cache?: RequestCache;
  next?: { revalidate?: number | false };
};

export interface Notice {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export type NoticesApiResponse = {
  status: "success" | "error";
  data: {
    notices: Notice[];
    totalNotices?: number;
    page?: number;
    totalPages?: number;
    hasNextPage?: boolean;
  };
  message?: string;
};

const buildQuery = (params: Record<string, any> = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (key === "startDate" || key === "endDate") {
      const d = value instanceof Date ? value : new Date(value);
      query.append(key, d.toISOString());
    } else {
      query.append(key, String(value));
    }
  });

  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

const NoticeServices = {
  getActiveNotice(opts?: FetchOpts & { token?: string }) {
    const url = `${API_BASE}/notice/active`;
    return apiFetch<any>(url, {
      token: opts?.token,
      cache: opts?.cache ?? "no-store",
      next: opts?.next,
    });
  },

  getUserNotices(
    params: { page?: number; limit?: number } = {},
    opts?: FetchOpts & { token?: string },
  ) {
    const url = `${API_BASE}/notice/user${buildQuery(params)}`;

    // ✅ FIXED: use NoticesApiResponse
    return apiFetch<NoticesApiResponse>(url, {
      token: opts?.token,
      cache: opts?.cache ?? "no-store",
      next: opts?.next,
    });
  },

  // Get unread count by fetching a large page of notices and counting locally.
  // TODO: Once backend implements GET /notice/unread-count, switch to that endpoint
  // for better performance instead of fetching full notice list.
  async getUnreadCount(opts?: FetchOpts & { token?: string }) {
    try {
      const res = await this.getUserNotices({ page: 1, limit: 100 }, opts);
      const notices = res?.data?.notices ?? [];
      const unread = notices.filter((n) => !n.isRead).length;
      return { status: "success" as const, data: { unreadCount: unread } };
    } catch (err) {
      // Return 0 on error to avoid breaking UI
      console.error("Failed to fetch unread count:", err);
      return { status: "error" as const, data: { unreadCount: 0 } };
    }
  },

  markAsRead(id: string, opts?: FetchOpts & { token?: string }) {
    const url = `${API_BASE}/notice/read/${id}`;
    return apiFetch<any>(url, {
      method: "PUT",
      token: opts?.token,
      cache: opts?.cache ?? "no-store",
      next: opts?.next,
    });
  },

  markAllAsRead(opts?: FetchOpts & { token?: string }) {
    const url = `${API_BASE}/notice/read-all`;
    return apiFetch<any>(url, {
      method: "PUT",
      token: opts?.token,
      cache: opts?.cache ?? "no-store",
      next: opts?.next,
    });
  },
};

export default NoticeServices;
