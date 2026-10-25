import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  name: string | null;
  phone: string | null;
  roles: Role[];
  isAuthenticated: boolean;
  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    name: string;
    phone?: string | null;
    roles: Role[];
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      name: null,
      phone: null,
      roles: [],
      isAuthenticated: false,

      setAuth: ({ accessToken, refreshToken, userId, name, phone = null, roles }) =>
        set({ accessToken, refreshToken, userId, name, phone, roles, isAuthenticated: true }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          name: null,
          phone: null,
          roles: [],
          isAuthenticated: false,
        }),
    }),
    { name: "auth-store" }
  )
);
