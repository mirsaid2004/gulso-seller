import { http, HttpResponse } from "msw"
import { baseUrl } from "../instance"
import { db, nextId, type DbNotification } from "../db"
import type { OrderStatus } from "@/types"

function pushNotification(notification: Omit<DbNotification, "id" | "isRead" | "createdAt">) {
  db.notifications.push({
    id: nextId(db.notifications),
    ...notification,
    isRead: false,
    createdAt: new Date().toISOString(),
  })
}

export const orderHandlers = [
  // GET /api/v1/orders?status=&search=
  http.get(`${baseUrl}/orders`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get("status") ?? ""
    const search = url.searchParams.get("search")?.toLowerCase().trim() ?? ""

    // newest first
    let orders = [...db.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    if (status) {
      orders = orders.filter((o) => o.status === status)
    }
    if (search) {
      orders = orders.filter(
        (o) =>
          o.recipientName.toLowerCase().includes(search) ||
          o.recipientPhone.includes(search)
      )
    }

    return HttpResponse.json({ success: true, data: orders })
  }),

  // PATCH /api/v1/orders/:id/status
  http.patch(`${baseUrl}/orders/:id/status`, async ({ params, request }) => {
    const { status } = (await request.json()) as { status: OrderStatus }
    const id = Number(params.id)

    const updated = db.orders.find((o) => o.id === id)
    if (!updated) {
      return HttpResponse.json(
        { success: false, data: null, error: { code: "NOT_FOUND", message: "Order not found" } },
        { status: 404 }
      )
    }
    updated.status = status

    // Always create a new ORDER_STATUS notification so the client sees it as a fresh entry
    pushNotification({
      type: "ORDER_STATUS",
      orderId: id,
      orderItems: updated.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        productImageUrl: item.productImageUrl,
      })),
      status,
    })

    // On completion — create one PRODUCT_REVIEW notification per order item
    if (status === "COMPLETED") {
      for (const item of updated.items) {
        pushNotification({
          type: "PRODUCT_REVIEW",
          orderId: id,
          orderItems: [{
            id: item.id,
            productName: item.productName,
            productImageUrl: item.productImageUrl ?? "",
          }],
          productId: item.productId,
        })
      }
    }

    return HttpResponse.json({ success: true, data: updated })
  }),
]
