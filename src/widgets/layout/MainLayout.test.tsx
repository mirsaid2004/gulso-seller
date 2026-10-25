import { describe, expect, it } from "vitest"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/render"
import { db } from "@/mocks/db"
import { useActiveShopStore } from "@/entities/shop"
import { MainLayout } from "./MainLayout"

function renderLayout() {
  const user = userEvent.setup()
  renderWithProviders(
    <MainLayout>
      <div>Products page</div>
    </MainLayout>
  )
  return user
}

async function openSwitcher(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: "Switch shop" }))
  return screen.findByRole("menu", { name: "Your shops" })
}

async function pickShop(user: ReturnType<typeof userEvent.setup>, name: RegExp) {
  const menu = await openSwitcher(user)
  await user.click(within(menu).getByRole("menuitemradio", { name }))
}

const file = (name: string, type: string) => new File(["x"], name, { type })

describe("MainLayout shop switching", () => {
  it("opens the first live shop and remembers it", async () => {
    renderLayout()
    expect(await screen.findByText("Products page")).toBeInTheDocument()
    expect(screen.getByRole("banner")).toHaveTextContent("Gullar do'koni")
    expect(useActiveShopStore.getState().activeShopId).toBe(1)
  })

  it("lists every shop with its review status", async () => {
    const user = renderLayout()
    const menu = await openSwitcher(user)
    const rows = within(menu).getAllByRole("menuitemradio")
    expect(rows.map((r) => r.textContent)).toEqual([
      expect.stringContaining("Gullar do'koni"),
      expect.stringContaining("Flora Art"),
      expect.stringContaining("Bake & BloomUNDER REVIEW"),
      expect.stringContaining("Sovg'a MarketNEEDS CHANGES"),
    ])
    expect(within(menu).getByRole("menuitemradio", { name: /Gullar/ })).toHaveAttribute("aria-checked", "true")
  })

  it("switches to another live shop", async () => {
    const user = renderLayout()
    await screen.findByText("Products page")
    await pickShop(user, /Flora Art/)
    expect(screen.getByRole("banner")).toHaveTextContent("Flora Art")
    expect(useActiveShopStore.getState().activeShopId).toBe(4)
    expect(screen.getByText("Products page")).toBeInTheDocument()
  })

  it("shows the application status instead of the dashboard for a pending shop", async () => {
    const user = renderLayout()
    await screen.findByText("Products page")
    await pickShop(user, /Bake & Bloom/)

    expect(await screen.findByRole("heading", { name: "Bake & Bloom" })).toBeInTheDocument()
    expect(screen.queryByText("Products page")).not.toBeInTheDocument()
    expect(screen.getByText("Review by Gulso maintainers")).toBeInTheDocument()
    const details = screen.getByRole("region", { name: "Submitted details" })
    expect(details).toHaveTextContent("+998 90 123 45 67")
    expect(details).toHaveTextContent("2 files")
    expect(screen.getByRole("link", { name: "Products" }).closest("[aria-disabled]")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })

  it("opens an approved shop from its application page", async () => {
    db.shops.find((s) => s.id === 41)!.status = "APPROVED"
    useActiveShopStore.setState({ activeShopId: 41 })
    const user = renderLayout()

    await user.click(await screen.findByRole("button", { name: /Open shop dashboard/ }))
    expect(await screen.findByText("Products page")).toBeInTheDocument()
    expect(await screen.findByText("Welcome to Bake & Bloom")).toBeInTheDocument()
    expect(db.shops.find((s) => s.id === 41)!.status).toBe("ACTIVE")
  })

  it("opens an approved shop straight from the switcher", async () => {
    db.shops.find((s) => s.id === 41)!.status = "APPROVED"
    const user = renderLayout()
    await screen.findByText("Products page")
    await pickShop(user, /Bake & Bloom/)

    await waitFor(() => expect(screen.getByRole("banner")).toHaveTextContent("Bake & Bloom"))
    expect(screen.getByText("Products page")).toBeInTheDocument()
  })
})

describe("Adding a shop", () => {
  it("walks through the three steps and lands on the new application", async () => {
    const user = renderLayout()
    await screen.findByText("Products page")
    await user.click(await screen.findByRole("button", { name: "Switch shop" }))
    await user.click(screen.getByRole("button", { name: /Add a shop/ }))

    const dialog = await screen.findByRole("dialog", { name: "Add a new shop" })
    const d = within(dialog)

    // Step 1 — validation, then shop details
    await user.click(d.getByRole("button", { name: "Continue" }))
    expect(d.getByText("Shop name is required")).toBeInTheDocument()
    expect(d.getByText("Pick at least one category")).toBeInTheDocument()
    await user.type(d.getByRole("textbox", { name: "Shop name" }), "Le Petit Four")
    await user.click(d.getByRole("button", { name: /Bakery/ }))
    await user.upload(d.getByLabelText("Shop logo"), file("logo.png", "image/png"))
    await user.click(d.getByRole("button", { name: "Continue" }))

    // Step 2 — contact & legal
    await user.click(d.getByRole("button", { name: "Continue" }))
    expect(d.getByText("STIR must be 9 digits")).toBeInTheDocument()
    await user.type(d.getByRole("textbox", { name: "Shop phone" }), "901112233")
    expect(d.getByRole("textbox", { name: "Shop phone" })).toHaveValue("90 111 22 33")
    await user.type(d.getByRole("textbox", { name: /City, district/ }), "Tashkent, Chilonzor 5")
    await user.click(d.getByRole("radio", { name: "LLC (MChJ)" }))
    await user.type(d.getByRole("textbox", { name: /STIR/ }), "30a5123987")
    expect(d.getByRole("textbox", { name: /STIR/ })).toHaveValue("305123987")
    await user.click(d.getByRole("button", { name: "Continue" }))

    // Step 3 — documents & review
    expect(d.getByText("+998 90 111 22 33")).toBeInTheDocument()
    expect(d.getByText("LLC · 305123987")).toBeInTheDocument()
    await user.click(d.getByRole("button", { name: "Send for review" }))
    expect(d.getByText("Upload both documents")).toBeInTheDocument()
    await user.upload(d.getByLabelText("Registration certificate"), file("guvohnoma.pdf", "application/pdf"))
    await user.upload(d.getByLabelText("Owner's passport / ID"), file("passport.jpg", "image/jpeg"))
    await user.click(d.getByRole("checkbox"))
    await user.click(d.getByRole("button", { name: "Send for review" }))

    const done = await screen.findByRole("dialog", { name: "Application sent" })
    expect(within(done).getByRole("button", { name: "Back to Gullar do'koni" })).toBeInTheDocument()
    await user.click(within(done).getByRole("button", { name: "View application" }))

    expect(await screen.findByRole("heading", { name: "Le Petit Four" })).toBeInTheDocument()
    expect(screen.getByText("UNDER REVIEW")).toBeInTheDocument()
    const created = db.shops.find((s) => s.name === "Le Petit Four")!
    expect(created).toMatchObject({ status: "PENDING", ownerId: 123, categories: ["BAKERY"] })
    expect(created.application).toMatchObject({ phone: "901112233", legalEntity: "LLC", logo: { fileName: "logo.png" } })
    expect(useActiveShopStore.getState().activeShopId).toBe(created.id)
  })

  it("rejects files that are too large", async () => {
    const user = renderLayout()
    await screen.findByText("Products page")
    await user.click(await screen.findByRole("button", { name: "Switch shop" }))
    await user.click(screen.getByRole("button", { name: /Add a shop/ }))
    const dialog = await screen.findByRole("dialog", { name: "Add a new shop" })

    const big = new File([new Uint8Array(11 * 1024 * 1024)], "huge.png", { type: "image/png" })
    await user.upload(within(dialog).getByLabelText("Shop logo"), big)
    expect(await screen.findByText("File is larger than 10 MB")).toBeInTheDocument()
  })

  it("resubmits an application after changes were requested", async () => {
    useActiveShopStore.setState({ activeShopId: 36 })
    const user = renderLayout()

    expect(await screen.findByText(/certificate photo is unreadable/)).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Fix & resubmit" }))

    const dialog = await screen.findByRole("dialog", { name: "Update application" })
    const d = within(dialog)
    expect(d.getByText("certificate.jpg · 2.2 MB")).toBeInTheDocument()
    await user.upload(d.getByLabelText("Registration certificate"), file("clear-scan.pdf", "application/pdf"))
    await user.click(d.getByRole("checkbox"))
    await user.click(d.getByRole("button", { name: "Resubmit" }))

    await user.click(await screen.findByRole("button", { name: "View application" }))
    await waitFor(() => expect(screen.getByText("UNDER REVIEW")).toBeInTheDocument())
    const shop = db.shops.find((s) => s.id === 36)!
    expect(shop.status).toBe("PENDING")
    expect(shop.application).toMatchObject({ resubmitted: true })
    expect(shop.application!.documents).toContainEqual(expect.objectContaining({ fileName: "clear-scan.pdf" }))
  })
})
