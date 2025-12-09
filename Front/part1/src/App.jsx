// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";

import ClientLayout from "./layouts/ClientLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

// Páginas públicas
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Contact from "./Pages/Contact";
import AppPage from "./Pages/AppPage";
import Unauthorized from "./Pages/Unauthorized";

// Cliente
import HomeClient from "./Pages/client/HomeClient";
import CartPage from "./Pages/client/CartPage";

// Admin
import AdminFoods from "./Pages/Admin/AdminFoods";
import FoodForm from "./Pages/Admin/FoodForm";
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminRestaurants from "./Pages/Admin/AdminRestaurants";

// SuperAdmin
import AdminCreateRestaurants from "./Pages/SuperAdmin/AdminCreateRestaurants";
import SuperAdminFormUsers from "./Pages/SuperAdmin/SuperAdminFormUsers";
import SuperAdminFormRestaurants from "./Pages/SuperAdmin/SuperAdminFormRestaurants";
import SuperAdminDashboard from "./Pages/SuperAdmin/SuperAdminDashboard";
import UsersManage from "./Pages/SuperAdmin/UsersManage"
import RestaurantsManage from "./Pages/SuperAdmin/RestaurantsManage"
import TagsForm from "./Pages/SuperAdmin/TagsForm"

function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<HomePage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Cliente logueado (cualquier rol) */}
      <Route element={<ProtectedRoute allowedRoles={[]} />}>
        <Route
          path="/home"
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

      {/* Admin + SuperAdmin → usan el mismo layout con sidebar */}
      <Route element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]} />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/admin/foods" element={<AdminFoods />} />
          <Route path="/admin/foods/new" element={<FoodForm />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/restaurants" element={<AdminRestaurants />} />
        </Route>
      </Route>

      {/* Solo SuperAdmin → mismo layout, pero otras páginas */}
      <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
        <Route element={<SuperAdminLayout />}>
         <Route
            path="/superadmin/dashboard"
            element={<SuperAdminDashboard/>}
          />
          <Route
            path="/superadmin/restaurants/new"
            element={<AdminCreateRestaurants />}
          />
          <Route
            path="/superadmin/forms/users"
            element={<SuperAdminFormUsers />}
          />
          <Route
            path="/superadmin/forms/restaurants"
            element={<SuperAdminFormRestaurants />}
          />
          <Route
            path="/superadmin/forms/tags"
            element={<TagsForm />}
          />
          <Route 
            path="/superadmin/users" 
            element={<UsersManage />} />
          <Route
            path="/superadmin/restaurants"
            element={<RestaurantsManage/>}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
