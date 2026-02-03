"use client";

import Link from "next/link";
import { RiLogoutBoxRLine } from "react-icons/ri";
import {
  getNavItems,
  type NavItem as SharedNavItem,
} from "@/components/user/navData";
import { useTranslations } from "next-intl";

type NavItem = SharedNavItem;

interface Props {
  items?: NavItem[];
  activePath?: string | null;
  onClose?: () => void;
  onLogout?: () => void;
}

export default function UserNavLinks({
  items,
  activePath,
  onClose,
  onLogout,
}: Props) {
  const t = useTranslations("user.nav");
  const common = useTranslations("common");
  const list = items || getNavItems(t);

  return (
    <div className="py-2">
      {list.map((item) => {
        const active = activePath === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2.5 text-sm transition-colors duration-150 font-semibold w-full ${
              active
                ? "bg-primary/10 text-primary"
                : "text-[#6B7280] dark:text-[#E5E5E5] hover:bg-[#FAFAFA] dark:hover:bg-gray-800"
            }`}
            onClick={onClose}
          >
            {item.icon ? (
              <item.icon
                className={`w-5 h-5 mr-3 shrink-0 ${
                  active ? "text-primary" : "text-gray-500 dark:text-gray-400"
                }`}
              />
            ) : (
              <span className="w-5 h-5 mr-3 shrink-0" />
            )}
            <span className={`text-base ${active ? "font-semibold" : ""}`}>
              {item.name}
            </span>
          </Link>
        );
      })}

      <button
        onClick={() => onLogout && onLogout()}
        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
      >
        <RiLogoutBoxRLine className="w-5 h-5 mr-3 shrink-0" />
        <span className="text-base">{common("logout")}</span>
      </button>
    </div>
  );
}
