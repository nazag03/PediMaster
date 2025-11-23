import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./router/ProtectedRoute";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

// Páginas
import Login from "./pages/Login";
import HomeClient from "./pages/client/HomeClient";
//import RestaurantDetail from "./pages/client/RestaurantDetail";
//import AdminFoods from "./pages/admin/AdminFoods";
//import RotiAdd from "./superadmin/RotiAdd";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Público */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Cliente: solo requiere estar logueado (cualquier rol o directamente solo Client) */}
          <Route element={<ProtectedRoute allowedRoles={["Client", "Admin", "SuperAdmin"]} />}>
            <Route
              path="/"
              element={
                <ClientLayout>
                  <HomeClient />
                </ClientLayout>
              }
            />
            <Route
              path="/restaurants/:id"
              element={
                <ClientLayout>
            
                </ClientLayout>
              }
            />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]} />}>
            <Route
              path="/admin/foods"
              element={
                <AdminLayout>
             
                </AdminLayout>
              }
            />
          </Route>

          {/* SuperAdmin */}
          <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
            <Route
              path="/superadmin/restaurants/new"
              element={
                <SuperAdminLayout>
               
                </SuperAdminLayout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
