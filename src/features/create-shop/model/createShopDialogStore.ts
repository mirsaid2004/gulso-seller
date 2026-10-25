import { create } from "zustand"

type DialogTarget = { mode: "create" } | { mode: "resubmit"; shopId: number }

interface CreateShopDialogState {
  /** null while closed */
  target: DialogTarget | null
  openCreate: () => void
  openResubmit: (shopId: number) => void
  close: () => void
}

/** Lets the shop switcher and the application page open the same dialog. */
export const useCreateShopDialog = create<CreateShopDialogState>()((set) => ({
  target: null,
  openCreate: () => set({ target: { mode: "create" } }),
  openResubmit: (shopId) => set({ target: { mode: "resubmit", shopId } }),
  close: () => set({ target: null }),
}))
