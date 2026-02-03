"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { FiStar } from "react-icons/fi";

import Pagination from "@/components/ui/Pagination";
import type {
  ApiListResponse,
  Review,
  ReviewableItem,
  ReviewableOrder,
} from "@/types/reviews";
import {
  getProductReviews,
  getReviewableOrders,
} from "@/services/orderService";
import ReviewModal from "./ReviewModal";
import { useAuthStore } from "@/zustand/authStore";
import ReviewCard from "./ReviewCard";
import ReviewableCard from "./ReviewableCard";
import ReviewCardSkeleton from "./ReviewCardSkeleton";
import ReviewableCardSkeleton from "./ReviewableCardSkeleton";
import { useTranslations } from "next-intl";

// ✅ use your Select
import Select, { type SelectOption } from "@/components/ui/Select"; // adjust path if needed

type Tab = "pending" | "completed";
const FALLBACK_IMG = "/assets/wallet.jpeg";

export default function MyReviews() {
  const t = useTranslations("reviews");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewableProducts, setReviewableProducts] = useState<
    ReviewableItem[]
  >([]);

  const [page, setPage] = useState(1);

  // ✅ page size (rows/page)
  const [pageSize, setPageSize] = useState(12);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReviewableItem | null>(null);

  const { token } = useAuthStore();

  // ✅ request guard: only latest request can update state
  const requestIdRef = useRef(0);

  const hasAnyData = reviews.length > 0 || reviewableProducts.length > 0;

  const fetchAllData = async (opts?: { silent?: boolean }) => {
    const currentRequestId = ++requestIdRef.current;

    try {
      setError(null);

      // ✅ if token not ready, do NOT trigger loading flicker
      if (!token) {
        if (currentRequestId !== requestIdRef.current) return;
        setLoading(false);
        setReviews([]);
        setReviewableProducts([]);
        return;
      }

      // ✅ if silent refresh, don't show skeleton again (prevents flicker)
      if (!(opts?.silent && hasAnyData)) {
        setLoading(true);
      }

      const [reviewsRes, reviewableOrdersRes] = await Promise.all([
        getProductReviews({ token }) as Promise<ApiListResponse<Review>>,
        getReviewableOrders({ token }) as Promise<
          ApiListResponse<ReviewableOrder>
        >,
      ]);

      // ✅ ignore stale responses
      if (currentRequestId !== requestIdRef.current) return;

      const safeReviews = Array.isArray(reviewsRes?.data)
        ? reviewsRes.data
        : [];
      const orders = Array.isArray(reviewableOrdersRes?.data)
        ? reviewableOrdersRes.data
        : [];

      const flattened: ReviewableItem[] = orders.flatMap((order) =>
        (order.cart ?? []).map((product) => ({
          orderId: order._id,
          orderDate: order.createdAt,
          product: {
            _id: product._id,
            title: product.title,
            image: product.image,
            price: product.price,
          },
        })),
      );

      setReviews(safeReviews);
      setReviewableProducts(flattened);
    } catch (e: any) {
      console.error(e);
      if (currentRequestId !== requestIdRef.current) return;
      setError(e?.message ?? t("fetchError"));
    } finally {
      if (currentRequestId !== requestIdRef.current) return;
      setLoading(false);
    }
  };

  // ✅ fetch when token changes (hydration-safe + guarded)
  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ✅ reset to page 1 when tab or page size changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, pageSize]);

  const sourceData = activeTab === "pending" ? reviewableProducts : reviews;
  const total = sourceData.length;

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sourceData.slice(startIndex, endIndex);
  }, [sourceData, page, pageSize]);

  const openReviewModal = (item: ReviewableItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleReviewSuccess = async () => {
    setIsModalOpen(false);
    setSelectedItem(null);

    // ✅ refresh without flicker
    await fetchAllData({ silent: true });
  };

  const renderEmptyState = (title: string, message: string) => (
    <div className="text-center py-16">
      <div className="flex justify-center text-[#12B47E] text-6xl mb-4">
        <FiStar />
      </div>
      <h2 className="font-semibold text-xl text-[#161616] dark:text-[#FFFFFF]">
        {title}
      </h2>
      <p className="text-[#6B7280] dark:text-[#E5E5E5] mt-1">{message}</p>
    </div>
  );

  const rowOptions: SelectOption[] = useMemo(
    () => [
      { value: "12", label: t("rowsPerPage", { count: 12 }) },
      { value: "24", label: t("rowsPerPage", { count: 24 }) },
      { value: "36", label: t("rowsPerPage", { count: 36 }) },
    ],
    [t],
  );

  if (error) {
    return (
      <section aria-live="polite" className="text-center py-10">
        <p className="text-red-500 font-medium">{error}</p>
      </section>
    );
  }

  return (
    <div className="bg-[#FFF] dark:bg-[#161616] p-5 rounded-xl shadow-sm border border-[#DBDBDB] dark:border-[#303030]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 border-b-2 border-gray-100 dark:border-[#303030] pb-4 gap-3">
        <div className="flex items-center gap-3">
          <BsPencilSquare className="text-xl text-[#12B47E]" />
          <h2 className="text-xl md:text-2xl font-semibold text-[#161616] dark:text-[#FFFFFF]">
            {t("title")}
          </h2>
        </div>

        {/* ✅ rows/page with your Select */}
        <div>
          <Select
            value={String(pageSize)}
            onChange={(val) => setPageSize(Number(val))}
            options={rowOptions}
            searchable={false}
            placeholder={t("rowsPerPageLabel")}
            className="w-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-full bg-[#F3F4F6] dark:bg-[#1F1F1F] lg:flex lg:items-center lg:gap-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`w-full text-center px-2 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-colors ${
            activeTab === "pending"
              ? "bg-[#12B47E] text-white shadow"
              : "bg-transparent text-[#6B7280] dark:text-[#E5E5E5] hover:bg-white dark:hover:bg-background-dark"
          }`}
        >
          {t("pendingReviews", { count: reviewableProducts.length })}
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`w-full text-center px-2 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-colors ${
            activeTab === "completed"
              ? "bg-[#12B47E] text-white shadow"
              : "bg-transparent text-[#6B7280] dark:text-[#E5E5E5] hover:bg-white dark:hover:bg-background-dark"
          }`}
        >
          {t("completedReviews", { count: reviews.length })}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        activeTab === "pending" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <ReviewableCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        )
      ) : total === 0 ? (
        renderEmptyState(
          activeTab === "pending" ? t("noPendingTitle") : t("noCompletedTitle"),
          activeTab === "pending"
            ? t("noPendingMessage")
            : t("noCompletedMessage"),
        )
      ) : activeTab === "pending" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {(paginatedData as ReviewableItem[]).map((item) => (
            <ReviewableCard
              key={`${item.orderId}-${item.product._id}`}
              item={item}
              fallbackImg={FALLBACK_IMG}
              onWriteReview={openReviewModal}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(paginatedData as Review[]).map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              fallbackImg={FALLBACK_IMG}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          className="pt-6"
        />
      )}

      {/* Modal */}
      {selectedItem && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderId={selectedItem.orderId}
          productId={selectedItem.product._id}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
