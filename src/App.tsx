import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Providers } from "@/app/providers"
import { MainLayout } from "@/widgets/layout/MainLayout"
import ProductsPage from "@/pages/products/ProductsPage"
import FinancePage from "@/pages/finance/FinancePage"
import OrdersPage from "@/pages/orders/OrdersPage"
import LandingPage from "@/pages/landing/LandingPage"
import LoginPage from "@/pages/login/LoginPage"
import SettingsPage from "@/pages/settings/SettingsPage"
import { useAuthStore } from "@/features/auth/useAuthStore"

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/products"
            element={
              <RequireAuth>
                <MainLayout>
                  <ProductsPage />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <MainLayout>
                  <OrdersPage />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/finance"
            element={
              <RequireAuth>
                <MainLayout>
                  <FinancePage />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}

export default App
