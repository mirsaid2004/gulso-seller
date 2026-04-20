import { useState, useCallback } from "react"

interface Product {
  id: number
  name: string
  category: string
  price: string
  stock: string
  status: "Sotuvda" | "Yashirilgan"
}

export function useProductViewModel() {
  const [products] = useState<Product[]>([
    { id: 1, name: "Atirgullar 'Qizil may'", category: "Gullar", price: "145,000 UZS", stock: "24 dona", status: "Sotuvda" },
    { id: 2, name: "Lola 'Bahor nafasi'", category: "Gullar", price: "85,000 UZS", stock: "15 dona", status: "Sotuvda" },
    { id: 3, name: "Oq atirgullar", category: "Gullar", price: "160,000 UZS", stock: "10 dona", status: "Sotuvda" },
    { id: 4, name: "Guldasta 'Bayram'", category: "Guldastalar", price: "250,000 UZS", stock: "5 dona", status: "Sotuvda" },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return {
    products: filteredProducts,
    searchQuery,
    handleSearch,
  }
}
