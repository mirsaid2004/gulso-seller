import type { SellerShop, ShopStatus } from "../model/types"

/** Up to two initials for the shop tile, e.g. "Bake & Bloom" → "BB". */
export function shopMonogram(name: string): string {
  const initials = name
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  return initials || "?"
}

export function isLiveShop(shop: Pick<SellerShop, "status">): boolean {
  return shop.status === "ACTIVE"
}

/** Approved shops look "open" in the switcher even before the seller opens them. */
export function isOpenable(status: ShopStatus): boolean {
  return status === "ACTIVE" || status === "APPROVED"
}

/**
 * Shop shown in the panel: the stored choice if it still exists,
 * otherwise the first live shop, otherwise the first application.
 */
export function resolveActiveShop(shops: SellerShop[], storedId: number | null): SellerShop | null {
  return shops.find((s) => s.id === storedId) ?? shops.find(isLiveShop) ?? shops[0] ?? null
}

/** "Oct 14, 2026 · 09:12" in the given locale. */
export function formatSubmittedAt(iso: string, locale: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const day = date.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })
  const time = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false })
  return `${day} · ${time}`
}

/** "+998 90 123 45 67" from 9 national digits. */
export function formatUzPhone(digits: string): string {
  const d = digits.replace(/\D/g, "")
  if (d.length !== 9) return `+998 ${d}`
  return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
