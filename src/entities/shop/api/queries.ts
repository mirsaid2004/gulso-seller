import { useCallback, useEffect } from "react"
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query"
import { shopApi } from "./shopApi"
import { useActiveShopStore } from "../model/activeShopStore"
import { resolveActiveShop } from "../lib/shop"
import type { SellerShop } from "../model/types"

export const shopKeys = {
  all: ["shops"] as const,
}

export function useMyShopsQuery() {
  return useQuery({
    queryKey: shopKeys.all,
    queryFn: async () => (await shopApi.list()).data,
  })
}

export function useActiveShop(): { shop: SellerShop | null; shops: SellerShop[]; isLoading: boolean } {
  const { data: shops = [], isLoading } = useMyShopsQuery()
  const storedId = useActiveShopStore((s) => s.activeShopId)
  return { shop: resolveActiveShop(shops, storedId), shops, isLoading }
}

/** Replaces one shop in the cached list (or appends it). */
export function upsertShopInCache(queryClient: QueryClient, shop: SellerShop) {
  queryClient.setQueryData<SellerShop[]>(shopKeys.all, (prev = []) =>
    prev.some((s) => s.id === shop.id) ? prev.map((s) => (s.id === shop.id ? shop : s)) : [...prev, shop]
  )
}

/** Drops cached data scoped to the previous shop (products, orders, finance…). */
export function resetShopScopedQueries(queryClient: QueryClient) {
  return queryClient.resetQueries({ predicate: (q) => q.queryKey[0] !== shopKeys.all[0] })
}

/** Switches the panel to another shop and refetches everything scoped to it. */
export function useSwitchShop() {
  const queryClient = useQueryClient()
  const setActiveShopId = useActiveShopStore((s) => s.setActiveShopId)
  return useCallback(
    (shopId: number) => {
      if (useActiveShopStore.getState().activeShopId === shopId) return
      setActiveShopId(shopId)
      void resetShopScopedQueries(queryClient)
    },
    [queryClient, setActiveShopId]
  )
}

/**
 * Persists the resolved active shop so API calls carry its id.
 * `ready` stays false until the shop list has loaded and the stored id matches,
 * which keeps shop-scoped pages from fetching without a shop.
 */
export function useEnsureActiveShop() {
  const { shop, shops, isLoading } = useActiveShop()
  const storedId = useActiveShopStore((s) => s.activeShopId)
  const setActiveShopId = useActiveShopStore((s) => s.setActiveShopId)

  useEffect(() => {
    if (shop && shop.id !== storedId) setActiveShopId(shop.id)
  }, [shop, storedId, setActiveShopId])

  return { shop, shops, ready: !isLoading && (shop === null || shop.id === storedId) }
}
