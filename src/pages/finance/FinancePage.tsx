import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Skeleton } from "@/shared/ui/skeleton"
import { Bell, Search, Info, Landmark, TrendingUp, SlidersHorizontal, Download } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useFinanceViewModel } from "./useFinanceViewModel"
import { PaymentStatus } from "@/types"

function formatMoney(amount: number, som: string) {
  return `${amount.toLocaleString("uz-UZ")} ${som}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function formatOrderId(orderId: number) {
  return `#${String(orderId).padStart(5, "0")}`
}

export default function FinancePage() {
  const { t } = useTranslation()
  const som = t("common.som")

  const {
    stats,
    isStatsLoading,
    transactions,
    meta,
    isTxLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
  } = useFinanceViewModel()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 italic">{t("finance.title")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={t("common.search")}
              className="pl-9 w-64 bg-slate-50 border-none rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </Button>
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm cursor-pointer border-emerald-500">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>DK</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white rounded-[2rem] p-4">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{t("finance.totalRevenue")}</span>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold">
              <TrendingUp className="w-3 h-3 mr-1" />
              {isStatsLoading ? "..." : `+${stats?.growthPercent ?? 0}%`}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {isStatsLoading ? (
              <Skeleton className="h-9 w-40 mb-1" />
            ) : (
              <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
                {formatMoney(stats?.totalRevenue ?? 0, som)}
              </div>
            )}
            <p className="text-xs text-slate-400">{t("finance.last30Days")}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-[2rem] p-4">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{t("finance.commission")}</span>
            <Info className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-0">
            {isStatsLoading ? (
              <Skeleton className="h-9 w-36 mb-1" />
            ) : (
              <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
                {formatMoney(stats?.commissionAmount ?? 0, som)}
              </div>
            )}
            <p className="text-xs text-slate-400">{t("finance.commissionFee")}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-primary rounded-[2rem] p-4 text-white">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <span className="text-sm font-medium opacity-80">{t("finance.payableAmount")}</span>
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isStatsLoading ? (
              <Skeleton className="h-9 w-36 mb-1 bg-white/20" />
            ) : (
              <div className="text-3xl font-black mb-1 tracking-tight">
                {formatMoney(stats?.balance ?? 0, som)}
              </div>
            )}
            <p className="text-xs opacity-70">{t("finance.readyToWithdraw")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900">{t("finance.salesTable")}</CardTitle>
          <div className="flex items-center gap-3">
            <Button
              variant={statusFilter ? "default" : "outline"}
              size="sm"
              className="rounded-xl gap-2 font-bold text-slate-600 border-slate-100 italic"
              onClick={() =>
                setStatusFilter(
                  statusFilter === PaymentStatus.PAID
                    ? PaymentStatus.PENDING
                    : statusFilter === PaymentStatus.PENDING
                      ? undefined
                      : PaymentStatus.PAID
                )
              }
            >
              <SlidersHorizontal className="w-4 h-4" />
              {statusFilter === PaymentStatus.PAID
                ? t("finance.status.paid")
                : statusFilter === PaymentStatus.PENDING
                  ? t("finance.status.pending")
                  : t("finance.filter")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl gap-2 font-bold text-primary italic"
              onClick={() => toast.info(t("finance.exportComingSoon"))}
            >
              <Download className="w-4 h-4" /> {t("finance.export")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Table>
            <TableHeader className="[&_tr]:border-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">{t("finance.columns.date")}</TableHead>
                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">{t("finance.columns.orderId")}</TableHead>
                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">{t("finance.columns.amount")}</TableHead>
                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">{t("finance.columns.commission")}</TableHead>
                <TableHead className="uppercase text-[10px] font-black tracking-widest text-slate-400">{t("finance.columns.paymentStatus")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTxLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-50">
                    <TableCell className="py-6 px-0"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="py-6"><Skeleton className="h-6 w-24 rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-10 text-sm italic">
                    {t("finance.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t_) => (
                  <TableRow key={t_.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-slate-500 font-medium py-6 px-0">{formatDate(t_.date)}</TableCell>
                    <TableCell className="font-black text-slate-900 py-6">{formatOrderId(t_.orderId)}</TableCell>
                    <TableCell className="text-slate-500 font-medium py-6">{formatMoney(t_.amount, som)}</TableCell>
                    <TableCell className="text-slate-400 italic py-6">{formatMoney(t_.commission, som)}</TableCell>
                    <TableCell className="py-6">
                      <Badge
                        className={`rounded-lg px-3 py-1 font-bold text-[10px] shadow-sm ${
                          t_.status === PaymentStatus.PAID
                            ? "bg-emerald-50 text-emerald-600 border-none"
                            : "bg-amber-50 text-amber-600 border-none"
                        }`}
                      >
                        {t_.status === PaymentStatus.PAID ? t("finance.status.paid") : t("finance.status.pending")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-slate-400 italic">
              {t("finance.totalOrders", { count: meta?.total ?? 0 })}
            </span>
            {meta && meta.lastPage > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 text-xs"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  {t("finance.pagination.prev")}
                </Button>
                {Array.from({ length: meta.lastPage }).map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={page === i + 1 ? "default" : "ghost"}
                    className={`w-8 h-8 p-0 rounded-lg text-xs font-bold ${
                      page === i + 1 ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-slate-400"
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 text-xs"
                  disabled={page >= meta.lastPage}
                  onClick={() => setPage(page + 1)}
                >
                  {t("finance.pagination.next")}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal CTA */}
      <Card className="border-none shadow-xl bg-[#0F1117] rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(242,102,34,0.1),transparent_60%)]" />
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white italic">{t("finance.withdrawTitle")}</h2>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">{t("finance.withdrawDesc")}</p>
          </div>
          <Button
            size="lg"
            className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 italic"
            onClick={() => toast.success(t("finance.withdrawSuccess"))}
          >
            {t("finance.withdrawBtn")}
          </Button>
        </div>
      </Card>
    </div>
  )
}
