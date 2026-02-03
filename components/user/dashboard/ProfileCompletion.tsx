"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ProfileCompletionModal from "@/components/modal/ProfileCompletionModal";
import { useAuthStore } from "@/zustand/authStore";
import { getProfileCompletionStatus } from "@/services/customerService";

interface ProfileCompletionProps {
  onStatus?: (isComplete: boolean) => void;
}

type CompletionAPIResponse = {
  success?: boolean;
  data?: {
    completionPercentage?: number;
    missingFields?: string[];
  } | null;
};

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onStatus }) => {
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
  // SVG icons
  const ShieldIcon = (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      <path
        d="M12 2L3 6.5V11.5C3 17.5 7.5 21 12 22C16.5 21 21 17.5 21 11.5V6.5L12 2Z"
        stroke="#ff4d4f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11V15"
        stroke="#ff4d4f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="8" r="1" fill="#ff4d4f" />
    </svg>
  );
  const ArrowIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ml-2"
    >
      <path
        d="M5 12H19"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L19 12L12 19"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
  // Add profilePicture to required if missing
  const missing = [...missingFields];
  // Profile picture is not required, do not add to missing fields
  // Split missing into two columns
  const mid = Math.ceil(missing.length / 2);
  const col1 = missing.slice(0, mid);
  const col2 = missing.slice(mid);
  return (
    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg shadow-lg dark:bg-red-900/20 dark:border-red-700 dark:shadow-lg">
      <div className="flex items-center mb-2">
        {ShieldIcon}
        <span className="font-semibold text-lg">Profile Incomplete</span>
      </div>
      <div className="mb-2 text-sm">
        Your profile is only{" "}
        <span className="text-[#ff4d4f] font-bold">{profilePercent}%</span>{" "}
        complete. Please update your profile to continue.
      </div>
      <div className="mb-3 text-sm font-medium">Missing information:</div>
      <div className="flex gap-8 mb-4">
        <ul className="list-disc pl-5 text-sm space-y-1">
          {col1.map((field) => (
            <li key={field}>{fieldNames[field] || field}</li>
          ))}
        </ul>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {col2.map((field) => (
            <li key={field}>{fieldNames[field] || field}</li>
          ))}
        </ul>
      </div>
      <Button
        onClick={() => setModalOpen(true)}
        btnType="custom"
        className="inline-flex items-center justify-center bg-[#e13c3e]/95 hover:bg-[#e13c3e] text-white font-semibold rounded-lg px-4 py-2 lg:px-6 lg:py-3 transition-colors w-fit self-start mt-2 text-xs lg:text-base"
      >
        Complete Profile Now
        {ArrowIcon}
      </Button>

      <ProfileCompletionModal
        open={modalOpen}
        missingFields={missingFields}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ProfileCompletion;
