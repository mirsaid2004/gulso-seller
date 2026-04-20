import type { ReactNode } from "react"
import { TooltipProvider } from "@/shared/ui/tooltip"
import { SidebarProvider } from "@/shared/ui/sidebar"

interface ProvidersProps {
    children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={true}>
                {children}
            </SidebarProvider>
        </TooltipProvider>
    )
}
