import { ProductCategory } from "@/types"
import type { DocumentKind, ShopStatus } from "./types"

export const SHOP_CATEGORIES = [
  { value: ProductCategory.FLOWERS, emoji: "🌸" },
  { value: ProductCategory.GIFTS, emoji: "🎁" },
  { value: ProductCategory.BAKERY, emoji: "🎂" },
] as const

export const DOCUMENT_KINDS: DocumentKind[] = ["REGISTRATION_CERTIFICATE", "OWNER_ID"]

/** Tailwind classes for the status pill; ACTIVE shops show no pill. */
export const SHOP_STATUS_BADGE: Record<Exclude<ShopStatus, "ACTIVE">, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CHANGES_REQUESTED: "bg-rose-100 text-rose-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-slate-100 text-slate-600",
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
