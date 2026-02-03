"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuthStore } from "@/zustand/authStore";
import { getNavGroups } from "@/components/user/navData";
import { useTranslations } from "next-intl";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  onClose?: () => void;
}

const UserSideNavLink = ({ onClose }: Props) => {
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const t = useTranslations("user.nav");
  const common = useTranslations("common");
  const groups = getNavGroups(t);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    router.push("/");
  };

  return (
    <>
      <nav className="flex flex-col gap-6 mt-4">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <h2 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              {group.title}
            </h2>
            <hr className="border-gray-200 dark:border-[#1F1F1F]" />
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`rounded-full text-sm font-medium transition-colors pl-4 pr-2 py-2 flex items-center justify-between gap-2 h-11
                    ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-[#1F1F1F] text-gray-700 dark:text-gray-300"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon ? (
                      <item.icon className={isActive ? "text-primary" : ""} />
                    ) : (
                      <span />
                    )}
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="p-2 bg-primary rounded-full">
                      <FaArrowRight className="text-white" size={12} />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Logout button */}
        <div className="flex flex-col mt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 mb-6"
          >
            <RiLogoutBoxRLine className="w-5 h-5" /> {common("logout")}
          </button>
        </div>
      </nav>

      {/* Simple Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#121212] rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("logoutConfirmTitle")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("logoutConfirmMessage")}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F1F] rounded-lg transition-colors"
              >
                {common("cancel")}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                {common("logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSideNavLink;
