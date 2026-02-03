"use client";

import { useSearchParams } from "next/navigation";
import { FaFacebookF } from "react-icons/fa";

// If you already have your own Button component, you can swap the <button> for it.
type Provider = "google" | "facebook" | "apple";

type Props = {
  className?: string;
  disabled?: boolean;

  /**
   * Where should the backend redirect back to after OAuth completes?
   * Example: "/auth/callback" or "/api/auth/callback" (depends on your backend setup)
   * If you don't use it, you can remove it.
   */
  callbackUrl?: string;

  /**
   * Storage key to store redirect path before leaving to OAuth provider.
   */
  redirectStorageKey?: string;

  /**
   * If you want to show only some providers:
   */
  providers?: Provider[];
};

const DEFAULT_PROVIDERS: Provider[] = ["facebook", "google", "apple"];

function getApiBaseUrl() {
  // Set NEXT_PUBLIC_API_BASE_URL in your env
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5055";
}

export default function SocialLoginButtons({
  className,
  disabled,
  callbackUrl,
  redirectStorageKey = "final_redirect_after_social",
  providers = DEFAULT_PROVIDERS,
}: Props) {
  const searchParams = useSearchParams();

  const handleSocialLogin = (provider: Provider) => {
    if (disabled) return;

    // Prefer ?redirect=... from URL, fallback to lastRoute from sessionStorage, else "/"
    const redirectFromQuery = searchParams.get("redirect");
    const lastRoute =
      typeof window !== "undefined"
        ? sessionStorage.getItem("lastRoute")
        : null;

    const finalRedirect = redirectFromQuery || lastRoute || "/";

    // Store final redirect in sessionStorage (no cookies)
    sessionStorage.setItem(redirectStorageKey, finalRedirect);

    const backendUrl = getApiBaseUrl();

    const url = new URL(`${backendUrl}/customer/auth/${provider}`);

    // Optional: pass callbackUrl or redirect to backend if it supports it
    if (callbackUrl) url.searchParams.set("callbackUrl", callbackUrl);

    // Optional: pass the desired post-login redirect as well (if backend uses it)
    url.searchParams.set("redirect", finalRedirect);

    window.location.href = url.toString();
  };

  return (
    <div className={className}>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-[#F8F8F8] dark:bg-[#141414] text-gray-500 dark:text-gray-400">
            Or Continue With
          </span>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {providers.includes("facebook") && (
          <button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            disabled={disabled}
            aria-label="Continue with Facebook"
            className="py-3 px-3.5 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaFacebookF className="w-5 h-5 text-blue-600" />
          </button>
        )}

        {providers.includes("google") && (
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={disabled}
            aria-label="Continue with Google"
            className="py-3 px-3.5 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Google icon (inline SVG) */}
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20s20-8.9 20-20c0-1.1-.1-2.2-.4-3.5Z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7Z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.4 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.3 39.7 16.1 44 24 44Z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-2.9 4.8-5.2 6.2l6.2 5.2C39.5 36.6 44 31.1 44 24c0-1.1-.1-2.2-.4-3.5Z"
              />
            </svg>
          </button>
        )}

        {providers.includes("apple") && (
          <button
            type="button"
            onClick={() => handleSocialLogin("apple")}
            // disabled={disabled}
            disabled
            aria-label="Continue with Apple"
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Apple icon (inline SVG) */}
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16.7 13.2c0-2 1.7-3 1.8-3.1c-1-1.5-2.6-1.7-3.1-1.7c-1.3-.1-2.5.8-3.1.8c-.6 0-1.6-.8-2.7-.8c-1.4 0-2.7.8-3.4 2.1c-1.5 2.6-.4 6.5 1.1 8.6c.7 1 1.5 2.2 2.6 2.1c1 0 1.4-.7 2.7-.7c1.2 0 1.6.7 2.7.7c1.1 0 1.8-1 2.5-2c.8-1.2 1.2-2.4 1.2-2.4c0 0-2.2-.9-2.3-3.6ZM14.9 6.7c.6-.7 1-1.7.9-2.7c-.9.1-2 .6-2.6 1.3c-.6.7-1.1 1.7-.9 2.7c1 .1 2-.5 2.6-1.3Z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
