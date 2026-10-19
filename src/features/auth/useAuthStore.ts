import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  name: string | null;
  roles: Role[];
  isAuthenticated: boolean;
  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    name: string;
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
      roles: [],
      isAuthenticated: false,

      setAuth: ({ accessToken, refreshToken, userId, name, roles }) =>
        set({ accessToken, refreshToken, userId, name, roles, isAuthenticated: true }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          name: null,
          roles: [],
          isAuthenticated: false,
        }),
    }),
    { name: "auth-store" }
  )
);
