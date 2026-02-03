"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/zustand/authStore";
import { getKYCStatus } from "@/services/customerService";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

export default function UserProfile() {
  const { user, _hasHydrated, updateUserProfile } = useAuthStore();
  const hasFetchedKYC = useRef(false);

  // Fetch KYC status once when component mounts
  useEffect(() => {
    if (!_hasHydrated || !user || hasFetchedKYC.current) return;

    const fetchKYCStatus = async () => {
      try {
        hasFetchedKYC.current = true;
        const response = (await getKYCStatus()) as any;
        if (response?.data?.kycStatus) {
          updateUserProfile({ kycStatus: response.data.kycStatus });
        }
      } catch (error) {
        console.error("Failed to fetch KYC status:", error);
      }
    };

    fetchKYCStatus();
  }, [_hasHydrated, user, updateUserProfile]);

  if (!_hasHydrated) {
    return (
      <div className="w-full animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center gap-2 text-center">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
              {String(user.name ?? "U")
                .trim()
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>

        <hr className="border-border-light dark:border-border-dark w-full my-4" />

        {/* ID and Tier */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-1">
            <span className="text-gray-500 dark:text-gray-400">ID:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {user.userId}
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-500 dark:text-gray-400">Tier:</span>
            <span className="font-bold text-primary">
              {user.membershipTier}
            </span>
          </div>
        </div>
        <hr className="border-border-light dark:border-border-dark w-full mt-4" />

        {/* KYC Status */}
        <div className="flex justify-between items-center text-sm mt-4">
          <span className="text-gray-500 dark:text-gray-400">KYC Status:</span>
          {user.kycStatus ? (
            <span
              className={`font-bold text-xs capitalize ${
                user.kycStatus === "approved"
                  ? "text-primary"
                  : user.kycStatus === "pending"
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {user.kycStatus}
            </span>
          ) : (
            <span className="font-bold text-gray-500">Not Submitted</span>
          )}
        </div>
        {user.kycStatus !== "approved" && (
          <div className="flex justify-start mt-2">
            <Link
              href="/user/security"
              className="w-fit flex items-center gap-2 text-[#12B47E] text-sm font-medium underline"
            >
              Verify Now
              <MdArrowOutward className="w-4 h-4 mt-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
