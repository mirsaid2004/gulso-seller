import type { ReactNode } from "react"
import { AppSidebar } from "@/widgets/Sidebar/ui/AppSidebar"
import { SidebarInset, SidebarTrigger } from "@/shared/ui/sidebar"
import { Separator } from "@/shared/ui/separator"

interface MainLayoutProps {
    children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <span className="font-medium text-muted-foreground uppercase tracking-wider text-xs">
                            Sotuvchi Paneli
                        </span>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
                    {children}
                </main>
            </SidebarInset>
        </div>
    )
}
