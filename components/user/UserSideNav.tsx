"use client";

import FullLogo from "@/components/ui/FullLogo";
import UserProfile from "@/components/user/UserProfile";
import UserSideNavLink from "@/components/user/UserSideNavLink";

export default function UserSideNav() {
  return (
    <aside className="hidden lg:block sticky top-0 left-0 w-68 h-screen border-r border-gray-200 dark:border-[#1F1F1F] overflow-y-auto thin-scrollbar">
      {/* Logo */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-[#1F1F1F] mb-4 justify-center">
        <FullLogo />
      </div>

      <div className="px-4">
        {/* Profile Card */}
        <div className="border border-gray-200 dark:border-[#1F1F1F] p-4 rounded-2xl overflow-hidden dark:bg-[#232323] bg:-[#FDFDFD]">
          <UserProfile />
        </div>

        {/* Navigation Links */}
        <UserSideNavLink />
      </div>
    </aside>
  );
}
