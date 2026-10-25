import type { ProductCategory } from "@/types"

/**
 * ACTIVE — shop is open and its dashboard is usable.
 * PENDING / CHANGES_REQUESTED / APPROVED / REJECTED — the shop is still an application
 * moving through review by Gulso maintainers.
 */
export type ShopStatus = "ACTIVE" | "PENDING" | "CHANGES_REQUESTED" | "APPROVED" | "REJECTED"

export type LegalEntity = "YATT" | "LLC"

export type DocumentKind = "REGISTRATION_CERTIFICATE" | "OWNER_ID"

export interface ShopFile {
  fileName: string
  /** Bytes */
  size: number
}

export interface ShopDocument extends ShopFile {
  kind: DocumentKind
}

export interface GeoPoint {
  lat: number
  lng: number
}

export interface ShopApplication {
  description: string
  /** 9 national digits, without +998 */
  phone: string
  email: string
  address: string
  location: GeoPoint | null
  legalEntity: LegalEntity
  /** Taxpayer identification number, 9 digits */
  stir: string
  logo: ShopFile | null
  documents: ShopDocument[]
  /** ISO date-time */
  submittedAt: string
  /** Seller resubmitted after a "changes requested" round */
  resubmitted?: boolean
  /** Note attached to the latest maintainer decision */
  note?: string
}

export interface SellerShop {
  id: number
  name: string
  categories: ProductCategory[]
  status: ShopStatus
  /** Present for shops that were created through the application flow */
  application: ShopApplication | null
}

export interface ShopApplicationInput {
  name: string
  categories: ProductCategory[]
  description: string
  phone: string
  email: string
  address: string
  location: GeoPoint | null
  legalEntity: LegalEntity
  stir: string
  logo: ShopFile | null
  documents: ShopDocument[]
}
