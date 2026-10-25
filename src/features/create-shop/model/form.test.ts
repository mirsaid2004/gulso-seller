import { describe, expect, it } from "vitest"
import type { SellerShop } from "@/entities/shop"
import { EMPTY_FORM, checkUpload, formFromShop, toApplicationInput, validateStep, type ShopForm } from "./form"

const filled: ShopForm = {
  ...EMPTY_FORM,
  name: "  Le Dessert ",
  description: "Pastries",
  categories: ["BAKERY"],
  phone: "90 123 45 67",
  email: " hello@ledessert.uz ",
  address: "Tashkent",
  legalEntity: "LLC",
  stir: "305123987",
  documents: {
    REGISTRATION_CERTIFICATE: { fileName: "cert.pdf", size: 10 },
    OWNER_ID: { fileName: "id.jpg", size: 20 },
  },
  agree: true,
}

describe("validateStep", () => {
  it("flags missing name and categories on step 1", () => {
    expect(validateStep(EMPTY_FORM, 1)).toEqual({ name: true, categories: true })
    expect(validateStep(filled, 1)).toEqual({})
  })

  it("checks phone, address and a 9-digit STIR on step 2", () => {
    expect(validateStep(EMPTY_FORM, 2)).toEqual({ phone: true, address: true, stir: true })
    expect(validateStep({ ...filled, phone: "90 123", stir: "12345678" }, 2)).toEqual({ phone: true, stir: true })
    expect(validateStep(filled, 2)).toEqual({})
  })

  it("requires both documents and the terms on step 3", () => {
    expect(validateStep(EMPTY_FORM, 3)).toEqual({ documents: true, agree: true })
    expect(
      validateStep({ ...filled, documents: { OWNER_ID: { fileName: "id.jpg", size: 1 } } }, 3)
    ).toEqual({ documents: true })
    expect(validateStep(filled, 3)).toEqual({})
  })
})

describe("toApplicationInput", () => {
  it("trims text, strips phone formatting and lists documents", () => {
    expect(toApplicationInput(filled)).toEqual({
      name: "Le Dessert",
      categories: ["BAKERY"],
      description: "Pastries",
      phone: "901234567",
      email: "hello@ledessert.uz",
      address: "Tashkent",
      location: null,
      legalEntity: "LLC",
      stir: "305123987",
      logo: null,
      documents: [
        { kind: "REGISTRATION_CERTIFICATE", fileName: "cert.pdf", size: 10 },
        { kind: "OWNER_ID", fileName: "id.jpg", size: 20 },
      ],
    })
  })
})

describe("formFromShop", () => {
  it("prefills from the application and asks for the terms again", () => {
    const shop: SellerShop = {
      id: 36,
      name: "Sovg'a Market",
      categories: ["GIFTS"],
      status: "CHANGES_REQUESTED",
      application: {
        ...toApplicationInput(filled),
        submittedAt: "2026-10-09T15:22:00",
        note: "Fix it",
      },
    }
    const form = formFromShop(shop)
    expect(form.name).toBe("Sovg'a Market")
    expect(form.phone).toBe("90 123 45 67")
    expect(form.documents.OWNER_ID).toEqual({ fileName: "id.jpg", size: 20 })
    expect(form.agree).toBe(false)
  })
})

describe("checkUpload", () => {
  it("accepts PDFs and images up to 10 MB", () => {
    expect(checkUpload({ size: 1000, type: "application/pdf" })).toBeNull()
    expect(checkUpload({ size: 1000, type: "image/png" })).toBeNull()
    expect(checkUpload({ size: 11 * 1024 * 1024, type: "image/png" })).toBe("tooLarge")
    expect(checkUpload({ size: 1000, type: "text/plain" })).toBe("badType")
  })

  it("only accepts images for the logo", () => {
    expect(checkUpload({ size: 1000, type: "application/pdf" }, { imagesOnly: true })).toBe("badType")
  })
})
