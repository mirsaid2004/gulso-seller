import "@testing-library/jest-dom/vitest"
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest"
import { cleanup } from "@testing-library/react"
import i18n from "@/i18n"
import { server } from "@/mocks/server"
import { resetDb } from "@/mocks/db"
import { useActiveShopStore } from "@/entities/shop"
import { useCreateShopDialog } from "@/features/create-shop"
import { signIn, signOut } from "./session"

beforeAll(async () => {
  server.listen({ onUnhandledRequest: "error" })
  // Tests assert English copy.
  await i18n.changeLanguage("en")
})

// Every test starts signed in as the seeded seller.
beforeEach(() => signIn())

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetDb()
  signOut()
  useActiveShopStore.setState({ activeShopId: null })
  useCreateShopDialog.setState({ target: null })
  localStorage.clear()
})

afterAll(() => server.close())

// jsdom lacks APIs Radix and the file previews call.
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}
URL.createObjectURL ??= () => "blob:preview"
URL.revokeObjectURL ??= () => {}
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
