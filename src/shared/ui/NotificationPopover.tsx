import { Bell } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui/hover-card"
import { useTranslation } from "react-i18next"

export function NotificationPopover() {
  const { t } = useTranslation()
  const unreadCount = 0

  return (
    <HoverCard>
      <HoverCardTrigger
        className="relative flex items-center justify-center w-10 h-10 text-slate-600 hover:bg-primary/5 hover:text-primary rounded-lg transition-all active:scale-95"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 leading-none">
            {unreadCount}
          </span>
        )}
      </HoverCardTrigger>

      <HoverCardContent
        align="end"
        sideOffset={12}
        className="w-[380px] p-0 rounded-2xl border-primary/10 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-900 text-sm">{t("notifications.title")}</h3>
          </div>
        </div>

        {/* Empty state */}
        <div className="py-10 flex flex-col items-center gap-3 text-slate-400">
          <Bell className="w-8 h-8 opacity-30" />
          <p className="text-sm font-bold">{t("notifications.empty")}</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <a
            href="/orders"
            className="text-[12px] font-black text-primary hover:underline flex items-center justify-center gap-1"
          >
            {t("notifications.viewAllOrders")}
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
