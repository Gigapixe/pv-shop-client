import { AuthState, User } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const isProd = process.env.NODE_ENV === "production";

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${
    isProd ? ";Secure" : ""
  }`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

interface AuthStoreState extends AuthState {
  _hasHydrated: boolean;
  isRegister: boolean;
  isForgotPassword: boolean;
  setHasHydrated: (state: boolean) => void;

  setTempAuth: (
    email: string,
    token: string,
    isRegister?: boolean,
    isForgotPassword?: boolean,
  ) => void;

  clearTempAuth: () => void;
  logout: () => void;

  // Merge partial user fields into current user (local only)
  updateUserProfile: (patch: Partial<User>) => void;

  // Set user balance atomically
  setUserBalance: (balance: number) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      tempToken: null,
      tempEmail: null,
      isRegister: false,
      isForgotPassword: false,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      // ✅ LOGIN SUCCESS
      setAuth: (payload: any) => {
        const { token, status, ...user } = payload || {};

        if (token) {
          setCookie("authToken", token, 7);
        }

        set({
          user: user as User,
          token: token ?? null,
          isAuthenticated: !!token,

          tempToken: null,
          tempEmail: null,
          isRegister: false,
          isForgotPassword: false,
        });
      },

      setTempAuth: (
        email: string,
        token: string,
        isRegister = false,
        isForgotPassword = false,
      ) =>
        set({
          tempEmail: email,
          tempToken: token,
          isRegister,
          isForgotPassword,
        }),

      clearTempAuth: () =>
        set({
          tempToken: null,
          tempEmail: null,
          isRegister: false,
          isForgotPassword: false,
        }),

      logout: () => {
        deleteCookie("authToken");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          tempToken: null,
          tempEmail: null,
          isRegister: false,
          isForgotPassword: false,
        });
      },

      // Merge partial user fields into current user (local only)
      updateUserProfile: (patch: Partial<User>) =>
        set((prev) => ({
          user: prev.user ? { ...prev.user, ...patch } : prev.user,
        })),

      // Set user wallet balance atomically
      setUserBalance: (balance: number) =>
        set((prev) => ({
          user: prev.user ? { ...prev.user, balance } : prev.user,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
