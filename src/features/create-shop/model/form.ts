import type { ProductCategory } from "@/types"
import { formatPhone } from "@/shared/lib/phone"
import {
  MAX_UPLOAD_BYTES,
  type DocumentKind,
  type GeoPoint,
  type LegalEntity,
  type SellerShop,
  type ShopApplicationInput,
  type ShopFile,
} from "@/entities/shop"

export type FormStep = 1 | 2 | 3

export const LAST_STEP: FormStep = 3

export interface ShopForm {
  name: string
  description: string
  categories: ProductCategory[]
  /** As typed, "90 123 45 67" */
  phone: string
  email: string
  address: string
  location: GeoPoint | null
  legalEntity: LegalEntity
  stir: string
  logo: ShopFile | null
  documents: Partial<Record<DocumentKind, ShopFile>>
  agree: boolean
}

export type FormErrorKey = "name" | "categories" | "phone" | "address" | "stir" | "documents" | "agree"
export type FormErrors = Partial<Record<FormErrorKey, true>>

export const EMPTY_FORM: ShopForm = {
  name: "",
  description: "",
  categories: [],
  phone: "",
  email: "",
  address: "",
  location: null,
  legalEntity: "YATT",
  stir: "",
  logo: null,
  documents: {},
  agree: false,
}

const digits = (value: string) => value.replace(/\D/g, "")

export function validateStep(form: ShopForm, step: FormStep): FormErrors {
  const errors: FormErrors = {}
  if (step === 1) {
    if (!form.name.trim()) errors.name = true
    if (!form.categories.length) errors.categories = true
  }
  if (step === 2) {
    if (digits(form.phone).length !== 9) errors.phone = true
    if (!form.address.trim()) errors.address = true
    if (!/^\d{9}$/.test(form.stir.replace(/\s/g, ""))) errors.stir = true
  }
  if (step === 3) {
    if (!form.documents.REGISTRATION_CERTIFICATE || !form.documents.OWNER_ID) errors.documents = true
    if (!form.agree) errors.agree = true
  }
  return errors
}

export function toApplicationInput(form: ShopForm): ShopApplicationInput {
  return {
    name: form.name.trim(),
    categories: form.categories,
    description: form.description.trim(),
    phone: digits(form.phone),
    email: form.email.trim(),
    address: form.address.trim(),
    location: form.location,
    legalEntity: form.legalEntity,
    stir: form.stir.replace(/\s/g, ""),
    logo: form.logo,
    documents: (Object.entries(form.documents) as [DocumentKind, ShopFile][]).map(([kind, file]) => ({
      kind,
      fileName: file.fileName,
      size: file.size,
    })),
  }
}

/** Prefills the form from an application that is being fixed and resubmitted. */
export function formFromShop(shop: SellerShop): ShopForm {
  const app = shop.application
  if (!app) return { ...EMPTY_FORM, name: shop.name, categories: shop.categories }
  return {
    name: shop.name,
    description: app.description,
    categories: shop.categories,
    phone: formatPhone(app.phone),
    email: app.email,
    address: app.address,
    location: app.location,
    legalEntity: app.legalEntity,
    stir: app.stir,
    logo: app.logo,
    documents: Object.fromEntries(app.documents.map((d) => [d.kind, { fileName: d.fileName, size: d.size }])),
    agree: false,
  }
}

export type FileProblem = "tooLarge" | "badType"

const ACCEPTED_TYPES = /^(image\/|application\/pdf$)/

export function checkUpload(file: Pick<File, "size" | "type">, { imagesOnly = false } = {}): FileProblem | null {
  if (file.size > MAX_UPLOAD_BYTES) return "tooLarge"
  const ok = imagesOnly ? file.type.startsWith("image/") : ACCEPTED_TYPES.test(file.type)
  return ok ? null : "badType"
}
