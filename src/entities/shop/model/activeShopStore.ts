import { create } from "zustand"
import { persist } from "zustand/middleware"

export const ACTIVE_SHOP_STORAGE_KEY = "active-shop"

interface ActiveShopState {
  activeShopId: number | null
  setActiveShopId: (id: number | null) => void
}

export const useActiveShopStore = create<ActiveShopState>()(
  persist(
    (set) => ({
      activeShopId: null,
      setActiveShopId: (activeShopId) => set({ activeShopId }),
    }),
    { name: ACTIVE_SHOP_STORAGE_KEY }
  )
)
