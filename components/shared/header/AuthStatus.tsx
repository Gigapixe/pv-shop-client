"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/zustand/authStore";
import UserIcon from "@/public/icons/navbar/UserIcon";
import UserNavLinks from "@/components/user/UserNavLinks";

export default function AuthStatus() {
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const router = useRouter();

  const clearCloseTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const scheduleClose = (delay = 200) => {
    clearCloseTimeout();
    timeoutRef.current = window.setTimeout(() => setIsOpen(false), delay);
  };

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push("/");
  };

  // Show a placeholder while hydrating to prevent flicker
  if (!_hasHydrated) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href={`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`}
          className="text-gray-600 hover:text-gray-800"
        >
          <UserIcon />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <div
        className={`flex items-center gap-3 ${
          isOpen ? "ring-2 ring-primary ring-offset-2" : ""
        } rounded-full bg-background-subtle hover:bg-background-muted dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/10 transition duration-200 cursor-pointer`}
        onClick={() => setIsOpen((s) => !s)}
        onMouseEnter={() => {
          if (!isMobile) {
            clearCloseTimeout();
            setIsOpen(true);
          }
        }}
        onMouseLeave={() => !isMobile && scheduleClose()}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user?.name || user?.email || "User"}
            width={406}
            height={406}
            className="rounded-full object-cover h-9 w-9"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-medium">
            {String(user?.name ?? user?.email ?? "U")
              .trim()
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right"
          onMouseEnter={() => clearCloseTimeout()}
          onMouseLeave={() => scheduleClose()}
        >
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-[#141414] dark:ring-white/10 dark:border dark:border-[#303030]">
            <div className="p-4 border-b border-border-light dark:border-border-dark">
              <div className="grid grid-cols-[60px_1fr] items-center">
                {user?.image ? (
                  <div className="relative w-12 h-12">
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={400}
                      height={400}
                      className="rounded-full object-cover h-12 w-12"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg font-medium">
                    {String(user?.name ?? "U")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-sm text-[#161616] dark:text-[#FFFFFF]">
                    {user?.name}
                  </h4>
                  <p className="text-xs text-[#6B7280] dark:text-[#E5E5E5]">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <UserNavLinks
                activePath={pathname}
                onClose={() => setIsOpen(false)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
