import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Product/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProductPage from "./pages/Product/AddProductPage";
import EditProductPage from "./pages/Product/EditProductPage";
import { Toaster } from "react-hot-toast";
import CategoryPage from "./pages/Category/CategoryPage";
import AddCategory from "./pages/Category/AddCategoryPage";
import EditCategoryPage from "./pages/Category/EditCategoryPage";

function App() {
  return (
    <>
      <Toaster position="top-left" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Product Section */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add"
          element={
            <ProtectedRoute>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit/:id"
          element={
            <ProtectedRoute>
              <EditProductPage />
            </ProtectedRoute>
          }
        />
        {/* End of Product Section */}
        {/* Category Section */}
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/category/add"
          element={
            <ProtectedRoute>
              <AddCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/edit/:id"
          element={
            <ProtectedRoute>
              <EditCategoryPage />
            </ProtectedRoute>
          }
        />
        {/* End of Category Section */}
      </Routes>
    </>
  );
}

export default App;
