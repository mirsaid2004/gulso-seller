import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { financeApi } from "@/api/finance.api"
import type { PaymentStatus } from "@/types"

const PER_PAGE = 10

export function useFinanceViewModel() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | undefined>(undefined)
  const [page, setPage] = useState(1)

  const statsQuery = useQuery({
    queryKey: ["finance", "stats"],
    queryFn: () => financeApi.getStats(),
    refetchInterval: 30_000,
  })

  const txQuery = useQuery({
    queryKey: ["finance", "transactions", page, search, statusFilter],
    queryFn: () =>
      financeApi.getTransactions({ page, perPage: PER_PAGE, search: search || undefined, status: statusFilter }),
  })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleStatusFilter(value: PaymentStatus | undefined) {
    setStatusFilter(value)
    setPage(1)
  }

  return {
    stats: statsQuery.data?.data,
    isStatsLoading: statsQuery.isLoading,
    transactions: txQuery.data?.data ?? [],
    meta: txQuery.data?.meta,
    isTxLoading: txQuery.isLoading,
    search,
    setSearch: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusFilter,
    page,
    setPage,
  }
}
