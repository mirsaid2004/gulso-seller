import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { formatPhone } from "@/shared/lib/phone"
import type { ProductCategory } from "@/types"
import {
  shopApi,
  upsertShopInCache,
  useActiveShop,
  useSwitchShop,
  type DocumentKind,
  type SellerShop,
} from "@/entities/shop"
import {
  EMPTY_FORM,
  LAST_STEP,
  checkUpload,
  formFromShop,
  toApplicationInput,
  validateStep,
  type FormErrors,
  type FormStep,
  type ShopForm,
} from "./form"
import { useCreateShopDialog } from "./createShopDialogStore"

type TextField = "name" | "description" | "email" | "address" | "stir"

/** View-model for one opening of the "Add a shop" / "Update application" dialog. */
export function useCreateShopViewModel() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const switchShop = useSwitchShop()
  const { shop: activeShop, shops } = useActiveShop()
  const target = useCreateShopDialog((s) => s.target)
  const closeDialog = useCreateShopDialog((s) => s.close)

  const editing = target?.mode === "resubmit" ? shops.find((s) => s.id === target.shopId) ?? null : null

  // Captured once per opening: the dialog may outlive changes to the active shop.
  const [previousShop] = useState<SellerShop | null>(activeShop)
  const [form, setForm] = useState<ShopForm>(() => (editing ? formFromShop(editing) : EMPTY_FORM))
  const [step, setStep] = useState<FormStep>(editing ? LAST_STEP : 1)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState<SellerShop | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview)
  }, [logoPreview])

  const mutation = useMutation({
    mutationFn: async (f: ShopForm) => {
      const input = toApplicationInput(f)
      const res = editing ? await shopApi.resubmit(editing.id, input) : await shopApi.apply(input)
      return res.data
    },
    onSuccess: (shop) => {
      upsertShopInCache(queryClient, shop)
      setSubmitted(shop)
    },
    onError: (err) => {
      toast.error(t("shops.form.submitFailed"), { description: err instanceof Error ? err.message : undefined })
    },
  })

  function patch(next: Partial<ShopForm>) {
    setForm((f) => ({ ...f, ...next }))
    setErrors({})
  }

  function setText(field: TextField, value: string) {
    patch({ [field]: field === "stir" ? value.replace(/\D/g, "").slice(0, 9) : value })
  }

  function setPhone(value: string) {
    patch({ phone: formatPhone(value) })
  }

  function toggleCategory(category: ProductCategory) {
    const has = form.categories.includes(category)
    patch({ categories: has ? form.categories.filter((c) => c !== category) : [...form.categories, category] })
  }

  function rejectUpload(file: File, imagesOnly: boolean): boolean {
    const problem = checkUpload(file, { imagesOnly })
    if (problem) toast.error(t(`shops.form.upload.${problem}`))
    return problem !== null
  }

  function setLogo(file: File | null) {
    if (file && rejectUpload(file, true)) return
    setLogoPreview(file ? URL.createObjectURL(file) : null)
    patch({ logo: file ? { fileName: file.name, size: file.size } : null })
  }

  function setDocument(kind: DocumentKind, file: File | null) {
    if (file && rejectUpload(file, false)) return
    const documents = { ...form.documents }
    if (file) documents[kind] = { fileName: file.name, size: file.size }
    else delete documents[kind]
    patch({ documents })
  }

  function next() {
    if (mutation.isPending) return
    const found = validateStep(form, step)
    setErrors(found)
    if (Object.keys(found).length) return
    if (step < LAST_STEP) setStep((step + 1) as FormStep)
    else mutation.mutate(form)
  }

  function back() {
    if (step === 1) closeDialog()
    else {
      setErrors({})
      setStep((step - 1) as FormStep)
    }
  }

  function viewApplication() {
    if (submitted) switchShop(submitted.id)
    closeDialog()
  }

  function backToPrevious() {
    if (previousShop) switchShop(previousShop.id)
    closeDialog()
  }

  return {
    isEditing: !!editing,
    step,
    form,
    errors,
    logoPreview,
    isSubmitting: mutation.isPending,
    submitted,
    previousShopName: previousShop?.name ?? null,
    setText,
    setPhone,
    setLegalEntity: (legalEntity: ShopForm["legalEntity"]) => patch({ legalEntity }),
    setLocation: (location: ShopForm["location"]) => patch({ location }),
    toggleAgree: () => patch({ agree: !form.agree }),
    toggleCategory,
    setLogo,
    setDocument,
    next,
    back,
    close: closeDialog,
    viewApplication,
    backToPrevious,
  }
}

export type CreateShopViewModel = ReturnType<typeof useCreateShopViewModel>
