import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/shared/ui/tooltip"
import { Toaster } from "@/shared/ui/sonner"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
