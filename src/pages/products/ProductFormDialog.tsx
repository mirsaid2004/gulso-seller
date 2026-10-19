import { useState, useRef, useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Trash2, ImagePlus, Loader2, Wand2, X } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { cn } from "@/shared/lib/utils"
import { type CreateProductRequest, type ProductDetailedResponse, type Lang } from "@/types"
import { translateProduct } from "@/lib/gemini"
import { useTranslation } from "react-i18next"

// ── constants ─────────────────────────────────────────────────────────────────
const CATEGORY_VALUES = ["FLOWERS", "GIFTS", "BAKERY"] as const
type CategoryValue = (typeof CATEGORY_VALUES)[number]

const CATEGORY_EMOJIS: Record<CategoryValue, string> = {
  FLOWERS: "🌸",
  GIFTS: "🎁",
  BAKERY: "🎂",
}

const LANG_TABS: { key: Lang; label: string }[] = [
  { key: "uz", label: "UZ" },
  { key: "ru", label: "RU" },
  { key: "en", label: "EN" },
]

const EMPTY_TRANS = { name: "", description: "", specifications: [] as { value: string }[] }

// ── component ─────────────────────────────────────────────────────────────────
interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingProduct?: ProductDetailedResponse | null
  onSubmit: (data: CreateProductRequest) => Promise<void>
  isSubmitting: boolean
}

export function ProductFormDialog({
  open,
  onOpenChange,
  editingProduct,
  onSubmit,
  isSubmitting,
}: ProductFormDialogProps) {
  const { t } = useTranslation()
  const [activeLang, setActiveLang] = useState<Lang>("uz")
  const [, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formSchema = z.object({
    category: z.enum(CATEGORY_VALUES),
    translations: z.object({
      uz: z.object({
        name: z.string().min(1, t("products.form.validation.nameRequired")),
        description: z.string(),
        specifications: z.array(z.object({ value: z.string() })),
      }),
      ru: z.object({
        name: z.string(),
        description: z.string(),
        specifications: z.array(z.object({ value: z.string() })),
      }),
      en: z.object({
        name: z.string(),
        description: z.string(),
        specifications: z.array(z.object({ value: z.string() })),
      }),
    }),
    price: z.number().positive(t("products.form.validation.priceMin")),
    discount: z.number().min(0).max(100).optional(),
    stockQuantity: z.number().int().min(0, t("products.form.validation.quantityMin")),
  })

  type FormValues = z.infer<typeof formSchema>

  const { control, register, handleSubmit, formState: { errors }, reset, watch, setValue, getValues } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        category: "FLOWERS",
        translations: { uz: EMPTY_TRANS, ru: EMPTY_TRANS, en: EMPTY_TRANS },
        price: "" as unknown as number,
        discount: 0,
        stockQuantity: "" as unknown as number,
      },
    })

  const selectedCategory = watch("category")

  const uzSpecs = useFieldArray({ control, name: "translations.uz.specifications" })
  const ruSpecs = useFieldArray({ control, name: "translations.ru.specifications" })
  const enSpecs = useFieldArray({ control, name: "translations.en.specifications" })
  const langSpecs = { uz: uzSpecs, ru: ruSpecs, en: enSpecs }

  useEffect(() => {
    if (!open) return

    if (editingProduct) {
      const toFields = (specs: string[]) => (specs ?? []).map((v) => ({ value: v }))
      reset({
        category: editingProduct.category as CategoryValue,
        translations: {
          uz: {
            name: editingProduct.translations?.uz?.name ?? "",
            description: editingProduct.translations?.uz?.description ?? "",
            specifications: toFields(editingProduct.translations?.uz?.specifications ?? []),
          },
          ru: {
            name: editingProduct.translations?.ru?.name ?? "",
            description: editingProduct.translations?.ru?.description ?? "",
            specifications: toFields(editingProduct.translations?.ru?.specifications ?? []),
          },
          en: {
            name: editingProduct.translations?.en?.name ?? "",
            description: editingProduct.translations?.en?.description ?? "",
            specifications: toFields(editingProduct.translations?.en?.specifications ?? []),
          },
        },
        price: editingProduct.price,
        discount: editingProduct.discount ?? 0,
        stockQuantity: editingProduct.stockQuantity,
      })
      setImagePreviews(editingProduct.media?.map((m) => m.url) ?? [])
      setImageFiles([])
    } else {
      reset({
        category: "FLOWERS",
        translations: { uz: EMPTY_TRANS, ru: EMPTY_TRANS, en: EMPTY_TRANS },
        price: "" as unknown as number,
        discount: 0,
        stockQuantity: "" as unknown as number,
      })
      setImagePreviews([])
      setImageFiles([])
    }
    setActiveLang("uz")
    setTranslateError(null)
  }, [open, editingProduct, reset])

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const dataUrls = await Promise.all(
      files.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (ev) => resolve(ev.target?.result as string)
            reader.readAsDataURL(f)
          })
      )
    )
    setImageFiles((prev) => [...prev, ...files])
    setImagePreviews((prev) => [...prev, ...dataUrls])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeImage(idx: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx))
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleAutoTranslate() {
    const current = getValues(`translations.${activeLang}`)
    if (!current.name.trim()) {
      setTranslateError(t("products.form.enterNameFirst"))
      return
    }
    setIsTranslating(true)
    setTranslateError(null)
    try {
      const result = await translateProduct(activeLang, {
        name: current.name,
        description: current.description,
        specifications: current.specifications.map((s) => s.value).filter(Boolean),
      })
      for (const [lang, data] of Object.entries(result) as [Lang, (typeof result)[Lang]][]) {
        if (!data) continue
        setValue(`translations.${lang}.name`, data.name, { shouldDirty: true })
        setValue(`translations.${lang}.description`, data.description, { shouldDirty: true })
        langSpecs[lang].replace(data.specifications.map((v) => ({ value: v })))
      }
    } catch (e) {
      setTranslateError(e instanceof Error ? e.message : t("products.form.translateError"))
    } finally {
      setIsTranslating(false)
    }
  }

  async function onFormSubmit(values: FormValues) {
    const payload: CreateProductRequest = {
      category: values.category,
      translations: {
        uz: {
          name: values.translations.uz.name,
          description: values.translations.uz.description,
          specifications: values.translations.uz.specifications.map((s) => s.value).filter(Boolean),
        },
        ru: {
          name: values.translations.ru.name,
          description: values.translations.ru.description,
          specifications: values.translations.ru.specifications.map((s) => s.value).filter(Boolean),
        },
        en: {
          name: values.translations.en.name,
          description: values.translations.en.description,
          specifications: values.translations.en.specifications.map((s) => s.value).filter(Boolean),
        },
      },
      price: values.price,
      discount: values.discount ?? 0,
      stockQuantity: values.stockQuantity,
      imageUrls: imagePreviews.length > 0 ? imagePreviews : undefined,
    }
    await onSubmit(payload)
  }

  const specs = langSpecs[activeLang]
  const transErrors = errors.translations?.[activeLang]
  const isEditing = !!editingProduct

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-w-2xl w-full rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col max-h-[90vh]">
          <DialogHeader className="px-8 pt-8 pb-4 shrink-0">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
              {isEditing ? t("products.form.editTitle") : t("products.form.createTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-8 pb-2 space-y-7">
            {/* Category */}
            <section className="space-y-3">
              <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("products.form.category")}
              </label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <div className="flex gap-2">
                    {CATEGORY_VALUES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                          selectedCategory === value
                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                            : "bg-slate-50 text-slate-600 border-slate-100 hover:border-primary/30"
                        )}
                      >
                        <span className="text-base">{CATEGORY_EMOJIS[value]}</span>
                        {t(`products.form.categoryOptions.${value.toLowerCase()}`)}
                      </button>
                    ))}
                  </div>
                )}
              />
            </section>

            {/* Language tabs + auto-translate */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase shrink-0">
                  {t("products.form.info")}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={isTranslating}
                    title={t("products.form.autoTranslateTitle")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-primary/5 text-primary hover:bg-primary/10 disabled:opacity-50 transition-all border border-primary/10"
                  >
                    {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    {t("products.form.autoTranslate")}
                  </button>
                  <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                    {LANG_TABS.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => { setActiveLang(tab.key); setTranslateError(null) }}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-black transition-all",
                          activeLang === tab.key
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-700"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {translateError && (
                <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-100">
                  <span className="text-xs text-rose-500 font-bold">{translateError}</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Name */}
                <div>
                  <Input
                    {...register(`translations.${activeLang}.name`)}
                    placeholder={`${t("products.form.namePlaceholder")} (${activeLang.toUpperCase()})`}
                    className={cn(
                      "rounded-xl h-11 bg-slate-50 border-slate-100 text-sm font-medium",
                      transErrors?.name && "border-rose-300 bg-rose-50"
                    )}
                  />
                  {transErrors?.name && (
                    <p className="text-rose-500 text-[11px] font-bold mt-1">{transErrors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <textarea
                  {...register(`translations.${activeLang}.description`)}
                  placeholder={`${t("products.form.descPlaceholder")} (${activeLang.toUpperCase()})`}
                  rows={3}
                  className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />

                {/* Specifications */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500">{t("products.form.specs")}</span>
                    <button
                      type="button"
                      onClick={() => specs.append({ value: "" })}
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t("products.form.addSpec")}
                    </button>
                  </div>
                  {specs.fields.length === 0 && (
                    <p className="text-xs text-slate-300 font-medium italic">{t("products.form.specsHint")}</p>
                  )}
                  <div className="space-y-2">
                    {specs.fields.map((field, idx) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                        <Input
                          {...register(`translations.${activeLang}.specifications.${idx}.value`)}
                          placeholder={t("products.form.specPlaceholder", { n: idx + 1 })}
                          className="flex-1 rounded-xl h-9 bg-slate-50 border-slate-100 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => specs.remove(idx)}
                          className="w-8 h-8 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-50 transition-all flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Price, Discount, Stock */}
            <section className="space-y-3">
              <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("products.form.priceSection")}
              </label>
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <div className="relative">
                    <Input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      min={0}
                      placeholder={t("products.form.pricePlaceholder")}
                      className={cn(
                        "rounded-xl h-11 bg-slate-50 border-slate-100 pr-14",
                        errors.price && "border-rose-300 bg-rose-50"
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {t("common.som")}
                    </span>
                  </div>
                  {errors.price && <p className="text-rose-500 text-[11px] font-bold">{errors.price.message}</p>}
                </div>

                <div className="w-20 space-y-1">
                  <div className="relative">
                    <Input
                      {...register("discount", { valueAsNumber: true })}
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0"
                      className="rounded-xl h-11 bg-slate-50 border-slate-100 pr-7 text-center"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

                <div className="w-28 space-y-1">
                  <Input
                    {...register("stockQuantity", { valueAsNumber: true })}
                    type="number"
                    min={0}
                    placeholder={t("products.form.quantityPlaceholder")}
                    className={cn(
                      "rounded-xl h-11 bg-slate-50 border-slate-100",
                      errors.stockQuantity && "border-rose-300 bg-rose-50"
                    )}
                  />
                  {errors.stockQuantity && (
                    <p className="text-rose-500 text-[11px] font-bold">{errors.stockQuantity.message}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 text-[10px] font-bold text-slate-400 pl-0.5">
                <span className="flex-1">{t("products.form.priceLabel")}</span>
                <span className="w-20 text-center">{t("products.form.discountLabel")}</span>
                <span className="w-28">{t("products.form.quantityLabel")}</span>
              </div>
            </section>

            {/* Images */}
            <section className="space-y-3">
              <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("products.form.images")}
              </label>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden group">
                    <img src={src} className="w-full h-full object-cover" alt="" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded-md">
                        {t("products.form.mainImage")}
                      </span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-[9px] font-bold">{t("products.form.addImage")}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {imagePreviews.length === 0 && (
                <p className="text-[11px] text-slate-400 font-medium">{t("products.form.imagesHint")}</p>
              )}
            </section>
          </div>

          <DialogFooter className="px-8 py-5 border-t border-slate-50 shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11 px-6 font-bold text-slate-500"
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-white font-black italic gap-2 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEditing ? t("products.form.save") : t("products.form.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
