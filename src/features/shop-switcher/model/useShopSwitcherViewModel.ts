import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useAuthStore } from "@/features/auth/useAuthStore"
import { formatUzPhone, shopApi, upsertShopInCache, useActiveShop, useSwitchShop, type SellerShop } from "@/entities/shop"

export function useShopSwitcherViewModel() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const switchShop = useSwitchShop()
  const { shop: active, shops, isLoading } = useActiveShop()
  const name = useAuthStore((s) => s.name)
  const phone = useAuthStore((s) => s.phone)
  const [menuOpen, setMenuOpen] = useState(false)

  const openShop = useMutation({
    mutationFn: async (id: number) => (await shopApi.open(id)).data,
    onSuccess: (shop) => {
      upsertShopInCache(queryClient, shop)
      switchShop(shop.id)
      toast.success(t("shops.toast.welcome", { name: shop.name }), { description: t("shops.toast.welcomeBody") })
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : t("common.error")),
  })

  function selectShop(shop: SellerShop) {
    setMenuOpen(false)
    // Picking an approved shop opens it right away, like the "Open shop dashboard" button.
    if (shop.status === "APPROVED") openShop.mutate(shop.id)
    else switchShop(shop.id)
  }

  return {
    active,
    shops,
    isLoading,
    userName: name,
    userPhone: phone ? formatUzPhone(phone.replace(/^\+998/, "")) : null,
    menuOpen,
    setMenuOpen,
    selectShop,
  }
}
