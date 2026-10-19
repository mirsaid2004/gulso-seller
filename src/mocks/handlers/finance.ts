import { http, HttpResponse } from "msw"
import { baseUrl } from "../instance"
import { db } from "../db"
import type { OrderResponse, FinanceTransaction, FinanceStats } from "@/types"

const COMMISSION_RATE = 0.1

function orderToTransaction(order: OrderResponse): FinanceTransaction {
  const commission = Math.round(order.totalAmount * COMMISSION_RATE)
  return {
    id: order.id,
    orderId: order.id,
    date: order.createdAt,
    amount: order.totalAmount,
    commission,
    netAmount: order.totalAmount - commission,
    status: order.status === "COMPLETED" ? "PAID" : "PENDING",
  }
}

export const financeHandlers = [
  http.get(`${baseUrl}/finance/stats`, () => {
    const since = new Date()
    since.setDate(since.getDate() - 30)
    const recent = db.orders.filter((o) => new Date(o.createdAt) >= since)

    const totalRevenue = recent.reduce((sum, o) => sum + o.totalAmount, 0)
    const commissionAmount = Math.round(totalRevenue * COMMISSION_RATE)

    const stats: FinanceStats = {
      totalRevenue,
      commissionAmount,
      balance: totalRevenue - commissionAmount,
      growthPercent: 12,
    }

    return HttpResponse.json({ success: true, data: stats })
  }),

  http.get(`${baseUrl}/finance/transactions`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") ?? "1")
    const perPage = parseInt(url.searchParams.get("perPage") ?? "10")
    const search = url.searchParams.get("search")?.toLowerCase().trim() ?? ""
    const status = url.searchParams.get("status") ?? ""

    const orders = [...db.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    let transactions = orders.map(orderToTransaction)

    if (status) {
      transactions = transactions.filter((t) => t.status === status)
    }
    if (search) {
      transactions = transactions.filter(
        (t) =>
          `#${String(t.orderId).padStart(5, "0")}`.includes(search) ||
          String(t.amount).includes(search)
      )
    }

    const total = transactions.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const paginated = transactions.slice((page - 1) * perPage, page * perPage)

    return HttpResponse.json({
      success: true,
      data: paginated,
      meta: { currentPage: page, lastPage, perPage, total },
    })
  }),
]
