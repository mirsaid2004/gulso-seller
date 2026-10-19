import { http, HttpResponse } from "msw";
import { baseUrl } from "../instance";
import type { ApiResponse, AuthResponse } from "@/types";
import { Role } from "@/types";

export const authHandlers = [
  // POST /api/v1/auth/otp/send
  http.post(`${baseUrl}/auth/otp/send`, async ({ request }) => {
    const { phone } = await request.json() as { phone: string };
    if (!phone) {
      return HttpResponse.json(
        { success: false, data: "", error: { code: "VALIDATION_ERROR", message: "Phone is required" } },
        { status: 400 }
      );
    }
    return HttpResponse.json({ success: true, data: "OTP sent successfully" });
  }),

  // POST /api/v1/auth/otp/login
  http.post<never, { phone: string; otpCode: string }, ApiResponse<AuthResponse>>(
    `${baseUrl}/auth/otp/login`,
    async ({ request }) => {
      const { otpCode } = await request.json() as { phone: string; otpCode: string };
      if (otpCode !== "123456") {
        return HttpResponse.json(
          {
            success: false,
            data: {} as AuthResponse,
            error: { code: "UNAUTHORIZED", message: "Invalid OTP code" },
          },
          { status: 401 }
        );
      }
      return HttpResponse.json({
        success: true,
        data: {
          accessToken: "mock-admin-access-token",
          refreshToken: "mock-admin-refresh-token",
          tokenType: "Bearer",
          expiresIn: 3600,
          userId: 1,
          name: "Admin",
          roles: [Role.ADMIN],
        },
      });
    }
  ),

  // POST /api/v1/auth/refresh
  http.post(`${baseUrl}/auth/refresh`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: "mock-admin-access-token",
        refreshToken: "mock-admin-refresh-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    });
  }),

  // POST /api/v1/auth/logout
  http.post(`${baseUrl}/auth/logout`, () => {
    return HttpResponse.json({ success: true, data: null });
  }),
];
