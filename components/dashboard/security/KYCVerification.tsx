"use client";

import { JSX, useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { useKYCVerification } from "./useKYCVerification";

type VerificationStatusType = "pending" | "approved" | "rejected" | "expired" | string;

type VerificationHistoryItem = {
  createdAt: string | Date;
  status: VerificationStatusType;
  referenceId: string;
};

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4 dark:bg-gray-800 dark:p-6 dark:rounded-lg">
    <div className="h-8 bg-gray-200 rounded w-1/3 dark:bg-gray-700" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700" />
      <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700" />
      <div className="h-4 bg-gray-200 rounded w-2/3 dark:bg-gray-700" />
    </div>
    <div className="h-10 bg-gray-200 rounded dark:bg-gray-700" />
  </div>
);

const StatusBadge: React.FC<{ status: VerificationStatusType }> = ({ status }) => {
  const statusClasses: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    expired: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  const safeStatus = typeof status === "string" ? status : String(status);

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusClasses[safeStatus] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {safeStatus ? safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1) : "Unknown"}
    </span>
  );
};

type VerificationStatusProps = {
  status: VerificationStatusType;
  createdAt?: string | Date | null;
  onRetry: () => void;
};

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  createdAt,
  onRetry,
}) => {
  const statusMessages: Record<string, string> = {
    pending:
      "Your verification is being processed. This may take some time. If the status doesn't change within 1 hour, you can retry.",
    approved: "Your identity has been successfully verified.",
    rejected:
      "Your verification was rejected. Please try again with valid documents.",
    expired:
      "Your verification has expired or was cancelled. Please start a new verification process.",
  };

  const isPendingForTooLong = (): boolean => {
    if (status === "pending" && createdAt) {
      const oneHourInMilliseconds = 60 * 60 * 1000;
      const created = createdAt instanceof Date ? createdAt : new Date(createdAt);
      if (Number.isNaN(created.getTime())) return false;
      return Date.now() - created.getTime() > oneHourInMilliseconds;
    }
    return false;
  };

  return (
    <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
      <h3 className="text-lg font-medium mb-2 dark:text-white">Verification Status</h3>
      <div className="flex items-center mb-2">
        <span className="mr-2">Current status:</span>
        <StatusBadge status={status} />
      </div>
      <p
        className={`text-sm ${
          status === "approved"
            ? "text-green-600 dark:text-green-400"
            : status === "rejected" || status === "expired"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {statusMessages[String(status)] || "Unknown verification status."}
      </p>

      {isPendingForTooLong() && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center items-center text-sm dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          Retry Verification
        </button>
      )}
    </div>
  );
};

type UseKYCVerificationReturn = {
  isLoading: boolean;
  verificationStatus: VerificationStatusType | null | undefined;
  verificationHistory: VerificationHistoryItem[];
  showForm: boolean;
  initiateVerification: (args: { callbackUrl: string }) => Promise<void>;
  latestVerificationCreatedAt?: string | Date | null;
};

export default function KYCVerification(): JSX.Element {
  const {
    isLoading,
    verificationStatus,
    verificationHistory,
    showForm,
    initiateVerification,
    latestVerificationCreatedAt,
  } = useKYCVerification() as UseKYCVerificationReturn;

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const onSubmit = async (): Promise<void> => {
    setIsButtonLoading(true);
    try {
      await initiateVerification({
        callbackUrl: "https://gamingty.com/user/security",
      });
    } catch {
      toast.error("KYC verification failed");
    } finally {
      setIsButtonLoading(false);
    }
  };

  if (isLoading && !isButtonLoading && !verificationStatus) {
    return (
      <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-lg dark:border dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">
        Identity Verification (KYC)
      </h2>

      {verificationStatus ? (
        <VerificationStatus
          status={verificationStatus}
          createdAt={latestVerificationCreatedAt ?? null}
          onRetry={onSubmit}
        />
      ) : null}

      {showForm ? (
        <div
          className="p-6 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        >
          <h3 className="text-xl font-medium mb-4 dark:text-white">
            Start New Verification
          </h3>

          <div className="space-y-4">
            <div className="pt-4">
              <button
                type="button"
                onClick={onSubmit}
                disabled={isButtonLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 ${
                  isButtonLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isButtonLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                {isButtonLoading ? "Initiating..." : "Start Verification"}
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
            <p>
              By proceeding with verification, you agree to share your personal
              information with our verification partner ShuftiPro.
            </p>
          </div>
        </div>
      ) : null}

      {verificationHistory?.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3 dark:text-white">
            Verification History
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    Reference ID
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {verificationHistory.map((verification, index) => {
                  const created =
                    verification.createdAt instanceof Date
                      ? verification.createdAt
                      : new Date(verification.createdAt);

                  return (
                    <tr key={`${verification.referenceId}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {Number.isNaN(created.getTime())
                          ? "-"
                          : created.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={verification.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {verification.referenceId}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
