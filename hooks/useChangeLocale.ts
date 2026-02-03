"use client";

import { useTransition } from "react";
import { setLocale as setLocaleCookie } from "@/lib/locale";
import type { Locale } from "@/i18n";

/**
 * Client-side hook for changing locale
 * Returns a function to change locale and a loading state
 */
export function useChangeLocale() {
  const [isPending, startTransition] = useTransition();

  const changeLocale = (locale: Locale) => {
    startTransition(async () => {
      await setLocaleCookie(locale);
      // Force a full page refresh to apply the new locale
      window.location.reload();
    });
  };

  return {
    changeLocale,
    isPending,
  };
}
