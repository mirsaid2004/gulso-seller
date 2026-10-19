import { api } from "@/lib/api-client"
import type { ApiResponse, FinanceStats, FinanceTransaction, PaymentStatus } from "@/types"

export interface FinanceTransactionsParams {
  page?: number
  perPage?: number
  search?: string
  status?: PaymentStatus
}

export const financeApi = {
  getStats: (): Promise<ApiResponse<FinanceStats>> =>
    api.get("/finance/stats"),

  getTransactions: (params: FinanceTransactionsParams = {}): Promise<ApiResponse<FinanceTransaction[]>> => {
    const query = new URLSearchParams()
    if (params.page) query.set("page", String(params.page))
    if (params.perPage) query.set("perPage", String(params.perPage))
    if (params.search) query.set("search", params.search)
    if (params.status) query.set("status", params.status)
    const qs = query.toString()
    return api.get(`/finance/transactions${qs ? `?${qs}` : ""}`)
  },
}
