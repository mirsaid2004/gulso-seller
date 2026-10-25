import { http, HttpResponse } from "msw"
import { baseUrl } from "../instance"
import { db, type DbShop } from "../db"
import { SEED_SELLER_ID } from "../data/shops"
import { errorResponse } from "./utils"
import type { SellerShop, ShopApplicationInput } from "@/entities/shop"

// The mock auth issues one static token, so every request acts as the seeded seller.
const currentSellerId = () => SEED_SELLER_ID

function toSellerShop(shop: DbShop): SellerShop {
  const { id, name, categories, status, application } = shop
  return { id, name, categories, status, application }
}

function findOwnShop(id: number) {
  return db.shops.find((s) => s.id === id && s.ownerId === currentSellerId())
}

function validate(input: ShopApplicationInput, ignoreId?: number): string | null {
  if (!input.name?.trim()) return "Shop name is required"
  if (!input.categories?.length) return "Pick at least one category"
  if (!/^\d{9}$/.test(input.phone ?? "")) return "Phone must be 9 digits"
  if (!input.address?.trim()) return "Address is required"
  if (!/^\d{9}$/.test(input.stir ?? "")) return "STIR must be 9 digits"
  const kinds = new Set((input.documents ?? []).map((d) => d.kind))
  if (!kinds.has("REGISTRATION_CERTIFICATE") || !kinds.has("OWNER_ID")) return "Both documents are required"
  const name = input.name.trim().toLowerCase()
  if (db.shops.some((s) => s.id !== ignoreId && s.name.toLowerCase() === name)) {
    return "A shop with this name already exists"
  }
  return null
}

function applicationFrom(input: ShopApplicationInput) {
  return {
    description: input.description.trim(),
    phone: input.phone,
    email: input.email.trim(),
    address: input.address.trim(),
    location: input.location,
    legalEntity: input.legalEntity,
    stir: input.stir,
    logo: input.logo,
    documents: input.documents,
    submittedAt: new Date().toISOString(),
  }
}

export const shopHandlers = [
  // GET /api/v1/seller/shops
  http.get(`${baseUrl}/seller/shops`, () => {
    const shops = db.shops.filter((s) => s.ownerId === currentSellerId()).map(toSellerShop)
    return HttpResponse.json({ success: true, data: shops })
  }),

  // POST /api/v1/seller/shops — new shop application
  http.post(`${baseUrl}/seller/shops`, async ({ request }) => {
    const input = (await request.json()) as ShopApplicationInput
    const problem = validate(input)
    if (problem) return errorResponse(422, "VALIDATION_ERROR", problem)

    const shop: DbShop = {
      id: Math.max(0, ...db.shops.map((s) => s.id)) + 1,
      ownerId: currentSellerId(),
      name: input.name.trim(),
      categories: input.categories,
      status: "PENDING",
      application: applicationFrom(input),
    }
    db.shops.push(shop)
    return HttpResponse.json({ success: true, data: toSellerShop(shop) }, { status: 201 })
  }),

  // PUT /api/v1/seller/shops/:id/application — resubmit after changes were requested
  http.put(`${baseUrl}/seller/shops/:id/application`, async ({ params, request }) => {
    const shop = findOwnShop(Number(params.id))
    if (!shop) return errorResponse(404, "NOT_FOUND", "Shop not found")
    if (shop.status !== "CHANGES_REQUESTED") {
      return errorResponse(409, "INVALID_STATE", "Only applications with requested changes can be resubmitted")
    }
    const input = (await request.json()) as ShopApplicationInput
    const problem = validate(input, shop.id)
    if (problem) return errorResponse(422, "VALIDATION_ERROR", problem)

    shop.name = input.name.trim()
    shop.categories = input.categories
    shop.status = "PENDING"
    shop.application = { ...applicationFrom(input), resubmitted: true }
    return HttpResponse.json({ success: true, data: toSellerShop(shop) })
  }),

  // POST /api/v1/seller/shops/:id/open — approved → active
  http.post(`${baseUrl}/seller/shops/:id/open`, ({ params }) => {
    const shop = findOwnShop(Number(params.id))
    if (!shop) return errorResponse(404, "NOT_FOUND", "Shop not found")
    if (shop.status === "ACTIVE") return HttpResponse.json({ success: true, data: toSellerShop(shop) })
    if (shop.status !== "APPROVED") return errorResponse(409, "INVALID_STATE", "Shop is not approved yet")

    shop.status = "ACTIVE"
    if (!db.companies.some((c) => c.id === shop.id)) db.companies.push({ id: shop.id, name: shop.name })
    return HttpResponse.json({ success: true, data: toSellerShop(shop) })
  }),

  // POST /api/v1/mock/shop-applications/:id/decision — stands in for the maintainer panel
  http.post(`${baseUrl}/mock/shop-applications/:id/decision`, async ({ params, request }) => {
    const shop = findOwnShop(Number(params.id))
    if (!shop?.application) return errorResponse(404, "NOT_FOUND", "Application not found")
    if (shop.status !== "PENDING") return errorResponse(409, "INVALID_STATE", "Application is not pending")

    const body = (await request.json()) as { decision: "APPROVE" | "REQUEST_CHANGES"; note?: string }
    if (body.decision === "APPROVE") {
      shop.status = "APPROVED"
      shop.application.note = undefined
    } else {
      shop.status = "CHANGES_REQUESTED"
      shop.application.note = body.note || "Please review your application."
    }
    return HttpResponse.json({ success: true, data: toSellerShop(shop) })
  }),
]
