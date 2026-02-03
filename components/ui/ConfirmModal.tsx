"use client";
import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
}

export default function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText,
}: ConfirmModalProps) {
  const resolvedTitle = title ?? "Are you sure?";
  const resolvedDescription = description ?? "This action cannot be undone.";
  const resolvedConfirmText = confirmText ?? "Confirm";

  // focus confirm button when modal opens, and handle ESC to cancel
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const el = confirmRef.current;
    el?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    // backdrop + modal (no transitions, no Dialog wrapper)
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/40"
        onMouseDown={onCancel}
        aria-hidden
      />

      {/* panel */}
      <div
        className="relative w-full max-w-sm rounded-lg bg-background dark:bg-background-dark p-6 shadow-lg border border-border-light dark:border-border-dark"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          id="confirm-modal-title"
          className="text-lg font-semibold flex items-center gap-2"
        >
          <WarningIcon fill="#F59E0B" className="w-5 h-5" /> {resolvedTitle}
        </div>

        <div id="confirm-modal-desc" className="text-sm mt-1">
          {resolvedDescription}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-md border border-border-light dark:border-border-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading ? `${resolvedConfirmText}...` : resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
