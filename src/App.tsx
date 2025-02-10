import { Suspense } from "react";
import CategoriesPage from "./components/admin/CategoriesPage";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import CheckoutPage from "./components/CheckoutPage";
import AdminLayout from "./components/admin/AdminLayout";
import ProductsPage from "./components/admin/ProductsPage";
import QuotationsPage from "./components/admin/QuotationsPage";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="products" element={<ProductsPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
