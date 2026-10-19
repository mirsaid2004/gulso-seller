export interface ApiError {
  code: string;
  message: string;
}

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  error?: ApiError;
}

export const Role = {
  USER: "USER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
} as const
export type Role = (typeof Role)[keyof typeof Role]

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  name: string;
  roles: Role[];
}

// Products
export const ProductCategory = {
  FLOWERS: "FLOWERS",
  GIFTS: "GIFTS",
  BAKERY: "BAKERY",
} as const
export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory]

export const ProductStatus = {
  ACTIVE: "ACTIVE",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]

export type Lang = "uz" | "ru" | "en"

export interface ProductTranslation {
  name: string;
  description: string;
  specifications: string[];
}

export interface MediaResponse {
  id: number;
  url: string;
  primary: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  discount: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  stockQuantity: number;
  status: ProductStatus;
  category: ProductCategory;
  company: { id: number; name: string };
  isNew: boolean;
  isBestSeller: boolean;
}

export interface ProductDetailedResponse extends ProductResponse {
  description: string;
  specifications: string[];
  media: MediaResponse[];
  translations: Record<Lang, ProductTranslation>;
}

export interface CreateProductRequest {
  category: ProductCategory;
  translations: Record<Lang, ProductTranslation>;
  price: number;
  discount: number;
  stockQuantity: number;
  imageUrls?: string[];
}

// Orders
export const OrderStatus = {
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  IN_DELIVERY: "IN_DELIVERY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const DeliveryType = {
  DELIVERY: "DELIVERY",
  PICKUP: "PICKUP",
} as const
export type DeliveryType = (typeof DeliveryType)[keyof typeof DeliveryType]

export interface OrderItemResponse {
  id: number
  productId: number
  productName: string
  productImageUrl: string
  productPrice: number
  productDiscount: number
  quantity: number
  subtotal: number
}

export interface OrderResponse {
  id: number
  recipientName: string
  recipientPhone: string
  deliveryAddress: string
  latitude: number
  longitude: number
  deliveryDate: string
  deliveryType: DeliveryType
  comment: string
  status: OrderStatus
  totalAmount: number
  items: OrderItemResponse[]
  createdAt: string
}

// Finance
export const PaymentStatus = {
  PAID: "PAID",
  PENDING: "PENDING",
} as const
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

export interface FinanceTransaction {
  id: number
  orderId: number
  date: string
  amount: number
  commission: number
  netAmount: number
  status: PaymentStatus
}

export interface FinanceStats {
  totalRevenue: number
  commissionAmount: number
  balance: number
  growthPercent: number
}
