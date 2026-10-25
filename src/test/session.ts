import { useAuthStore } from "@/features/auth/useAuthStore"
import { Role } from "@/types"

/** Signs the store in as the seeded seller the mock API serves. */
export function signIn() {
  useAuthStore.getState().setAuth({
    accessToken: "mock-admin-access-token",
    refreshToken: "mock-admin-refresh-token",
    userId: 123,
    name: "Mirsaid",
    phone: "+998979997969",
    roles: [Role.SELLER],
  })
}

export function signOut() {
  useAuthStore.getState().clearAuth()
}
