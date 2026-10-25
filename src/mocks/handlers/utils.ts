import { HttpResponse } from "msw"
import { db } from "../db"
import type { OrderResponse } from "@/types"

export function errorResponse(status: number, code: string, message: string) {
  return HttpResponse.json({ success: false, data: null, error: { code, message } }, { status })
}

/** Shop picked in the seller's shop switcher (X-Shop-Id), or null when the client sent none. */
export function requestShopId(request: Request): number | null {
  const raw = request.headers.get("X-Shop-Id")
  const id = raw ? Number(raw) : NaN
  return Number.isFinite(id) ? id : null
}

/** An order belongs to a shop when any of its items is one of that shop's products. */
export function orderBelongsToShop(order: OrderResponse, shopId: number): boolean {
  return order.items.some((item) => db.products.find((p) => p.id === item.productId)?.companyId === shopId)
}

export function ordersForRequest(request: Request): OrderResponse[] {
  const shopId = requestShopId(request)
  return shopId === null ? db.orders : db.orders.filter((o) => orderBelongsToShop(o, shopId))
}
