// import { cookies } from "next/headers";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  token?: string; // Optional Bearer token
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] }; // For ISR/revalidation
  etag?: string; // For conditional requests
}

export async function apiFetch<T>(
  url: string,
  options: ApiOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    token,
    cache = "default",
    next,
    etag,
  } = options;

  // Merge headers with defaults (Content-Type, etc.)
  let mergedHeaders: HeadersInit = { ...headers };
  // Only set Content-Type if not uploading FormData
  if (!(body instanceof FormData)) {
    mergedHeaders = { "Content-Type": "application/json", ...mergedHeaders };
  }
  // Add If-None-Match header for ETag if provided
  if (etag) {
    mergedHeaders["If-None-Match"] = etag;
  }
  if (token) {
    mergedHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Add Bearer token if provided (or fetch from cookies in SSR)
  // let flexiAuthToken = token;
  // if (!flexiAuthToken && typeof window === "undefined") {
  //   // Server-side
  //   const cookieStore = await cookies();
  //   const cookie = cookieStore.get("flexiAuthToken"); // Assuming token in HTTP-only cookie
  //   flexiAuthToken = cookie?.value; // Extract string value from RequestCookie
  // } else if (!flexiAuthToken) {
  //   // Client-side fallback
  //   flexiAuthToken = localStorage.getItem("flexiAuthToken") || ""; // Insecure; use with caution
  // }
  // if (flexiAuthToken) {
  //   mergedHeaders["Authorization"] = `Bearer ${flexiAuthToken}`;
  // }

  const response = await fetch(url, {
    method,
    headers: mergedHeaders,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
    cache, // Controls SSR caching
    next, // For revalidation in SSR/ISG
  });

  const contentType = response.headers.get("content-type") || "";

  // Try to parse JSON when appropriate, otherwise fall back to text
  let parsedBody: any = null;
  if (contentType.includes("application/json")) {
    try {
      parsedBody = await response.json();
    } catch (err) {
      parsedBody = null;
    }
  } else {
    try {
      parsedBody = await response.text();
    } catch (err) {
      parsedBody = null;
    }
  }

  if (!response.ok) {
    // Handle auth expiration on the client: auto-logout and redirect to login
    if (
      (response.status === 401 || response.status === 403) &&
      typeof window !== "undefined"
    ) {
      try {
        // Dynamically import the auth store to avoid server-side issues
        const { useAuthStore } = await import("@/zustand/authStore");
        const state = useAuthStore.getState();
        // Only trigger logout if we were authenticated
        if (state?.isAuthenticated || state?.token) {
          try {
            state.logout();
          } catch (e) {
            /* ignore */
          }
          // Redirect user to login page
          // Adjust path if your app uses a different login route
          window.location.href = "/auth/login";
        }
      } catch (e) {
        // Ignore import/logout errors
      }
    }

    const message =
      (parsedBody && typeof parsedBody === "object" && parsedBody.message) ||
      (typeof parsedBody === "string" && parsedBody) ||
      `HTTP error! Status: ${response.status}`;

    const error: any = new Error(message);
    error.status = response.status;
    error.body = parsedBody;
    throw error;
  }

  // Return parsed JSON when available, otherwise return raw text or empty object
  if (contentType.includes("application/json")) {
    return parsedBody as Promise<T>;
  }

  return parsedBody as unknown as Promise<T>;
}
