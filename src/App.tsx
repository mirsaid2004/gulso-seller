import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Providers } from "@/app/providers"
import { MainLayout } from "@/widgets/layout/MainLayout"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import ProductsPage from "@/pages/products/ProductsPage"
import FinancePage from "@/pages/finance/FinancePage"
import OrdersPage from "@/pages/orders/OrdersPage"
import LandingPage from "@/pages/landing/LandingPage"

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            }
          />
          <Route
            path="/products"
            element={
              <MainLayout>
                <ProductsPage />
              </MainLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <MainLayout>
                <OrdersPage />
              </MainLayout>
            }
          />
          <Route
            path="/finance"
            element={
              <MainLayout>
                <FinancePage />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}

export default App
