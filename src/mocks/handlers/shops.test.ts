import { describe, expect, it } from "vitest"
import { productsApi } from "@/api/products.api"
import { ordersApi } from "@/api/orders.api"
import { shopApi, useActiveShopStore, type ShopApplicationInput } from "@/entities/shop"
import { db } from "../db"

const input: ShopApplicationInput = {
  name: "Tulip Corner",
  categories: ["FLOWERS"],
  description: "",
  phone: "901234567",
  email: "",
  address: "Tashkent",
  location: null,
  legalEntity: "YATT",
  stir: "123456789",
  logo: null,
  documents: [
    { kind: "REGISTRATION_CERTIFICATE", fileName: "c.pdf", size: 1 },
    { kind: "OWNER_ID", fileName: "id.pdf", size: 1 },
  ],
}

describe("seller shop API (mock)", () => {
  it("lists only the signed-in seller's shops", async () => {
    const { data } = await shopApi.list()
    expect(data.map((s) => s.id)).toEqual([1, 4, 41, 36])
    expect(data[0]).not.toHaveProperty("ownerId")
  })

  it("creates a pending application", async () => {
    const { data } = await shopApi.apply(input)
    expect(data).toMatchObject({ name: "Tulip Corner", status: "PENDING" })
    expect(data.application?.submittedAt).toBeTruthy()
  })

  it("rejects invalid or duplicate applications", async () => {
    await expect(shopApi.apply({ ...input, stir: "12" })).rejects.toThrow("STIR must be 9 digits")
    await expect(shopApi.apply({ ...input, documents: [] })).rejects.toThrow("Both documents are required")
    await expect(shopApi.apply({ ...input, name: "flora art" })).rejects.toThrow("already exists")
  })

  it("only resubmits applications with requested changes", async () => {
    await expect(shopApi.resubmit(41, input)).rejects.toThrow("Only applications with requested changes")
    const { data } = await shopApi.resubmit(36, { ...input, name: "Sovg'a Market" })
    expect(data.status).toBe("PENDING")
  })

  it("opens a shop only after approval", async () => {
    await expect(shopApi.open(41)).rejects.toThrow("not approved")
    await shopApi.mockReview(41, { decision: "APPROVE" })
    const { data } = await shopApi.open(41)
    expect(data.status).toBe("ACTIVE")
  })

  it("records the maintainer's note when changes are requested", async () => {
    const { data } = await shopApi.mockReview(41, { decision: "REQUEST_CHANGES", note: "Wrong STIR" })
    expect(data).toMatchObject({ status: "CHANGES_REQUESTED", application: { note: "Wrong STIR" } })
  })
})

describe("shop scoping via X-Shop-Id", () => {
  it("returns only the active shop's products", async () => {
    useActiveShopStore.setState({ activeShopId: 4 })
    const { data } = await productsApi.getProducts({ perPage: 100 })
    const expected = db.products.filter((p) => p.companyId === 4).map((p) => p.id)
    expect(data.map((p) => p.id).sort()).toEqual(expected.sort())
    expect(data.length).toBeGreaterThan(0)
  })

  it("returns nothing for a freshly opened shop", async () => {
    db.shops.find((s) => s.id === 41)!.status = "APPROVED"
    await shopApi.open(41)
    useActiveShopStore.setState({ activeShopId: 41 })
    const products = await productsApi.getProducts({})
    expect(products.data).toEqual([])
  })

  it("scopes orders through their products", async () => {
    useActiveShopStore.setState({ activeShopId: 4 })
    const shop4 = await ordersApi.getOrders({})
    expect(shop4.data.length).toBeLessThan(db.orders.length)
    for (const order of shop4.data) {
      expect(order.items.some((i) => db.products.find((p) => p.id === i.productId)?.companyId === 4)).toBe(true)
    }
  })
})
