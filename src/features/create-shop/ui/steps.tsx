import { useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Check, FileText, ImagePlus, MapPin } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { DOCUMENT_KINDS, SHOP_CATEGORIES, formatFileSize, formatUzPhone, shopMonogram } from "@/entities/shop"
import type { CreateShopViewModel } from "../model/useCreateShopViewModel"
import { LocationPickerDialog } from "./LocationPickerDialog"

const inputClass =
  "h-11 w-full px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-900 outline-none shadow-2xs placeholder:text-slate-400 focus:border-ring focus:ring-[3px] focus:ring-ring/50"
const invalidClass = "bg-rose-50 border-rose-300"

function SectionLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
      {children}
    </label>
  )
}

function FieldError({ show, children }: { show?: boolean; children: ReactNode }) {
  if (!show) return null
  return <p role="alert" className="text-rose-500 text-[11px] font-bold">{children}</p>
}

type StepProps = { vm: CreateShopViewModel }

export function ShopStep({ vm }: StepProps) {
  const { t } = useTranslation()
  const { form, errors } = vm

  return (
    <>
      <section className="flex flex-col gap-3">
        <SectionLabel>{t("shops.form.whatDoYouSell")}</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {SHOP_CATEGORIES.map((c) => {
            const on = form.categories.includes(c.value)
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={on}
                onClick={() => vm.toggleCategory(c.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                  on
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                <span className="text-base">{c.emoji}</span>
                {t(`shops.categories.${c.value}`)}
              </button>
            )
          })}
        </div>
        <FieldError show={errors.categories}>{t("shops.form.errors.categories")}</FieldError>
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel>{t("shops.form.shopDetails")}</SectionLabel>
        <div className="flex gap-4 items-start">
          <label
            className={cn(
              "w-24 h-24 shrink-0 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer overflow-hidden transition-colors",
              form.logo ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-400 hover:bg-slate-50"
            )}
          >
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label={t("shops.form.logo")}
              onChange={(e) => vm.setLogo(e.target.files?.[0] ?? null)}
            />
            {vm.logoPreview ? (
              <img src={vm.logoPreview} alt="" className="w-full h-full object-cover" />
            ) : form.logo ? (
              <>
                <span className="text-2xl font-black">{shopMonogram(form.name)}</span>
                <span className="text-[9px] font-bold truncate max-w-20">{form.logo.fileName}</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                <span className="text-[9px] font-bold">{t("shops.form.logo")}</span>
              </>
            )}
          </label>
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="flex flex-col gap-1">
              <input
                value={form.name}
                onChange={(e) => vm.setText("name", e.target.value)}
                placeholder={t("shops.form.namePlaceholder")}
                aria-label={t("shops.form.namePlaceholder")}
                aria-invalid={errors.name}
                className={cn(inputClass, errors.name && invalidClass)}
              />
              <FieldError show={errors.name}>{t("shops.form.errors.name")}</FieldError>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => vm.setText("description", e.target.value)}
              rows={3}
              placeholder={t("shops.form.descriptionPlaceholder")}
              aria-label={t("shops.form.descriptionPlaceholder")}
              className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-medium text-slate-900 resize-none outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export function ContactStep({ vm }: StepProps) {
  const { t } = useTranslation()
  const { form, errors } = vm
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <>
      <section className="flex flex-col gap-3">
        <SectionLabel>{t("shops.form.contact")}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">+998</span>
              <input
                value={form.phone}
                onChange={(e) => vm.setPhone(e.target.value)}
                inputMode="tel"
                placeholder="90 123 45 67"
                aria-label={t("shops.form.phone")}
                aria-invalid={errors.phone}
                className={cn(inputClass, "pl-14", errors.phone && invalidClass)}
              />
            </div>
            <FieldError show={errors.phone}>{t("shops.form.errors.phone")}</FieldError>
          </div>
          <input
            type="email"
            value={form.email}
            onChange={(e) => vm.setText("email", e.target.value)}
            placeholder={t("shops.form.emailPlaceholder")}
            aria-label={t("shops.form.emailPlaceholder")}
            className={inputClass}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel>{t("shops.form.pickupAddress")}</SectionLabel>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <input
              value={form.address}
              onChange={(e) => vm.setText("address", e.target.value)}
              placeholder={t("shops.form.addressPlaceholder")}
              aria-label={t("shops.form.addressPlaceholder")}
              aria-invalid={errors.address}
              className={cn(inputClass, "flex-1 min-w-0", errors.address && invalidClass)}
            />
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className={cn(
                "h-11 px-3.5 shrink-0 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors",
                form.location
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-primary/10 bg-primary/5 text-primary hover:bg-primary/10"
              )}
            >
              {form.location ? <Check className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              {form.location ? t("shops.form.map.pinned") : t("shops.form.map.pick")}
            </button>
          </div>
          <FieldError show={errors.address}>{t("shops.form.errors.address")}</FieldError>
        </div>
        <LocationPickerDialog
          key={String(mapOpen)}
          open={mapOpen}
          onOpenChange={setMapOpen}
          value={form.location}
          onConfirm={(p) => {
            vm.setLocation(p)
            setMapOpen(false)
          }}
        />
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel>{t("shops.form.legalEntity")}</SectionLabel>
        <div className="flex gap-3 items-start flex-wrap">
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1" role="radiogroup" aria-label={t("shops.form.legalEntity")}>
            {(["YATT", "LLC"] as const).map((entity) => {
              const on = form.legalEntity === entity
              return (
                <button
                  key={entity}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => vm.setLegalEntity(entity)}
                  className={cn(
                    "h-9 px-3.5 rounded-lg text-xs font-black transition-all",
                    on ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t(`shops.legalEntity.${entity}`)}
                </button>
              )
            })}
          </div>
          <div className="flex-1 min-w-44 flex flex-col gap-1">
            <input
              value={form.stir}
              onChange={(e) => vm.setText("stir", e.target.value)}
              inputMode="numeric"
              placeholder={t("shops.form.stirPlaceholder")}
              aria-label={t("shops.form.stirPlaceholder")}
              aria-invalid={errors.stir}
              className={cn(inputClass, "tracking-wider", errors.stir && invalidClass)}
            />
            <FieldError show={errors.stir}>{t("shops.form.errors.stir")}</FieldError>
          </div>
        </div>
      </section>
    </>
  )
}

export function DocumentsStep({ vm }: StepProps) {
  const { t } = useTranslation()
  const { form, errors } = vm

  const reviewRows = [
    { k: t("shops.form.review.shop"), v: form.name || "—" },
    {
      k: t("shops.details.categories"),
      v: form.categories.length ? form.categories.map((c) => t(`shops.categories.${c}`)).join(", ") : "—",
    },
    { k: t("shops.details.phone"), v: form.phone ? formatUzPhone(form.phone) : "—" },
    { k: t("shops.details.address"), v: form.address || "—" },
    { k: t("shops.details.stir"), v: `${t(`shops.legalEntityShort.${form.legalEntity}`)} · ${form.stir || "—"}` },
  ]

  return (
    <>
      <section className="flex flex-col gap-3">
        <SectionLabel>{t("shops.form.documents")}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOCUMENT_KINDS.map((kind) => {
            const file = form.documents[kind]
            return (
              <label
                key={kind}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition-colors",
                  file
                    ? "border-emerald-200 bg-emerald-50"
                    : errors.documents
                      ? "border-rose-300"
                      : "border-slate-200 hover:bg-slate-50"
                )}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="sr-only"
                  aria-label={t(`shops.documents.${kind}`)}
                  onChange={(e) => vm.setDocument(kind, e.target.files?.[0] ?? null)}
                />
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center",
                    file ? "bg-emerald-100 text-emerald-700" : "bg-primary/5 text-primary"
                  )}
                >
                  <FileText className="w-[18px] h-[18px]" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[13px] font-bold text-slate-900">{t(`shops.documents.${kind}`)}</span>
                  <span className={cn("text-[11px] font-semibold truncate", file ? "text-emerald-700" : "text-slate-400")}>
                    {file
                      ? t("shops.form.uploaded", { name: file.fileName, size: formatFileSize(file.size) })
                      : t("shops.form.uploadHint")}
                  </span>
                </div>
              </label>
            )
          })}
        </div>
        <FieldError show={errors.documents}>{t("shops.form.errors.documents")}</FieldError>
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel>{t("shops.form.review.title")}</SectionLabel>
        <dl className="bg-slate-50 rounded-[1.25rem] p-5 flex flex-col gap-3">
          {reviewRows.map((r) => (
            <div key={r.k} className="flex justify-between gap-4 text-[13px]">
              <dt className="text-slate-400 font-medium shrink-0">{r.k}</dt>
              <dd className="text-slate-900 font-bold text-right">{r.v}</dd>
            </div>
          ))}
        </dl>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={form.agree} onChange={vm.toggleAgree} className="peer sr-only" />
          <span
            aria-hidden
            className={cn(
              "w-[18px] h-[18px] shrink-0 mt-px rounded-[5px] border flex items-center justify-center text-white peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
              form.agree ? "bg-primary border-primary" : "bg-white border-slate-300"
            )}
          >
            <Check className="w-3 h-3" strokeWidth={3} />
          </span>
          <span className="text-[13px] font-medium text-slate-600">{t("shops.form.agree")}</span>
        </label>
        <FieldError show={errors.agree}>{t("shops.form.errors.agree")}</FieldError>
      </section>
    </>
  )
}
