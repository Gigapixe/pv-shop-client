"use client";
import CategoryToggleButton from "./CategoryToggleButton";
import NavLinks from "./NavLinks";
import ThemeToggle from "@/lib/ThemeToggle";
import AuthStatus from "./AuthStatus";
import FullLogo from "@/components/ui/FullLogo";
import CartButton from "./CartButton";
import Searchbar from "./Searchbar";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/zustand/authStore";
import NotificationBell from "./NotificationBell";
import Support from "@/components/dashboard/Support";
import { WishlistButton } from "./WishlistButton";
import CurrencyDropdown from "@/components/ui/currency/CurrencyDropdown";
import LanguageDropdown from "@/components/ui/language/LanguageDropdown";
import SearchIcon from "@/public/icons/SearchIcon";
import { useEffect, useState } from "react";
import SearchBar from "./Searchbar";
import SearchCloseIcon from "@/public/icons/SearchCloseIcon";
import Link from "next/link";
import WalletIcon from "@/public/icons/user/WalletIcon";
import CurrencyDisplay from "@/components/ui/currency/CurrencyDisplay";

export default function Header() {
  const { user: userInfo, _hasHydrated, token } = useAuthStore();
  const pathname = usePathname();
  const isUserRoute = pathname?.startsWith("/user");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getFirstName = (fullName?: string) => {
    if (!fullName) return null;
    const first = String(fullName).trim().split(" ")[0];
    return first ? first.charAt(0).toUpperCase() + first.slice(1) : null;
  };

  useEffect(() => {
    if (isSearchOpen) setIsSearchOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`${
        isUserRoute ? "relative" : "sticky"
      } top-0 z-20 w-full shadow-sm bg-background-light dark:bg-background-dark`}
    >
      <div className={`${isUserRoute ? "px-4" : "container mx-auto"}`}>
        <div className="flex items-center justify-between gap-10 py-4">
          <div className="lg:block hidden">
            {isUserRoute ? (
              /* While auth store rehydrates don't show the logo (avoids flash). Keep a spacer to prevent layout shift */
              !_hasHydrated ? (
                <div className="w-36 h-8" aria-hidden="true" />
              ) : userInfo ? (
                <div className="flex flex-col">
                  <span className="text-sm">Welcome Back</span>
                  <span className="text-2xl font-medium ">
                    {getFirstName(userInfo.name)}
                  </span>
                </div>
              ) : (
                <FullLogo />
              )
            ) : (
              <FullLogo />
            )}
          </div>
          <MobileMenu userInfo={userInfo} token={token} />
          <div className="hidden lg:block lg:flex-1 ">
            <Searchbar />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden text-content-subtle hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
            >
              <SearchIcon className="w-6" />
            </button>
            <div>
              <Support />
            </div>
            {userInfo && (
              <div className="hidden lg:flex">
                <NotificationBell userInfo={userInfo} token={token} />
              </div>
            )}

            <div className="hidden lg:flex">
              <CartButton />
            </div>
            {userInfo && (
              <div className="hidden lg:flex">
                <WishlistButton />
              </div>
            )}
            {userInfo && userInfo.balance != null && (
              <Link href="/user/my-wallet">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#E8F8F3] hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 dark:border dark:border-emerald-800/50 dark:shadow-lg dark:shadow-emerald-900/20 transition-colors duration-200 cursor-pointer">
                  <WalletIcon fill="none" className="w-5 h-5" />
                  <span className="text-sm font-medium flex items-center whitespace-nowrap">
                    <CurrencyDisplay amount={userInfo.balance} />
                  </span>
                </div>
              </Link>
            )}

            <AuthStatus />
          </div>
        </div>
      </div>
      {/* Search Bar */}
      {isSearchOpen && (
        <div className="search-container mt-4 mx-4">
          <div className="relative">
            <SearchBar view="w-full" />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-1/2 top-20 bg-gray-100 dark:bg-gray-700 rounded-full p-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <SearchCloseIcon className={"w-3 h-3"} />
            </button>
          </div>
        </div>
      )}

      {/* Blur Overlay */}
      {isSearchOpen && (
        <div
          className="fixed left-0 right-0 top-0 bottom-0 bg-black/10 backdrop-blur-[2px] -z-10 transition-opacity duration-200"
          onClick={() => {
            setIsSearchOpen(false);
          }}
        />
      )}

      {/* desktop nav */}
      <div className="bg-primary lg:block hidden ">
        <div className={`${isUserRoute ? "" : "container mx-auto"}`}>
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2">
              <CategoryToggleButton />
              <div className="xl:hidden">
                <NavLinks />
              </div>
            </div>
            <div className="hidden xl:flex">
              <NavLinks />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="h-5 border-l border-white"></span>
              <LanguageDropdown />
              <span className="h-5 border-l border-white"></span>
              <CurrencyDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
