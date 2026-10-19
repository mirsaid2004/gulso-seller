import { api } from "@/lib/api-client"
import type { ApiResponse, OrderResponse, OrderStatus } from "@/types"

export interface OrdersParams {
  status?: OrderStatus
  search?: string
}

export const ordersApi = {
  getOrders: (params: OrdersParams = {}): Promise<ApiResponse<OrderResponse[]>> => {
    const query = new URLSearchParams()
    if (params.status) query.set("status", params.status)
    if (params.search) query.set("search", params.search)
    const qs = query.toString()
    return api.get(`/orders${qs ? `?${qs}` : ""}`)
  },

  updateStatus: (id: number, status: OrderStatus): Promise<ApiResponse<OrderResponse>> =>
    api.patch(`/orders/${id}/status`, { status }),
}
