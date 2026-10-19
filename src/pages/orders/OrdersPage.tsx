import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { LocationMapDialog } from "@/shared/ui/LocationMapDialog"
import {
  Search, ShoppingBag, Wand2, Truck, CheckCircle2, XCircle,
  Play, MapPin, Package, Clock, Loader2,
} from "lucide-react"
import { OrderStatus, DeliveryType } from "@/types"
import type { OrderResponse } from "@/types"
import { useOrdersViewModel, type OrderTab } from "./useOrdersViewModel"
import { useTranslation } from "react-i18next"

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_ICON_CONFIG: Record<
  OrderStatus,
  { badge: string; iconBg: string; borderColor: string; Icon: React.ElementType }
> = {
  [OrderStatus.ACCEPTED]:   { badge: "bg-amber-100 text-amber-700 border-none",   iconBg: "bg-amber-100 text-amber-600",   borderColor: "border-l-amber-400",   Icon: ShoppingBag  },
  [OrderStatus.PREPARING]:  { badge: "bg-blue-100 text-blue-700 border-none",     iconBg: "bg-blue-100 text-blue-600",     borderColor: "border-l-blue-400",    Icon: Wand2        },
  [OrderStatus.IN_DELIVERY]:{ badge: "bg-purple-100 text-purple-700 border-none", iconBg: "bg-purple-100 text-purple-600", borderColor: "border-l-purple-400",  Icon: Truck        },
  [OrderStatus.COMPLETED]:  { badge: "bg-emerald-100 text-emerald-700 border-none",iconBg: "bg-emerald-100 text-emerald-600",borderColor: "border-l-emerald-400",Icon: CheckCircle2 },
  [OrderStatus.CANCELLED]:  { badge: "bg-slate-100 text-slate-500 border-none",   iconBg: "bg-slate-100 text-slate-400",   borderColor: "border-l-slate-300",   Icon: XCircle      },
}

const TAB_IDS: { id: OrderTab; status?: OrderStatus }[] = [
  { id: "ALL" },
  { id: OrderStatus.ACCEPTED,    status: OrderStatus.ACCEPTED    },
  { id: OrderStatus.PREPARING,   status: OrderStatus.PREPARING   },
  { id: OrderStatus.IN_DELIVERY, status: OrderStatus.IN_DELIVERY },
  { id: OrderStatus.COMPLETED,   status: OrderStatus.COMPLETED   },
  { id: OrderStatus.CANCELLED,   status: OrderStatus.CANCELLED   },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("uz-UZ", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

function formatCreatedAt(iso: string) {
  return new Date(iso).toLocaleString("uz-UZ", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  })
}

// ── Order card ────────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onUpdateStatus,
  isUpdating,
}: {
  order: OrderResponse
  onUpdateStatus: (id: number, status: OrderStatus) => void
  isUpdating: boolean
}) {
  const { t } = useTranslation()
  const [mapOpen, setMapOpen] = useState(false)
  const cfg = STATUS_ICON_CONFIG[order.status]
  const commission = Math.round(order.totalAmount * 0.1)
  const net = order.totalAmount - commission
  const isDelivery = order.deliveryType === DeliveryType.DELIVERY
  const hasCoords = order.latitude !== 0 || order.longitude !== 0

  return (
    <>
      <Card className={`border-none shadow-sm bg-white rounded-[2rem] overflow-hidden group border-l-4 ${cfg.borderColor}`}>
        {/* ── Header ── */}
        <CardHeader className="px-6 pt-5 pb-5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center shrink-0`}>
              <cfg.Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {t("orders.orderNumber", { id: order.id })}
                </h3>
                <Badge className={`${cfg.badge} px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide`}>
                  {t(`orders.status.${order.status}`)}
                </Badge>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{formatCreatedAt(order.createdAt)}</p>
            </div>
          </div>
          <Badge className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest shrink-0 ${isDelivery ? "bg-indigo-50 text-indigo-500 border-none" : "bg-teal-50 text-teal-500 border-none"}`}>
            {t(`orders.deliveryType.${order.deliveryType}`)}
          </Badge>
        </CardHeader>

        {/* ── Body ── */}
        <CardContent className="px-6 pb-6 pt-0">
          <div className="border-t border-slate-50 pt-5 grid lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
                {t("orders.sections.items")}
              </span>
              <div className="space-y-3">
                {order.items.map((item) => {
                  const discounted = item.productDiscount > 0
                    ? Math.round(item.productPrice * (1 - item.productDiscount))
                    : item.productPrice
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.productImageUrl}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-50 shrink-0"
                        alt={item.productName}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 line-clamp-1">{item.productName}</span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.quantity} {t("common.dona")} × {discounted.toLocaleString("uz-UZ")} {t("common.som")}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
                {t("orders.sections.payment")}
              </span>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{t("orders.payment.total")}</span>
                  <span className="text-slate-900 font-black">{order.totalAmount.toLocaleString("uz-UZ")} {t("common.som")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{t("orders.payment.commission")}</span>
                  <span className="text-rose-500 font-bold">-{commission.toLocaleString("uz-UZ")} {t("common.som")}</span>
                </div>
                <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-slate-900 font-black italic">{t("orders.payment.net")}</span>
                  <span className="text-primary font-black text-lg italic">{net.toLocaleString("uz-UZ")} {t("common.som")}</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
                {t("orders.sections.delivery")}
              </span>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("orders.delivery.date")}</span>
                    <span className="text-sm font-bold text-slate-900">{formatDate(order.deliveryDate)}</span>
                  </div>
                </div>

                {isDelivery && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("orders.delivery.address")}</span>
                      {order.deliveryAddress && (
                        <span className="text-sm font-bold text-slate-900 block">{order.deliveryAddress}</span>
                      )}
                      {hasCoords && (
                        <button
                          onClick={() => setMapOpen(true)}
                          className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/8 hover:bg-primary/15 text-primary text-[11px] font-black transition-colors border border-primary/15"
                        >
                          <MapPin className="w-3 h-3" />
                          {order.latitude.toFixed(5)}, {order.longitude.toFixed(5)}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {!isDelivery && (
                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("orders.delivery.method")}</span>
                      <span className="text-sm font-bold text-slate-900">{t("orders.delivery.pickup")}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <ShoppingBag className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("orders.delivery.customer")}</span>
                    <span className="text-sm font-bold text-slate-900">
                      {order.recipientName} · {order.recipientPhone}
                    </span>
                  </div>
                </div>

                {order.comment && (
                  <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">
                      {t("orders.delivery.comment")}
                    </span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed italic opacity-80">
                      "{order.comment}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <OrderActions order={order} onUpdateStatus={onUpdateStatus} isUpdating={isUpdating} />
        </CardContent>
      </Card>

      {hasCoords && (
        <LocationMapDialog
          open={mapOpen}
          onOpenChange={setMapOpen}
          lat={order.latitude}
          lng={order.longitude}
          label={order.deliveryAddress || `${order.latitude.toFixed(5)}, ${order.longitude.toFixed(5)}`}
        />
      )}
    </>
  )
}

function OrderActions({
  order,
  onUpdateStatus,
  isUpdating,
}: {
  order: OrderResponse
  onUpdateStatus: (id: number, status: OrderStatus) => void
  isUpdating: boolean
}) {
  const { t } = useTranslation()
  const busy = isUpdating

  if (order.status === OrderStatus.ACCEPTED) {
    return (
      <div className="mt-6 pt-5 border-t border-slate-50 flex justify-end gap-3">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => onUpdateStatus(order.id, OrderStatus.CANCELLED)}
          className="rounded-xl h-11 px-6 border-slate-200 text-slate-500 font-black italic"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : t("orders.actions.cancel")}
        </Button>
        <Button
          disabled={busy}
          onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)}
          className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-white font-black italic gap-2"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Play className="w-4 h-4 fill-white" /> {t("orders.actions.startPreparing")}</>}
        </Button>
      </div>
    )
  }

  if (order.status === OrderStatus.PREPARING) {
    const isPickup = order.deliveryType === DeliveryType.PICKUP
    return (
      <div className="mt-6 pt-5 border-t border-slate-50 flex justify-end gap-3">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => onUpdateStatus(order.id, OrderStatus.CANCELLED)}
          className="rounded-xl h-11 px-6 border-slate-200 text-slate-500 font-black italic"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : t("orders.actions.cancel")}
        </Button>
        {isPickup ? (
          <Button
            disabled={busy}
            onClick={() => onUpdateStatus(order.id, OrderStatus.COMPLETED)}
            className="rounded-xl h-11 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black italic gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> {t("orders.actions.markDone")}</>}
          </Button>
        ) : (
          <Button
            disabled={busy}
            onClick={() => onUpdateStatus(order.id, OrderStatus.IN_DELIVERY)}
            className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black italic gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Truck className="w-4 h-4" /> {t("orders.actions.sendCourier")}</>}
          </Button>
        )}
      </div>
    )
  }

  if (order.status === OrderStatus.IN_DELIVERY) {
    return (
      <div className="mt-6 pt-5 border-t border-slate-50 flex justify-end gap-3">
        <Button
          disabled={busy}
          onClick={() => onUpdateStatus(order.id, OrderStatus.COMPLETED)}
          className="rounded-xl h-11 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black italic gap-2"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> {t("orders.actions.markDone")}</>}
        </Button>
      </div>
    )
  }

  return null
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { t } = useTranslation()
  const vm = useOrdersViewModel()

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t("orders.title")}</h1>
          <p className="text-slate-400 text-sm font-medium">{t("orders.subtitle")}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={t("orders.searchPlaceholder")}
            value={vm.search}
            onChange={(e) => vm.setSearch(e.target.value)}
            className="pl-9 w-64 bg-slate-100 border-none rounded-xl h-11"
          />
        </div>
      </div>

      <div className="flex items-center border-b border-slate-100 gap-6 overflow-x-auto pb-px">
        {TAB_IDS.map((tab) => {
          const count = tab.status ? vm.countByStatus(tab.status) : undefined
          const isActive = vm.activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => vm.setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                isActive ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {t(`orders.tabs.${tab.id}`)}
              {count !== undefined && count > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-black">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {vm.isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] h-64 animate-pulse" />
          ))}
        </div>
      ) : vm.orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span className="text-5xl">📦</span>
          <p className="text-slate-400 font-bold text-sm">{t("orders.empty")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {vm.orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={vm.updateStatus}
              isUpdating={vm.isUpdating && vm.updatingId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
