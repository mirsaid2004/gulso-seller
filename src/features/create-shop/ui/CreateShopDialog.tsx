import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { Clock, Loader2 } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/dialog"
import { useCreateShopDialog } from "../model/createShopDialogStore"
import { useCreateShopViewModel, type CreateShopViewModel } from "../model/useCreateShopViewModel"
import { LAST_STEP, type FormStep } from "../model/form"
import { ContactStep, DocumentsStep, ShopStep } from "./steps"

const STEPS: FormStep[] = [1, 2, 3]

function Stepper({ current }: { current: FormStep }) {
  const { t } = useTranslation()
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((n) => {
        const done = n < current
        const isCurrent = n === current
        return (
          <Fragment key={n}>
            <li className="flex items-center gap-2 shrink-0" aria-current={isCurrent ? "step" : undefined}>
              <span
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black",
                  done || isCurrent ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={cn(
                  "text-xs font-black",
                  isCurrent ? "text-slate-900" : done ? "text-primary" : "text-slate-400"
                )}
              >
                {t(`shops.form.steps.${n}`)}
              </span>
            </li>
            {n < LAST_STEP && (
              <li aria-hidden className={cn("flex-1 h-0.5 rounded-full", done ? "bg-primary" : "bg-slate-100")} />
            )}
          </Fragment>
        )
      })}
    </ol>
  )
}

const primaryButton =
  "h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-black italic text-sm whitespace-nowrap shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60"

function FormView({ vm }: { vm: CreateShopViewModel }) {
  const { t } = useTranslation()
  const nextLabel =
    vm.step < LAST_STEP ? t("shops.form.continue") : vm.isEditing ? t("shops.form.resubmit") : t("shops.form.send")

  return (
    <>
      <div className="px-8 pt-8 pb-4 shrink-0 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-2xl leading-none font-black text-slate-900 tracking-tight">
            {vm.isEditing ? t("shops.form.updateTitle") : t("shops.form.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400 font-medium">{t("shops.form.subtitle")}</DialogDescription>
        </div>
        <Stepper current={vm.step} />
      </div>

      <form
        id="create-shop-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          vm.next()
        }}
        className="overflow-y-auto flex-1 px-8 py-2 flex flex-col gap-7"
      >
        {vm.step === 1 && <ShopStep vm={vm} />}
        {vm.step === 2 && <ContactStep vm={vm} />}
        {vm.step === 3 && <DocumentsStep vm={vm} />}
      </form>

      <div className="px-8 py-5 border-t border-slate-50 shrink-0 flex justify-end gap-2">
        <button
          type="button"
          onClick={vm.back}
          className="h-11 px-6 rounded-xl text-slate-500 font-bold text-sm hover:bg-accent transition-colors"
        >
          {vm.step === 1 ? t("common.cancel") : t("common.back")}
        </button>
        <button
          type="submit"
          form="create-shop-form"
          disabled={vm.isSubmitting}
          className={cn(primaryButton, "px-8 flex items-center gap-2")}
        >
          {vm.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {nextLabel}
        </button>
      </div>
    </>
  )
}

function DoneView({ vm }: { vm: CreateShopViewModel }) {
  const { t } = useTranslation()
  return (
    <div className="px-10 pt-12 pb-10 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 text-primary flex items-center justify-center">
        <Clock className="w-7 h-7" />
      </div>
      <div className="flex flex-col gap-2">
        <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">{t("shops.done.title")}</DialogTitle>
        <DialogDescription className="text-sm text-slate-500 font-medium max-w-[420px] text-pretty">
          <strong className="text-slate-900">{vm.submitted?.name}</strong> {t("shops.done.body")}
        </DialogDescription>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap justify-center">
        {vm.previousShopName && (
          <button
            type="button"
            onClick={vm.backToPrevious}
            className="h-11 px-6 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            {t("shops.done.backTo", { name: vm.previousShopName })}
          </button>
        )}
        <button type="button" onClick={vm.viewApplication} className={cn(primaryButton, "px-6")}>
          {t("shops.done.view")}
        </button>
      </div>
    </div>
  )
}

function DialogBody() {
  const vm = useCreateShopViewModel()
  return vm.submitted ? <DoneView vm={vm} /> : <FormView vm={vm} />
}

export function CreateShopDialog() {
  const target = useCreateShopDialog((s) => s.target)
  const close = useCreateShopDialog((s) => s.close)

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[672px] w-full max-h-[90vh] p-0 gap-0 flex flex-col rounded-[2rem] border-none shadow-2xl overflow-hidden bg-background">
        {/* Remount per opening so every dialog starts from a fresh form. */}
        {target && <DialogBody key={target.mode === "resubmit" ? `resubmit-${target.shopId}` : "create"} />}
      </DialogContent>
    </Dialog>
  )
}
