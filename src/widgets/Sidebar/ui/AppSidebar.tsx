import { Package, ReceiptText, ShoppingCart, Settings, LogOut } from "lucide-react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/features/auth/useAuthStore"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

const NAV_ITEMS = [
    { key: "orders",    url: "/orders",    icon: ShoppingCart },
    { key: "products",  url: "/products",  icon: Package },
    { key: "finance",   url: "/finance",   icon: ReceiptText },
    { key: "settings",  url: "/settings",  icon: Settings },
] as const


export function AppSidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { name, userId, clearAuth } = useAuthStore()

    const handleLogout = async () => {
        try { await api.post("/auth/logout"); } catch { /* ignore */ }
        clearAuth()
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
                        <SidebarMenu className="gap-2 px-2">
                            {NAV_ITEMS.map((item) => {
                                const isActive = location.pathname === item.url
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
                                            <Link to={item.url} className="flex items-center gap-4 px-4">
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

            <SidebarFooter className="p-4 border-t border-slate-50 mt-auto">
                {/* User row */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 rounded-xl border-2 border-white shadow-sm">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900">{name ?? "User"}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{t("common.id")}: {userId ?? "—"}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
                        title={t("sidebar.logout")}
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
