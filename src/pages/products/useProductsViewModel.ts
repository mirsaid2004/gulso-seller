import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productsApi } from "@/api/products.api"
import type { CreateProductRequest, ProductCategory, ProductDetailedResponse } from "@/types"

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function useProductsViewModel() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<ProductCategory | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductDetailedResponse | null>(null)

  const debouncedSearch = useDebounce(search, 350)

  const prevSearch = useRef(debouncedSearch)
  const prevCategory = useRef(category)
  useEffect(() => {
    if (prevSearch.current !== debouncedSearch || prevCategory.current !== category) {
      setPage(1)
      prevSearch.current = debouncedSearch
      prevCategory.current = category
    }
  }, [debouncedSearch, category])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", debouncedSearch, category, page],
    queryFn: () => productsApi.getProducts({ search: debouncedSearch, category, page, perPage: 12 }),
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateProductRequest) => productsApi.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setIsFormOpen(false)
      toast.success("Tovar muvaffaqiyatli qo'shildi")
    },
    onError: () => {
      toast.error("Tovar qo'shishda xatolik yuz berdi")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProductRequest }) =>
      productsApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setEditingProduct(null)
      setIsFormOpen(false)
      toast.success("Tovar muvaffaqiyatli yangilandi")
    },
    onError: () => {
      toast.error("Tovarni yangilashda xatolik yuz berdi")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Tovar o'chirildi")
    },
    onError: () => {
      toast.error("Tovarni o'chirishda xatolik yuz berdi")
    },
  })

  function openCreate() {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  function openEdit(product: ProductDetailedResponse) {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  function closeDialog() {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  return {
    products: data?.data ?? [],
    meta: data?.meta,
    isLoading: isLoading || isFetching,
    search,
    setSearch,
    category,
    setCategory,
    page,
    setPage,
    isFormOpen,
    editingProduct,
    openCreate,
    openEdit,
    closeDialog,
    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProduct: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}
