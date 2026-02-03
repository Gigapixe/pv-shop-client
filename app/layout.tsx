import type { Metadata } from "next";
import { Suspense } from "react";
import TopLoader from "@/components/shared/TopLoader";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";

import "./globals.css";
import { WishlistProvider } from "./context/WishlistContext";

export const metadata: Metadata = {
  title: "Gamingty",
  description: "Your Ultimate Gaming Hub",
};

const themeScript = `
(function () {
  try {
    const raw = localStorage.getItem("gamingty-theme");
    const theme = raw ? JSON.parse(raw)?.state?.theme : "dark";

    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        theme = parsed?.state?.theme || theme; // "dark" | "light" | "system"
      } catch (e) {}
    }

    var root = document.documentElement;
    root.classList.remove("dark");

    // Optional: support "system"
    if (theme === "system") {
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark");
      root.style.colorScheme = prefersDark ? "dark" : "light";
      return;
    }

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.style.colorScheme = "light";
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning={true}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider >
          <WishlistProvider>
            {" "}
            <Suspense fallback={null}>
              <TopLoader />
            </Suspense>
            {children}
            {/* Global toast container */}
            <Toaster />
          </WishlistProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
