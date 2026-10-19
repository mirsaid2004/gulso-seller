import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ordersApi } from "@/api/orders.api"
import { OrderStatus } from "@/types"
import type { OrderResponse } from "@/types"

export type OrderTab = OrderStatus | "ALL"

export function useOrdersViewModel() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<OrderTab>("ALL")

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersApi.getOrders(),
    refetchInterval: 15_000,
  })

  const allOrders: OrderResponse[] = data?.data ?? []

  const orders = allOrders.filter((o) => {
    const matchesTab = activeTab === "ALL" || o.status === activeTab
    const q = search.toLowerCase().trim()
    const matchesSearch =
      !q ||
      o.recipientName.toLowerCase().includes(q) ||
      o.recipientPhone.includes(q)
    return matchesTab && matchesSearch
  })

  const countByStatus = (status: OrderStatus) =>
    allOrders.filter((o) => o.status === status).length

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      const labels: Record<OrderStatus, string> = {
        [OrderStatus.ACCEPTED]: "Qabul qilindi",
        [OrderStatus.PREPARING]: "Tayyorlanmoqda",
        [OrderStatus.IN_DELIVERY]: "Yetkazilmoqda",
        [OrderStatus.COMPLETED]: "Bajarildi",
        [OrderStatus.CANCELLED]: "Bekor qilindi",
      }
      toast.success(`Status: ${labels[vars.status]}`)
    },
    onError: () => {
      toast.error("Statusni yangilashda xatolik yuz berdi")
    },
  })

  return {
    orders,
    isLoading,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    countByStatus,
    updateStatus: (id: number, status: OrderStatus) =>
      updateMutation.mutate({ id, status }),
    isUpdating: updateMutation.isPending,
    updatingId: updateMutation.variables?.id,
  }
}
