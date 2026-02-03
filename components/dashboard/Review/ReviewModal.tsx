"use client";

import { submitProductReview } from "@/services/orderService";
import { useAuthStore } from "@/zustand/authStore";
import React, { useState } from "react";
import { FiStar } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  productId: string;
  onSuccess: () => void;
};

export default function ReviewModal({
  isOpen,
  onClose,
  orderId,
  productId,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await submitProductReview(
        {
          orderId,
          productId,
          rating,
          comment,
        },
        { token: token ?? undefined },
      );

      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentRating = hoverRating ?? rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-background-dark p-4 border border-gray-200 dark:border-[#303030]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Write a review
        </h3>

        <div className="mt-4 space-y-4">
          {/*  Star Rating */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Rating
            </label>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} star`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                >
                  <FiStar
                    className={`w-6 h-6 transition-colors ${
                      star <= currentRating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/*  Comment */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience..."
              className="
    mt-1 w-full rounded-md
    border border-gray-200 dark:border-[#303030]
    bg-transparent px-3 py-2 text-sm
    focus:outline-none
    focus:ring-2 focus:ring-primary
    focus:border-primary
  "
            />
          </div>
        </div>

        <div className=" flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-[#303030]"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white disabled:opacity-60"
            disabled={submitting || rating === 0}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
