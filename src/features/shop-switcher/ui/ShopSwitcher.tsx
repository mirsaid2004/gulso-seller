import { useTranslation } from "react-i18next"
import { Check, ChevronsUpDown, LogOut, Plus } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { useSidebar } from "@/shared/ui/sidebar"
import { SHOP_STATUS_BADGE, isOpenable, shopMonogram, type SellerShop } from "@/entities/shop"
import { useShopSwitcherViewModel } from "../model/useShopSwitcherViewModel"

function ShopTile({ shop, className }: { shop: Pick<SellerShop, "name" | "status">; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-[13px] font-black",
        isOpenable(shop.status) ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400",
        className
      )}
    >
      {shopMonogram(shop.name)}
    </div>
  )
}

function ShopRow({ shop, isActive, onSelect }: { shop: SellerShop; isActive: boolean; onSelect: () => void }) {
  const { t } = useTranslation()
  const live = shop.status === "ACTIVE"
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={isActive}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-slate-50",
        isActive && "bg-primary/5"
      )}
    >
      <ShopTile shop={shop} />
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-sm font-bold text-slate-900 truncate">{shop.name}</span>
        {live ? (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
            {t("common.id")}: {shop.id} · {shop.categories.map((c) => t(`shops.categories.${c}`)).join(", ")}
          </span>
        ) : (
          <span
            className={cn(
              "self-start px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide",
              SHOP_STATUS_BADGE[shop.status]
            )}
          >
            {t(`shops.status.${shop.status}`)}
          </span>
        )}
      </div>
      {isActive && <Check className="w-[18px] h-[18px] text-primary shrink-0" strokeWidth={2.5} />}
    </button>
  )
}

interface ShopSwitcherProps {
  onAddShop: () => void
  onLogout: () => void
}

export function ShopSwitcher({ onAddShop, onLogout }: ShopSwitcherProps) {
  const { t } = useTranslation()
  const vm = useShopSwitcherViewModel()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const active = vm.active

  return (
    <Popover open={vm.menuOpen} onOpenChange={vm.setMenuOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("shops.switcher.label")}
          className={cn(
            "flex items-center justify-between gap-3 w-full p-3 rounded-2xl text-left transition-colors hover:bg-slate-50",
            vm.menuOpen && "bg-slate-50",
            collapsed && "p-0 justify-center"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            {active ? (
              <ShopTile shop={active} className="border-2 border-white shadow-sm" />
            ) : (
              <div className="w-9 h-9 rounded-xl shrink-0 bg-slate-100 animate-pulse" />
            )}
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-slate-900 truncate">
                  {active?.name ?? (vm.isLoading ? t("common.loading") : t("shops.switcher.noShop"))}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                  {vm.userName ?? ""}
                  {active ? ` · ${t("common.id")}: ${active.id}` : ""}
                </span>
              </div>
            )}
          </div>
          {!collapsed && <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0" />}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={12}
        className="w-[312px] p-0 rounded-3xl border-slate-100 shadow-xl overflow-hidden"
      >
        <div className="px-5 pt-5 pb-4 flex items-center gap-3 bg-slate-50/50 border-b border-slate-100">
          <img
            src="https://github.com/shadcn.png"
            alt=""
            className="w-10 h-10 rounded-xl border-2 border-white shadow-sm"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-900 truncate">{vm.userName ?? "—"}</span>
            {vm.userPhone && <span className="text-xs font-medium text-slate-400">{vm.userPhone}</span>}
          </div>
        </div>

        <div className="px-2 pt-3 pb-2">
          <div className="px-3 pt-1 pb-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            {t("shops.switcher.yourShops")}
          </div>
          <div role="menu" aria-label={t("shops.switcher.yourShops")} className="flex flex-col gap-0.5">
            {vm.shops.map((shop) => (
              <ShopRow
                key={shop.id}
                shop={shop}
                isActive={shop.id === active?.id}
                onSelect={() => vm.selectShop(shop)}
              />
            ))}
            <button
              type="button"
              onClick={() => {
                vm.setMenuOpen(false)
                onAddShop()
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-primary/5"
            >
              <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border-2 border-dashed border-slate-200 text-primary">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-primary">{t("shops.switcher.addShop")}</span>
                <span className="text-[11px] font-medium text-slate-400">{t("shops.switcher.addShopHint")}</span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-500"
          >
            <LogOut className="w-4 h-4" />
            {t("sidebar.logout")}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
