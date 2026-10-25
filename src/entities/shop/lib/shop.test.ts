import { describe, expect, it } from "vitest"
import type { SellerShop } from "../model/types"
import { formatFileSize, formatSubmittedAt, formatUzPhone, resolveActiveShop, shopMonogram } from "./shop"

const shop = (id: number, status: SellerShop["status"]): SellerShop => ({
  id,
  name: `Shop ${id}`,
  categories: ["FLOWERS"],
  status,
  application: null,
})

describe("shopMonogram", () => {
  it("takes the first letters of up to two words", () => {
    expect(shopMonogram("Bake & Bloom")).toBe("BB")
    expect(shopMonogram("Gullar do'koni")).toBe("GD")
    expect(shopMonogram("flora")).toBe("F")
  })

  it("keeps Cyrillic letters", () => {
    expect(shopMonogram("Сладкий дом")).toBe("СД")
  })

  it("falls back to ? for empty names", () => {
    expect(shopMonogram("  ")).toBe("?")
    expect(shopMonogram("&&")).toBe("?")
  })
})

describe("resolveActiveShop", () => {
  const shops = [shop(41, "PENDING"), shop(1, "ACTIVE"), shop(4, "ACTIVE")]

  it("returns the stored shop when it exists", () => {
    expect(resolveActiveShop(shops, 4)?.id).toBe(4)
    expect(resolveActiveShop(shops, 41)?.id).toBe(41)
  })

  it("falls back to the first live shop", () => {
    expect(resolveActiveShop(shops, null)?.id).toBe(1)
    expect(resolveActiveShop(shops, 999)?.id).toBe(1)
  })

  it("falls back to the first application when nothing is live", () => {
    expect(resolveActiveShop([shop(41, "PENDING")], null)?.id).toBe(41)
  })

  it("returns null without shops", () => {
    expect(resolveActiveShop([], 1)).toBeNull()
  })
})

describe("formatters", () => {
  it("formats Uzbek phone numbers", () => {
    expect(formatUzPhone("901234567")).toBe("+998 90 123 45 67")
    expect(formatUzPhone("90 123 45 67")).toBe("+998 90 123 45 67")
  })

  it("formats file sizes", () => {
    expect(formatFileSize(512)).toBe("512 B")
    expect(formatFileSize(48_213)).toBe("47 KB")
    expect(formatFileSize(2_310_004)).toBe("2.2 MB")
  })

  it("formats submission time and tolerates bad input", () => {
    expect(formatSubmittedAt("2026-10-14T09:12:00", "en-US")).toBe("Oct 14, 2026 · 09:12")
    expect(formatSubmittedAt("nope", "en-US")).toBe("")
  })
})
