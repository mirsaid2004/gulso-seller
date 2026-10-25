import { Package, ReceiptText, ShoppingCart, Settings } from "lucide-react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/features/auth/useAuthStore"
import { ShopSwitcher } from "@/features/shop-switcher"
import { useCreateShopDialog } from "@/features/create-shop"
import { useActiveShopStore } from "@/entities/shop"
import { api } from "@/lib/api-client"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/shared/ui/sidebar"
import { cn } from "@/shared/lib/utils"

const NAV_ITEMS = [
    { key: "orders",    url: "/orders",    icon: ShoppingCart },
    { key: "products",  url: "/products",  icon: Package },
    { key: "finance",   url: "/finance",   icon: ReceiptText },
    { key: "settings",  url: "/settings",  icon: Settings },
] as const


interface AppSidebarProps {
    /** Dims the navigation while the active shop is still an application. */
    navDisabled?: boolean
}

export function AppSidebar({ navDisabled = false }: AppSidebarProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const openCreateShop = useCreateShopDialog((s) => s.openCreate)

    const handleLogout = async () => {
        try { await api.post("/auth/logout"); } catch { /* ignore */ }
        clearAuth()
        useActiveShopStore.getState().setActiveShopId(null)
        queryClient.clear()
        navigate("/login", { replace: true })
    }

    return (
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-50 bg-white">
            <SidebarHeader className="flex h-24 items-center px-6 mb-4">
                <div className="flex items-center gap-3">
                    <img src="/logo.svg" alt="Gulso" className="w-10 h-10 rounded-xl" />
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tighter text-[#1A1A1A] uppercase">{t("sidebar.appName")}</span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t("sidebar.subtitle")}</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu
                            aria-disabled={navDisabled || undefined}
                            className={cn("gap-2 px-2 transition-opacity", navDisabled && "opacity-40 pointer-events-none")}
                        >
                            {NAV_ITEMS.map((item) => {
                                const isActive = !navDisabled && location.pathname === item.url
                                const label = t(`sidebar.nav.${item.key}`)
                                return (
                                    <SidebarMenuItem key={item.key}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={label}
                                            className={`h-12 rounded-xl transition-all duration-300 font-bold ${isActive
                                                ? "bg-primary/5 text-primary shadow-sm ring-1 ring-primary/10"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <Link to={item.url} tabIndex={navDisabled ? -1 : undefined} className="flex items-center gap-4 px-4">
                                                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                                                <span className="text-sm">{label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-slate-50 mt-auto group-data-[collapsible=icon]:p-2">
                <ShopSwitcher onAddShop={openCreateShop} onLogout={handleLogout} />
            </SidebarFooter>
        </Sidebar>
    )
}
