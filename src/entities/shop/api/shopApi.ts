import { api } from "@/lib/api-client"
import type { ApiResponse } from "@/types"
import type { SellerShop, ShopApplicationInput } from "../model/types"

export type MockReviewDecision = { decision: "APPROVE" } | { decision: "REQUEST_CHANGES"; note: string }

export const shopApi = {
  /** Shops and shop applications owned by the signed-in seller. */
  list: () => api.get<ApiResponse<SellerShop[]>>("/seller/shops"),

  /** Sends a new shop to Gulso maintainers for review. */
  apply: (input: ShopApplicationInput) => api.post<ApiResponse<SellerShop>>("/seller/shops", input),

  /** Resubmits an application after maintainers requested changes. */
  resubmit: (id: number, input: ShopApplicationInput) =>
    api.put<ApiResponse<SellerShop>>(`/seller/shops/${id}/application`, input),

  /** Opens an approved shop so its dashboard becomes available. */
  open: (id: number) => api.post<ApiResponse<SellerShop>>(`/seller/shops/${id}/open`),

  /** Mock API only: plays the maintainer's decision on a pending application. */
  mockReview: (id: number, body: MockReviewDecision) =>
    api.post<ApiResponse<SellerShop>>(`/mock/shop-applications/${id}/decision`, body),
}
