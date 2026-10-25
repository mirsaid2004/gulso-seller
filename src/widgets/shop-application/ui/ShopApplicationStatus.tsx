import { useTranslation } from "react-i18next"
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Plus, Store } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { SHOP_STATUS_BADGE } from "@/entities/shop"
import { useShopApplicationViewModel, type TimelineState } from "../model/useShopApplicationViewModel"

const TIMELINE_STYLE: Record<TimelineState, { icon: typeof Clock; box: string; title: string }> = {
  done: { icon: CheckCircle2, box: "bg-emerald-100 text-emerald-700", title: "text-slate-900" },
  waiting: { icon: Clock, box: "bg-amber-100 text-amber-700", title: "text-slate-900" },
  alert: { icon: AlertCircle, box: "bg-rose-100 text-rose-700", title: "text-slate-900" },
  todo: { icon: Store, box: "bg-slate-50 text-slate-300", title: "text-slate-400" },
}

const card = "bg-white rounded-[2rem] shadow-sm p-7 flex flex-col"
const cardLabel = "text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase"
const primaryButton =
  "self-start h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-black italic text-sm whitespace-nowrap shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60"

function NoShops({ onAdd }: { onAdd: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <span className="text-5xl">🏪</span>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t("shops.empty.title")}</h1>
        <p className="text-sm font-medium text-slate-400 max-w-sm">{t("shops.empty.body")}</p>
      </div>
      <button type="button" onClick={onAdd} className={cn(primaryButton, "self-center")}>
        <Plus className="w-4 h-4" /> {t("shops.switcher.addShop")}
      </button>
    </div>
  )
}

/** Shown in place of the dashboard while the active shop is still an application. */
export function ShopApplicationStatus() {
  const { t } = useTranslation()
  const vm = useShopApplicationViewModel()

  if (vm.isLoading) return null
  if (!vm.shop) return <NoShops onAdd={vm.addShop} />
  const shop = vm.shop
  const badge = shop.status === "ACTIVE" ? null : SHOP_STATUS_BADGE[shop.status]

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-[1100px]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{shop.name}</h1>
          {badge && (
            <span className={cn("px-3 py-1 rounded-full text-[10px] font-black tracking-wide", badge)}>
              {t(`shops.status.${shop.status}`)}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-slate-400">
          {t("shops.application.subtitle", { id: shop.id, date: vm.submittedAt })}
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 items-start">
        <section className={cn(card, "gap-6")} aria-label={t("shops.application.progress")}>
          <span className={cardLabel}>{t("shops.application.progress")}</span>
          <ol className="flex flex-col">
            {vm.timeline.map((item, i) => {
              const style = TIMELINE_STYLE[item.state]
              const last = i === vm.timeline.length - 1
              return (
                <li key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn("w-10 h-10 rounded-xl shrink-0 flex items-center justify-center", style.box)}>
                      <style.icon className="w-5 h-5" />
                    </div>
                    {!last && (
                      <div
                        className={cn(
                          "w-0.5 flex-1 min-h-6 my-1.5 rounded-full",
                          item.state === "done" ? "bg-emerald-200" : "bg-slate-100"
                        )}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-2 pb-6 flex flex-col gap-1">
                    <span className={cn("text-sm font-black", style.title)}>{item.title}</span>
                    <span className="text-xs font-medium text-slate-400">{item.description}</span>
                  </div>
                </li>
              )
            })}
          </ol>

          {vm.canResubmit && (
            <>
              {vm.note && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col gap-1.5">
                  <span className="text-[10px] font-black tracking-[0.2em] text-rose-500 uppercase">
                    {t("shops.application.noteTitle")}
                  </span>
                  <span className="text-sm font-semibold text-rose-900">{vm.note}</span>
                </div>
              )}
              <button type="button" onClick={vm.resubmit} className={primaryButton}>
                {t("shops.application.fixAndResubmit")}
              </button>
            </>
          )}

          {vm.canOpen && (
            <button type="button" onClick={vm.openShop} disabled={vm.isBusy} className={primaryButton}>
              {t("shops.application.openDashboard")} <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {vm.showMockReview && (
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  {t("shops.mock.label")}
                </span>
                <span className="text-xs font-semibold text-slate-600">{t("shops.mock.hint")}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={vm.isBusy}
                  onClick={vm.mockRequestChanges}
                  className="h-9 px-3.5 rounded-lg bg-rose-50 text-rose-500 font-bold text-xs disabled:opacity-60"
                >
                  {t("shops.mock.requestChanges")}
                </button>
                <button
                  type="button"
                  disabled={vm.isBusy}
                  onClick={vm.mockApprove}
                  className="h-9 px-3.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs disabled:opacity-60"
                >
                  {t("shops.mock.approve")}
                </button>
              </div>
            </div>
          )}
        </section>

        {vm.details.length > 0 && (
          <section className={cn(card, "gap-5")} aria-label={t("shops.application.submittedDetails")}>
            <span className={cardLabel}>{t("shops.application.submittedDetails")}</span>
            <dl className="flex flex-col gap-3.5">
              {vm.details.map((d) => (
                <div key={d.label} className="flex justify-between gap-4 text-sm">
                  <dt className="text-slate-400 font-medium shrink-0">{d.label}</dt>
                  <dd className="text-slate-900 font-bold text-right">{d.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  )
}
