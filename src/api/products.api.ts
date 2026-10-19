import { api } from "@/lib/api-client"
import type { ApiResponse, CreateProductRequest, ProductDetailedResponse, PaginationMeta, ProductCategory } from "@/types"

export interface ProductsParams {
  search?: string
  category?: ProductCategory
  page?: number
  perPage?: number
}

export const productsApi = {
  getProducts: (params: ProductsParams): Promise<ApiResponse<ProductDetailedResponse[]> & { meta: PaginationMeta }> => {
    const query = new URLSearchParams()
    if (params.search) query.set("search", params.search)
    if (params.category) query.set("category", params.category)
    if (params.page) query.set("page", String(params.page))
    if (params.perPage) query.set("perPage", String(params.perPage))
    const qs = query.toString()
    return api.get(`/products${qs ? `?${qs}` : ""}`)
  },

  createProduct: (data: CreateProductRequest): Promise<ApiResponse<ProductDetailedResponse>> =>
    api.post("/products", data),

  updateProduct: (id: number, data: CreateProductRequest): Promise<ApiResponse<ProductDetailedResponse>> =>
    api.patch(`/products/${id}`, data),

  deleteProduct: (id: number): Promise<ApiResponse<null>> =>
    api.delete(`/products/${id}`),
}
