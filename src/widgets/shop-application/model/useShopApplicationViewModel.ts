import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useCreateShopDialog } from "@/features/create-shop"
import {
  formatSubmittedAt,
  formatUzPhone,
  shopApi,
  upsertShopInCache,
  useActiveShop,
  type MockReviewDecision,
  type SellerShop,
} from "@/entities/shop"

export type TimelineState = "done" | "waiting" | "alert" | "todo"

export interface TimelineItem {
  state: TimelineState
  title: string
  description: string
}

const isMocking = import.meta.env.VITE_API_MOCKING === "enabled"

export function useShopApplicationViewModel() {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const { shop, isLoading } = useActiveShop()
  const openCreate = useCreateShopDialog((s) => s.openCreate)
  const openResubmit = useCreateShopDialog((s) => s.openResubmit)

  const onShopChanged = (updated: SellerShop) => upsertShopInCache(queryClient, updated)
  const onError = (err: unknown) => toast.error(err instanceof Error ? err.message : t("common.error"))

  const openShop = useMutation({
    mutationFn: async (id: number) => (await shopApi.open(id)).data,
    onSuccess: (updated) => {
      onShopChanged(updated)
      toast.success(t("shops.toast.welcome", { name: updated.name }), { description: t("shops.toast.welcomeBody") })
    },
    onError,
  })

  const mockReview = useMutation({
    mutationFn: async ({ id, body }: { id: number; body: MockReviewDecision }) => (await shopApi.mockReview(id, body)).data,
    onSuccess: (updated) => {
      onShopChanged(updated)
      if (updated.status === "APPROVED") {
        toast.success(t("shops.toast.approved", { name: updated.name }), { description: t("shops.toast.approvedBody") })
      } else {
        toast.error(t("shops.toast.changesRequested"), { description: t("shops.toast.changesRequestedBody", { name: updated.name }) })
      }
    },
    onError,
  })

  const app = shop?.application ?? null
  const status = shop?.status

  const submittedAt = app ? formatSubmittedAt(app.submittedAt, i18n.language) : ""

  const timeline: TimelineItem[] = [
    { state: "done", title: t("shops.timeline.submitted"), description: submittedAt },
    status === "PENDING"
      ? { state: "waiting", title: t("shops.timeline.inReview"), description: t("shops.timeline.inReviewBody") }
      : status === "CHANGES_REQUESTED" || status === "REJECTED"
        ? { state: "alert", title: t(`shops.timeline.${status}`), description: t(`shops.timeline.${status}_BODY`) }
        : { state: "done", title: t("shops.timeline.reviewed"), description: t("shops.timeline.reviewedBody") },
    status === "APPROVED"
      ? { state: "done", title: t("shops.timeline.live"), description: t("shops.timeline.liveBody") }
      : { state: "todo", title: t("shops.timeline.opens"), description: t("shops.timeline.opensBody") },
  ]

  const details = app
    ? [
        { label: t("shops.details.categories"), value: shop!.categories.map((c) => t(`shops.categories.${c}`)).join(", ") },
        { label: t("shops.details.phone"), value: formatUzPhone(app.phone) },
        ...(app.email ? [{ label: t("shops.details.email"), value: app.email }] : []),
        { label: t("shops.details.address"), value: app.address },
        { label: t("shops.details.legalEntity"), value: t(`shops.legalEntity.${app.legalEntity}`) },
        { label: t("shops.details.stir"), value: app.stir },
        { label: t("shops.details.documents"), value: t("shops.details.files", { count: app.documents.length }) },
      ]
    : []

  return {
    shop,
    isLoading,
    submittedAt,
    note: app?.note ?? null,
    timeline,
    details,
    canOpen: status === "APPROVED",
    canResubmit: status === "CHANGES_REQUESTED" && !!app,
    showMockReview: isMocking && status === "PENDING",
    isBusy: openShop.isPending || mockReview.isPending,
    addShop: openCreate,
    openShop: () => shop && openShop.mutate(shop.id),
    resubmit: () => shop && openResubmit(shop.id),
    mockApprove: () => shop && mockReview.mutate({ id: shop.id, body: { decision: "APPROVE" } }),
    mockRequestChanges: () =>
      shop &&
      mockReview.mutate({
        id: shop.id,
        body: { decision: "REQUEST_CHANGES", note: t("shops.mock.sampleNote") },
      }),
  }
}
