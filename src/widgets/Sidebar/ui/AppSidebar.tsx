import { Package, ReceiptText, ShoppingCart, Home, Settings, LogOut } from "lucide-react"
import { useLocation } from "react-router-dom"
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

const items = [
    {
        title: "Asosiy",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Buyurtmalar",
        url: "/orders",
        icon: ShoppingCart,
    },
    {
        title: "Mahsulotlar",
        url: "/products",
        icon: Package,
    },
    {
        title: "Moliya",
        url: "/finance",
        icon: ReceiptText,
    },
    {
        title: "Sozlamalar",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const location = useLocation()

    return (
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-50 bg-white">
            <SidebarHeader className="flex h-24 items-center px-6 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tighter text-[#1A1A1A] uppercase">Gulso 1.0</span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Sotuvchi paneli</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2 px-2">
                            {items.map((item) => {
                                const isActive = location.pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            className={`h-12 rounded-xl transition-all duration-300 font-bold ${isActive
                                                ? "bg-primary/5 text-primary shadow-sm ring-1 ring-primary/10"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                        >
                                            <a href={item.url} className="flex items-center gap-4 px-4">
                                                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                                                <span className="text-sm">{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-slate-50 mt-auto">
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 rounded-xl border-2 border-white shadow-sm">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>DK</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900">Dilshodbek K.</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: 882910</span>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
                        title="Chiqish"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
