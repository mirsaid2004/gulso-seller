import { http, HttpResponse } from "msw"
import { baseUrl } from "../instance"
import { db, nextId, type DbProduct } from "../db"
import { requestShopId } from "./utils"
import type { ProductDetailedResponse, CreateProductRequest, Lang } from "@/types"

// ── helpers ──────────────────────────────────────────────────────────────────
// admin uses "uz", db.json stores that text under the "az" key
function dbLang(lang: Lang): "az" | "ru" | "en" {
  return lang === "uz" ? "az" : lang
}

function dbToAdmin(p: DbProduct, lang: Lang): ProductDetailedResponse {
  const dl = dbLang(lang)
  const company = db.companies.find((c) => c.id === p.companyId) ?? { id: p.companyId, name: "—" }

  return {
    id: p.id,
    category: p.category as ProductDetailedResponse["category"],
    status: p.detail.status as ProductDetailedResponse["status"],
    name: p.name[dl] ?? p.name.en,
    description: p.detail.description[dl] ?? p.detail.description.en,
    specifications: p.detail.specifications[dl] ?? p.detail.specifications.en ?? [],
    price: p.price,
    discount: Math.round((p.discount ?? 0) * 100),  // 0.13 → 13
    rating: p.rating,
    reviewCount: p.reviewCount,
    imageUrl: p.imageUrl || p.detail.media[0]?.url || "",
    stockQuantity: p.stockQuantity,
    company,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    media: p.detail.media ?? [],
    translations: {
      uz: {
        name: p.name.az ?? "",
        description: p.detail.description.az ?? "",
        specifications: p.detail.specifications.az ?? [],
      },
      ru: {
        name: p.name.ru ?? "",
        description: p.detail.description.ru ?? "",
        specifications: p.detail.specifications.ru ?? [],
      },
      en: {
        name: p.name.en ?? "",
        description: p.detail.description.en ?? "",
        specifications: p.detail.specifications.en ?? [],
      },
    },
  }
}

function adminToDb(data: CreateProductRequest, companyId: number): Omit<DbProduct, "id"> {
  return {
    name: {
      az: data.translations.uz.name,
      ru: data.translations.ru.name,
      en: data.translations.en.name,
    },
    price: data.price,
    discount: (data.discount ?? 0) / 100,
    rating: 0,
    reviewCount: 0,
    imageUrl: data.imageUrls?.[0] ?? "",
    stockQuantity: data.stockQuantity,
    companyId,
    isNew: true,
    isBestSeller: false,
    category: data.category,
    detail: {
      description: {
        az: data.translations.uz.description,
        ru: data.translations.ru.description,
        en: data.translations.en.description,
      },
      specifications: {
        az: data.translations.uz.specifications,
        ru: data.translations.ru.specifications,
        en: data.translations.en.specifications,
      },
      status: data.stockQuantity > 0 ? "ACTIVE" : "OUT_OF_STOCK",
      available: data.stockQuantity > 0,
      media: (data.imageUrls ?? []).map((url, i) => ({
        id: Date.now() + i,
        url,
        primary: i === 0,
      })),
    },
  }
}

function notFound() {
  return HttpResponse.json(
    { success: false, data: null, error: { code: "NOT_FOUND", message: "Product not found" } },
    { status: 404 }
  )
}

// ── handlers ─────────────────────────────────────────────────────────────────
export const productHandlers = [
  // GET /api/v1/products?search=&category=&page=&perPage=
  http.get(`${baseUrl}/products`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")?.toLowerCase().trim() ?? ""
    const category = url.searchParams.get("category") ?? ""
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"))
    const perPage = Math.max(1, Number(url.searchParams.get("perPage") ?? "12"))
    const lang = (request.headers.get("Accept-Language")?.split(",")[0].split("-")[0] ?? "uz") as Lang

    // newest first
    let products = [...db.products].sort((a, b) => b.id - a.id)

    const shopId = requestShopId(request)
    if (shopId !== null) {
      products = products.filter((p) => p.companyId === shopId)
    }

    // filter
    if (search) {
      products = products.filter((p) => {
        const n = p.name
        return (
          (n.az ?? "").toLowerCase().includes(search) ||
          (n.ru ?? "").toLowerCase().includes(search) ||
          (n.en ?? "").toLowerCase().includes(search)
        )
      })
    }
    if (category) {
      products = products.filter((p) => p.category === category)
    }

    const total = products.length
    const start = (page - 1) * perPage
    const paged = products.slice(start, start + perPage)
    const data = paged.map((p) => dbToAdmin(p, lang))

    return HttpResponse.json({
      success: true,
      data,
      meta: {
        currentPage: page,
        lastPage: Math.max(1, Math.ceil(total / perPage)),
        perPage,
        total,
      },
    })
  }),

  // POST /api/v1/products
  http.post(`${baseUrl}/products`, async ({ request }) => {
    const body = (await request.json()) as CreateProductRequest
    const created: DbProduct = { id: nextId(db.products), ...adminToDb(body, requestShopId(request) ?? 1) }
    db.products.push(created)

    return HttpResponse.json(
      { success: true, data: dbToAdmin(created, "uz") },
      { status: 201 }
    )
  }),

  // PATCH /api/v1/products/:id  (edit)
  http.patch(`${baseUrl}/products/:id`, async ({ params, request }) => {
    const existing = db.products.find((p) => p.id === Number(params.id))
    if (!existing) return notFound()

    const body = (await request.json()) as Partial<CreateProductRequest>

    if (body.translations) {
      existing.name = {
        az: body.translations.uz?.name ?? "",
        ru: body.translations.ru?.name ?? "",
        en: body.translations.en?.name ?? "",
      }
      existing.detail.description = {
        az: body.translations.uz?.description ?? existing.detail.description.az,
        ru: body.translations.ru?.description ?? existing.detail.description.ru,
        en: body.translations.en?.description ?? existing.detail.description.en,
      }
      existing.detail.specifications = {
        az: body.translations.uz?.specifications ?? existing.detail.specifications.az,
        ru: body.translations.ru?.specifications ?? existing.detail.specifications.ru,
        en: body.translations.en?.specifications ?? existing.detail.specifications.en,
      }
    }
    if (body.price !== undefined) existing.price = body.price
    if (body.discount !== undefined) existing.discount = body.discount / 100
    if (body.stockQuantity !== undefined) {
      existing.stockQuantity = body.stockQuantity
      existing.detail.status = body.stockQuantity > 0 ? "ACTIVE" : "OUT_OF_STOCK"
      existing.detail.available = body.stockQuantity > 0
    }
    if (body.category !== undefined) existing.category = body.category

    return HttpResponse.json({ success: true, data: dbToAdmin(existing, "uz") })
  }),

  // DELETE /api/v1/products/:id
  http.delete(`${baseUrl}/products/:id`, ({ params }) => {
    const index = db.products.findIndex((p) => p.id === Number(params.id))
    if (index === -1) return notFound()
    db.products.splice(index, 1)
    return HttpResponse.json({ success: true, data: null })
  }),
]
