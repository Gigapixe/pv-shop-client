"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FullLogo from "@/components/ui/FullLogo";
import NavLinks from "./NavLinks";
import { useAuthStore } from "@/zustand/authStore";
import CartIcon from "@/public/icons/CartIcon";
import ThemeToggle from "@/lib/ThemeToggle";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const { user: userInfo, _hasHydrated, token } = useAuthStore();
  const pathname = usePathname();
  const isUserRoute = pathname?.startsWith("/user");

  const getFirstName = (fullName?: string) => {
    if (!fullName) return null;
    const first = String(fullName).trim().split(" ")[0];
    return first ? first.charAt(0).toUpperCase() + first.slice(1) : null;
  };

  return (
    <> <header className={`${isUserRoute ? "relative" : "sticky"} top-0 z-30 w-full hidden lg:block bg-background dark:bg-background-dark`}>
      <div className={`${isUserRoute ? "px-4" : "container mx-auto"} py-3`}>
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <FullLogo />
          </Link>

          {/* Center: Desktop Links */}
          <div className="flex-1 flex justify-center">
            <NavLinks />
          </div>

          <div>
            <ThemeToggle />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Login / Account pill */}
              {!_hasHydrated ? (
                <div className="h-9 w-24 rounded-full bg-gray-100" aria-hidden="true" />
              ) : userInfo ? (
                <Link
                  href="/user"
                  className="rounded-full border border-primary px-8 py-2 text-[18px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition"
                >
                  {getFirstName(userInfo.name) ?? "Account"}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border border-primary px-8 py-2 flex items-center justify-center text-[18px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition"
                >
                  Login
                </Link>
              )}
              {/* Cart pill (replace with CartButton if you want) */}
              <div className="rounded-full flex items-center gap-1 border border-primary px-8 py-2 text-[18px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition">
                <CartIcon className="w-6 h-6" fill="none" />
                $0.00
              </div>

            </div>

            {/* On mobile show login/account quickly (optional) */}
            <div className="lg:hidden">
              {!_hasHydrated ? null : userInfo ? (
                <Link
                  href="/user"
                  className="rounded-full border border-primary px-8 py-2 text-[18px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition"
                >
                  {getFirstName(userInfo.name) ?? "Account"}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border border-primary px-8 py-2 flex items-center justify-center text-[18px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
      {/* Mobile menu (you already have) */}
      <div className="lg:hidden">
        <MobileMenu userInfo={userInfo} token={token} />
      </div></>
  );
}
