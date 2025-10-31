import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/NavBar";
import Home from "./Pages/Head";
//import AdminFoods from "./Pages/AdminFoods";
//import AdminOrders from "./Pages/AdminOrders";
import FoodForm from "./Pages/FoodForm";
import Login from "./Pages/login";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <>
      {/* ✅ Navbar visible en todas las páginas */}
      <Navbar />

      {/* ✅ Sistema de rutas */}
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protegido */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/admin/foods/new" element={<FoodForm />} />
          
          <Route path="/admin" element={<Navigate to="/admin/foods" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 16 }}>404 — Página no encontrada</div>} />
      </Routes>
    </>
  );
}
