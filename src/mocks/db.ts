import seed from "./data/db.json"
import type { OrderResponse } from "@/types"

// ── db.json shapes ──────────────────────────────────────────────────────────
export interface DbTranslations {
  en: string
  az: string  // Uzbek is stored under the "az" key in db.json
  ru: string
}

export interface DbProduct {
  id: number
  name: DbTranslations
  price: number
  discount: number        // stored as decimal (0.13 = 13%)
  rating: number
  reviewCount: number
  imageUrl: string
  stockQuantity: number
  companyId: number
  isNew: boolean
  isBestSeller: boolean
  category: string
  detail: {
    description: DbTranslations
    specifications: { en: string[]; az: string[]; ru: string[] }
    status: string
    available: boolean
    media: { id: number; url: string; primary: boolean }[]
  }
}

export interface DbCompany {
  id: number
  name: string
}

export interface DbNotification {
  id: number
  type: "ORDER_STATUS" | "PRODUCT_REVIEW"
  orderId: number
  orderItems: { id: number; productName: string; productImageUrl?: string }[]
  status?: string
  productId?: number
  isRead: boolean
  createdAt: string
}

// In-memory copy of the static seed. Mutations live until the page reloads.
export const db = structuredClone(seed) as unknown as {
  products: DbProduct[]
  companies: DbCompany[]
  orders: OrderResponse[]
  notifications: DbNotification[]
}

export function nextId(items: { id: number }[]): number {
  return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1
}
