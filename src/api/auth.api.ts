import { api } from "@/lib/api-client";
import type { ApiResponse, AuthResponse } from "@/types";

export const authApi = {
  sendOtp: (phone: string) =>
    api.post<ApiResponse<string>>("/auth/otp/send", { phone }),

  verifyOtp: (phone: string, otpCode: string) =>
    api.post<ApiResponse<AuthResponse>>("/auth/otp/login", { phone, otpCode }),

  logout: () =>
    api.post<ApiResponse<null>>("/auth/logout"),
};
