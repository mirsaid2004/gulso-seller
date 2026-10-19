import { Card, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Badge } from "@/shared/ui/badge"
import { ProductCategory, ProductStatus } from "@/types"
import { useProductsViewModel } from "./useProductsViewModel"
import { ProductFormDialog } from "./ProductFormDialog"
import { useTranslation } from "react-i18next"

export default function ProductsPage() {
  const { t } = useTranslation()
  const vm = useProductsViewModel()

  const CATEGORY_FILTERS = [
    { label: t("products.categories.all"), value: undefined },
    { label: t("products.categories.flowers"), value: ProductCategory.FLOWERS },
    { label: t("products.categories.gifts"), value: ProductCategory.GIFTS },
    { label: t("products.categories.bakery"), value: ProductCategory.BAKERY },
  ] as const

  return (
    <div className="space-y-8 pb-10">
      {/* Title + actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t("products.title")}</h1>
          <p className="text-slate-400 text-sm font-medium">{t("products.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={t("products.searchPlaceholder")}
              value={vm.search}
              onChange={(e) => vm.setSearch(e.target.value)}
              className="pl-9 w-64 bg-slate-100 border-none rounded-xl h-11"
            />
          </div>
          <Button
            onClick={() => vm.openCreate()}
            className="rounded-xl h-11 px-5 bg-primary hover:bg-primary/90 text-white font-black italic gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> {t("products.addNew")}
          </Button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center bg-slate-50 p-1 rounded-xl gap-1">
        {CATEGORY_FILTERS.map((f) => {
          const isActive = vm.category === f.value
          return (
            <Button
              key={String(f.value)}
              variant="ghost"
              size="sm"
              onClick={() => vm.setCategory(f.value as ProductCategory | undefined)}
              className={`rounded-lg h-9 px-4 font-bold text-[11px] uppercase tracking-wide transition-all ${
                isActive
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-400 hover:bg-white hover:text-slate-900"
              }`}
            >
              {f.label}
            </Button>
          )
        })}
        {vm.isLoading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin ml-2" />}
      </div>

      {/* Products Grid */}
      {vm.products.length === 0 && !vm.isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span className="text-5xl">📦</span>
          <p className="text-slate-400 font-bold text-sm">{t("products.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vm.isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                  <CardContent className="p-4 space-y-4">
                    <div className="aspect-square rounded-[1.5rem] bg-slate-100 animate-pulse" />
                    <div className="space-y-2 px-1">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-3/4" />
                      <div className="h-5 bg-slate-100 rounded-lg animate-pulse w-1/2" />
                    </div>
                    <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                  </CardContent>
                </Card>
              ))
            : vm.products.map((product) => {
                const isAvailable = product.status === ProductStatus.ACTIVE
                const displayPrice = product.discount
                  ? Math.round(product.price * (1 - product.discount / 100))
                  : product.price

                return (
                  <Card
                    key={product.id}
                    className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                  >
                    <CardContent className="p-4 space-y-4">
                      <div className="relative aspect-square rounded-[1.5rem] overflow-hidden">
                        <img
                          src={product.imageUrl}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                            !isAvailable ? "grayscale" : ""
                          }`}
                          alt={product.name}
                        />
                        <Badge
                          className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-[9px] font-black tracking-widest ${
                            isAvailable ? "bg-[#00B894] text-white" : "bg-[#636E72] text-white"
                          }`}
                        >
                          {isAvailable ? t("products.status.active") : t("products.status.outOfStock")}
                        </Badge>
                        {product.discount > 0 && (
                          <Badge className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[9px] font-black bg-rose-500 text-white">
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 px-1">
                        <h3 className="text-sm font-black text-slate-800 line-clamp-1">{product.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-black text-primary italic">
                            {displayPrice.toLocaleString("uz-UZ")} {t("common.som")}
                          </p>
                          {product.discount > 0 && (
                            <p className="text-xs text-slate-400 line-through">
                              {product.price.toLocaleString("uz-UZ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="secondary"
                          onClick={() => vm.openEdit(product)}
                          className="flex-1 rounded-xl h-10 gap-2 font-bold text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 italic transition-all active:scale-95"
                        >
                          <Pencil className="w-3.5 h-3.5" /> {t("products.edit")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => vm.deleteProduct(product.id)}
                          className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
        </div>
      )}

      {/* Pagination */}
      {vm.meta && vm.meta.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => vm.setPage((p) => Math.max(1, p - 1))}
            disabled={vm.page === 1}
            className="w-10 h-10 rounded-xl border-slate-100 text-slate-400 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: vm.meta.lastPage }).map((_, i) => {
            const p = i + 1
            return (
              <Button
                key={p}
                onClick={() => vm.setPage(p)}
                variant={vm.page === p ? "default" : "ghost"}
                className={`w-10 h-10 rounded-xl font-black text-sm ${
                  vm.page === p
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </Button>
            )
          })}
          <Button
            variant="outline"
            size="icon"
            onClick={() => vm.setPage((p) => Math.min(vm.meta!.lastPage, p + 1))}
            disabled={vm.page === vm.meta.lastPage}
            className="w-10 h-10 rounded-xl border-slate-100 text-slate-400 hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <ProductFormDialog
        open={vm.isFormOpen}
        onOpenChange={(open) => { if (!open) vm.closeDialog() }}
        editingProduct={vm.editingProduct}
        onSubmit={async (data) => {
          if (vm.editingProduct) {
            await vm.updateProduct({ id: vm.editingProduct.id, data })
          } else {
            await vm.createProduct(data)
          }
        }}
        isSubmitting={vm.isCreating || vm.isUpdating}
      />
    </div>
  )
}
