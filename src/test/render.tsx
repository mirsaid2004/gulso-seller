import type { ReactElement, ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import { render, renderHook, type RenderOptions } from "@testing-library/react"
import { TooltipProvider } from "@/shared/ui/tooltip"
import { Toaster } from "@/shared/ui/sonner"

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
      mutations: { retry: false },
    },
  })
}

interface Options {
  route?: string
  queryClient?: QueryClient
}

function makeWrapper({ route = "/products", queryClient = createTestQueryClient() }: Options) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MemoryRouter initialEntries={[route]}>
            {children}
            <Toaster />
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    )
  }
}

export function renderWithProviders(ui: ReactElement, options: Options & Omit<RenderOptions, "wrapper"> = {}) {
  const { route, queryClient, ...rest } = options
  return render(ui, { wrapper: makeWrapper({ route, queryClient }), ...rest })
}

export function renderHookWithProviders<T>(hook: () => T, options: Options = {}) {
  return renderHook(hook, { wrapper: makeWrapper(options) })
}
