import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function DashboardPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.stats.totalSales")}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,450,000 UZS</div>
                        <p className="text-xs text-muted-foreground">{t("dashboard.stats.salesChange")}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.stats.orders")}</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">{t("dashboard.stats.ordersChange")}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.stats.products")}</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">{t("dashboard.stats.productsActive")}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.stats.customers")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,150</div>
                        <p className="text-xs text-muted-foreground">{t("dashboard.stats.customersNew")}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>{t("dashboard.recentOrders")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                        {t("dashboard.ordersTablePlaceholder")}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
