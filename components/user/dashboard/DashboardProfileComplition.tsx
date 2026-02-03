"use client";
import React, { useEffect, useState } from "react";
import ProfileCompletionModal from "@/components/modal/ProfileCompletionModal";
import { useAuthStore } from "@/zustand/authStore";
import { getProfileCompletionStatus } from "@/services/customerService";
import { FiUser, FiArrowRight } from "react-icons/fi";

interface DashboardProfileComplitionProps {
  onStatus?: (isComplete: boolean) => void;
}

type CompletionAPIResponse = {
  success?: boolean;
  data?: {
    completionPercentage?: number;
    missingFields?: string[];
  } | null;
};

const DashboardProfileComplition: React.FC<DashboardProfileComplitionProps> = ({
  onStatus,
}) => {
  const user = useAuthStore((s) => s.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePercent, setProfilePercent] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      if (!user?._id) return;

      try {
        const response = (await getProfileCompletionStatus(
          user._id,
        )) as CompletionAPIResponse;

        if (response?.success && response?.data) {
          const { completionPercentage, missingFields: apiMissingFields } =
            response.data;

          setProfilePercent(completionPercentage || 0);

          // Map API field names to internal field names
          const fieldMapping: Record<string, string> = {
            Address: "address",
            City: "city",
            Country: "country",
            State: "state",
            Zip: "zip",
            "ZIP Code": "zip",
            PostCode: "zip",
          };

          const mappedFields = (apiMissingFields || []).map(
            (field: string) => fieldMapping[field] || field.toLowerCase(),
          );

          setMissingFields(mappedFields);
        }
      } catch (error) {
        console.error("Error fetching profile completion status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCompletion();
  }, [user?._id]);

  const isProfileComplete = profilePercent >= 100 || missingFields.length === 0;

  // Notify parent about completion status
  useEffect(() => {
    if (onStatus && !loading) onStatus(isProfileComplete);
  }, [isProfileComplete, onStatus, loading]);

  if (loading || profilePercent >= 100) return null;

  // Map missing fields to display names
  const fieldNames: Record<string, string> = {
    address: "Address",
    city: "City",
    country: "Country",
    state: "State",
    zip: "ZIP Code",
  };

  const handleModalSuccess = async () => {
    // Refresh profile completion status after update
    if (!user?._id) return;

    try {
      const response = (await getProfileCompletionStatus(
        user._id,
      )) as CompletionAPIResponse;
      if (response?.success && response?.data) {
        const { completionPercentage, missingFields: apiMissingFields } =
          response.data;
        setProfilePercent(completionPercentage || 0);

        const fieldMapping: Record<string, string> = {
          Address: "address",
          City: "city",
          Country: "country",
          State: "state",
          Zip: "zip",
          "ZIP Code": "zip",
          PostCode: "zip",
        };

        const mappedFields = (apiMissingFields || []).map(
          (field: string) => fieldMapping[field] || field.toLowerCase(),
        );

        setMissingFields(mappedFields);
      }
    } catch (error) {
      console.error("Error refreshing profile completion status:", error);
    }

    setModalOpen(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Complete Your Profile
              </h2>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                {profilePercent}% Completed
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${profilePercent}%` }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-[#FAFAFA] dark:bg-[#161616] border border-[#DBDBDB] dark:border-border-dark rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Fill in the remaining details to unlock full access and
              personalized support
            </p>

            {/* Missing Fields */}
            <div className="flex flex-wrap items-center gap-3">
              {missingFields.map((field, index) => (
                <div
                  key={field}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="bg-primary/20 rounded-full p-0.5">
                    <FiArrowRight className="text-emerald-500 dark:text-emerald-400 w-4 h-4" />
                  </span>
                  <span className="font-medium">
                    {fieldNames[field] || field}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 pl-4 py-2 pr-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Complete My Profile
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <FiArrowRight className="-rotate-45 text-primary w-5 h-5" />
            </div>
          </button>
        </div>
      </div>

      <ProfileCompletionModal
        open={modalOpen}
        missingFields={missingFields}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default DashboardProfileComplition;
