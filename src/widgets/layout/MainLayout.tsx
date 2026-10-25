import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"
import { AppSidebar } from "@/widgets/Sidebar/ui/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar"
import { Separator } from "@/shared/ui/separator"
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher"
import { NotificationPopover } from "@/shared/ui/NotificationPopover"
import { CreateShopDialog } from "@/features/create-shop"
import { isLiveShop, useEnsureActiveShop } from "@/entities/shop"
import { ShopApplicationStatus } from "@/widgets/shop-application"

interface MainLayoutProps {
    children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const { t } = useTranslation()
    const { shop, ready } = useEnsureActiveShop()
    const isLive = !!shop && isLiveShop(shop)

    return (
        <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
            <AppSidebar navDisabled={!isLive} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 min-w-0">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <span className="font-medium text-muted-foreground uppercase tracking-wider text-xs">
                            {t("sidebar.subtitle")}
                        </span>
                        {shop && (
                            <>
                                <span className="text-slate-300 text-xs">/</span>
                                <span className="font-bold text-slate-900 text-xs truncate">{shop.name}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-1 pr-2">
                        <LanguageSwitcher />
                        <NotificationPopover />
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
                    {!ready ? (
                        <div className="flex flex-1 items-center justify-center">
                            <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                        </div>
                    ) : isLive ? (
                        children
                    ) : (
                        <ShopApplicationStatus />
                    )}
                </main>
            </SidebarInset>
        </div>
        <CreateShopDialog />
        </SidebarProvider>
    )
}
