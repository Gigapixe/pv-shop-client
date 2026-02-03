import {
  getKycVerificationHistory,
  getKycVerificationStatus,
  initiateKycVerification,
} from "@/services/shuftiProServices";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/** ---- Types ---- */
export type KYCStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "failed"
  | string;

export interface VerificationHistoryItem {
  referenceId: string;
  status: KYCStatus;
  createdAt: string;
  event?: string;
}

export interface VerificationHistoryResponse {
  status: "success" | "error";
  message?: string;
  data: VerificationHistoryItem[];
}

export interface VerificationStatusResponse {
  status: "success" | "error";
  message?: string;
  data: {
    status: KYCStatus;
    event?: string;
    createdAt?: string;
  };
}

export interface InitiateVerificationPayload {
  callbackUrl: string;
}

export interface InitiateVerificationResponse {
  status: "success" | "error";
  message?: string;
  data: {
    referenceId: string;
    redirectUrl?: string;
  };
}

export interface KYCStatusUpdatedDetail {
  referenceId: string;
  status: KYCStatus;
  event?: string;
  createdAt?: string;
}

/** ---- Window augmentation for the global poller ---- */
declare global {
  interface Window {
    __KYC_POLLER__?: {
      interval?: number;
      inFlight: boolean;
    };
  }
}

/** ---- Helpers ---- */
const isAdminManualRef = (ref?: string | null): boolean =>
  !!ref && ref.startsWith("ADMIN_MANUAL_");

const isAxiosLikeError = (
  err: unknown,
): err is { response?: { data?: { message?: string } } } =>
  typeof err === "object" && err !== null && "response" in err;

/** ---- Hook ---- */
export function useKYCVerification() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationStatus, setVerificationStatus] =
    useState<KYCStatus | null>(null);
  const [verificationHistory, setVerificationHistory] = useState<
    VerificationHistoryItem[]
  >([]);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [currentReferenceId, setCurrentReferenceId] = useState<string | null>(
    null,
  );
  const [latestVerificationCreatedAt, setLatestVerificationCreatedAt] =
    useState<string | null>(null);

  const fetchVerificationHistory = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response =
        (await getKycVerificationHistory()) as VerificationHistoryResponse;

      if (response.status === "success") {
        const list = response.data ?? [];

        if (list.length > 0) {
          setVerificationHistory(list);

          const latestVerification = list[0];
          setCurrentReferenceId(latestVerification.referenceId);
          setLatestVerificationCreatedAt(latestVerification.createdAt);

          const currentStatus = latestVerification.status;
          setVerificationStatus(currentStatus);

          // Hide form if approved or pending
          setShowForm(
            !(currentStatus === "approved" || currentStatus === "pending"),
          );

          // Start polling only for non-manual pending
          if (
            currentStatus === "pending" &&
            !isAdminManualRef(latestVerification.referenceId)
          ) {
            void startStatusPolling(latestVerification.referenceId);
          }
        } else {
          // No history -> show form
          setShowForm(true);
          setVerificationStatus(null);
          setLatestVerificationCreatedAt(null);
          setCurrentReferenceId(null);
        }
      } else {
        toast.error(response.message || "Failed to fetch verification history");
        setShowForm(true);
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("Error fetching verification history:", error);
      toast.error(
        isAxiosLikeError(error)
          ? error.response?.data?.message ||
              "Failed to fetch verification history"
          : "Failed to fetch verification history",
      );
      setShowForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const startStatusPolling = async (
    referenceId: string,
  ): Promise<(() => void) | void> => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem("kyc_pending_reference", referenceId);

      if (!window.__KYC_POLLER__) {
        window.__KYC_POLLER__ = { inFlight: false };

        window.__KYC_POLLER__.interval = window.setInterval(async () => {
          const ref = window.localStorage.getItem("kyc_pending_reference");
          if (!ref) return;
          if (window.__KYC_POLLER__?.inFlight) return;

          if (window.__KYC_POLLER__) window.__KYC_POLLER__.inFlight = true;

          try {
            const response = (await getKycVerificationStatus(
              ref,
            )) as VerificationStatusResponse;

            if (response.status === "success") {
              const { status, event, createdAt } = response.data;

              window.dispatchEvent(
                new CustomEvent<KYCStatusUpdatedDetail>("kycStatusUpdated", {
                  detail: { referenceId: ref, status, event, createdAt },
                }),
              );

              if (status !== "pending") {
                window.localStorage.removeItem("kyc_pending_reference");
              }
            } else {
              // eslint-disable-next-line no-console
              console.warn("KYC poll API returned error:", response.message);
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Global KYC poll error:", err);
          } finally {
            if (window.__KYC_POLLER__) window.__KYC_POLLER__.inFlight = false;
          }
        }, 10_000);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Failed to start global KYC poller:", err);
    }

    // Cleanup function removes the pending reference
    return () => {
      try {
        window.localStorage.removeItem("kyc_pending_reference");
      } catch {
        // ignore
      }
    };
  };

  const initiateVerification = async (
    data: InitiateVerificationPayload,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = (await initiateKycVerification(
        data,
      )) as InitiateVerificationResponse;

      if (response.status === "success") {
        const ref = response.data.referenceId;

        setCurrentReferenceId(ref);
        setLatestVerificationCreatedAt(new Date().toISOString());
        setVerificationStatus("pending");
        setShowForm(false);

        setVerificationHistory((prev) => [
          {
            referenceId: ref,
            status: "pending",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);

        if (!isAdminManualRef(ref)) {
          void startStatusPolling(ref);
        }

        if (response.data.redirectUrl && typeof window !== "undefined") {
          window.location.href = response.data.redirectUrl;
        }
      } else {
        toast.error(response.message || "Failed to initiate verification");
        setShowForm(true);
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      toast.error("Error initiating verification: " + (error as Error).message);

      setShowForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchVerificationHistory();

    const handler = (evt: Event) => {
      const e = evt as CustomEvent<KYCStatusUpdatedDetail>;
      const { referenceId, status, event, createdAt } =
        e.detail || ({} as KYCStatusUpdatedDetail);
      if (!referenceId) return;

      setVerificationHistory((prev) =>
        prev.map((verification) =>
          verification.referenceId === referenceId
            ? {
                ...verification,
                status,
                event,
                createdAt: createdAt ?? verification.createdAt,
              }
            : verification,
        ),
      );

      setVerificationStatus(status);
      if (createdAt) setLatestVerificationCreatedAt(createdAt);

      if (status === "approved") setShowForm(false);
      if (["rejected", "expired", "failed"].includes(String(status)))
        setShowForm(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("kycStatusUpdated", handler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("kycStatusUpdated", handler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    verificationStatus,
    verificationHistory,
    showForm,
    currentReferenceId,
    latestVerificationCreatedAt,
    initiateVerification,
    fetchVerificationHistory,
  };
}
