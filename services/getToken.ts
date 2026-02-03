import { useAuthStore } from "@/zustand/authStore";

/**
 * Returns the current auth token from the zustand auth store.
 * Works both on server and client:
 * - Server: reads the `authToken` cookie via Next's `cookies()` API
 * - Client: waits for the Zustand store to finish hydration before returning token
 */
export async function getToken(): Promise<string | null> {
  // Server-side: read cookie from Next.js cookies (no client hydration there)
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      // cookies() returns a promise, so await it before calling .get
      const cookieStore = await cookies();
      const cookie = cookieStore.get("authToken");
      return cookie?.value ?? null;
    } catch (err) {
      // If import or cookies() fails, return null
      return null;
    }
  }

  // Client-side: wait for store hydration (persisted state from localStorage)
  return new Promise((resolve) => {
    const state = useAuthStore.getState();

    if (state._hasHydrated) {
      resolve(state.token ?? null);
      return;
    }

    const unsubscribe = useAuthStore.subscribe((newState) => {
      if (newState._hasHydrated) {
        unsubscribe();
        resolve(newState.token ?? null);
      }
    });

    // Safety timeout in case hydration never completes
    const timeout = setTimeout(() => {
      try {
        unsubscribe();
      } catch (e) {
        /* ignore */
      }
      resolve(useAuthStore.getState()?.token ?? null);
    }, 3000);

    // Clear timeout when hydration finishes
    const unsubTimeoutClear = useAuthStore.subscribe((s) => {
      if (s._hasHydrated) {
        clearTimeout(timeout);
        try {
          unsubTimeoutClear();
        } catch (e) {
          /* ignore */
        }
      }
    });
  });
}
