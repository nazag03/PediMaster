// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

// Páginas
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import HomeClient from "./Pages/client/HomeClient";
import CartPage from "./Pages/client/CartPage";
import AdminFoods from "./Pages/Admin/AdminFoods";
import FoodForm from "./Pages/Admin/FoodForm";
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminRestaurants from "./Pages/Admin/AdminRestaurants";
import AdminCreateRestaurants from "./Pages/SuperAdmin/AdminCreateRestaurants";
import Unauthorized from "./Pages/Unauthorized";

function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Cliente logueado (cualquier rol válido) */}
      <Route element={<ProtectedRoute allowedRoles={[]} />}>
        <Route
          path="/app"
          element={
            <ClientLayout>
              <HomeClient />
            </ClientLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <ClientLayout>
              <CartPage />
            </ClientLayout>
          }
        />
      </Route>

      {/* Admin + SuperAdmin */}
      <Route element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]} />}>
        <Route
          path="/admin/foods"
          element={
            <AdminLayout>
              <AdminFoods />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/foods/new"
          element={
            <AdminLayout>
              <FoodForm />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <AdminLayout>
              <AdminRestaurants />
            </AdminLayout>
          }
        />
      </Route>

      {/* Solo SuperAdmin */}
      <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
        <Route
          path="/superadmin/restaurants/new"
          element={
            <SuperAdminLayout>
              <AdminCreateRestaurants />
            </SuperAdminLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
