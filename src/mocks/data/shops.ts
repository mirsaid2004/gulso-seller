import type { SellerShop } from "@/entities/shop"

export const SEED_SELLER_ID = 123

export interface DbShop extends SellerShop {
  ownerId: number
}

// Shop ids line up with db.json companies, so product.companyId points at the shop.
export const shopsSeed: DbShop[] = [
  { id: 1, ownerId: SEED_SELLER_ID, name: "Gullar do'koni", categories: ["FLOWERS"], status: "ACTIVE", application: null },
  { id: 4, ownerId: SEED_SELLER_ID, name: "Flora Art", categories: ["FLOWERS", "GIFTS"], status: "ACTIVE", application: null },
  { id: 2, ownerId: 200, name: "Sweet Dreams", categories: ["BAKERY"], status: "ACTIVE", application: null },
  { id: 3, ownerId: 201, name: "Le Dessert", categories: ["BAKERY"], status: "ACTIVE", application: null },
  {
    id: 41,
    ownerId: SEED_SELLER_ID,
    name: "Bake & Bloom",
    categories: ["BAKERY", "FLOWERS"],
    status: "PENDING",
    application: {
      description: "Morning pastries paired with small seasonal bouquets — a breakfast-gift shop.",
      phone: "901234567",
      email: "",
      address: "Tashkent, Yunusobod, Amir Temur Ave 107",
      location: { lat: 41.3385, lng: 69.2853 },
      legalEntity: "LLC",
      stir: "305123987",
      logo: { fileName: "logo.png", size: 48_213 },
      documents: [
        { kind: "REGISTRATION_CERTIFICATE", fileName: "guvohnoma.pdf", size: 412_331 },
        { kind: "OWNER_ID", fileName: "passport.jpg", size: 1_204_558 },
      ],
      submittedAt: "2026-10-14T09:12:00",
    },
  },
  {
    id: 36,
    ownerId: SEED_SELLER_ID,
    name: "Sovg'a Market",
    categories: ["GIFTS"],
    status: "CHANGES_REQUESTED",
    application: {
      description: "Gift baskets for holidays and corporate orders.",
      phone: "903186409",
      email: "",
      address: "Tashkent, Shayxontohur, Navoiy St 30",
      location: null,
      legalEntity: "LLC",
      stir: "309877412",
      logo: null,
      documents: [
        { kind: "REGISTRATION_CERTIFICATE", fileName: "certificate.jpg", size: 2_310_004 },
        { kind: "OWNER_ID", fileName: "passport.pdf", size: 640_120 },
      ],
      submittedAt: "2026-10-09T15:22:00",
      note: "The registration certificate photo is unreadable. Please upload a clear scan or PDF.",
    },
  },
]
