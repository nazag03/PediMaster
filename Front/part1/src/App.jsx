import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/NavBar";
import Home from "./Pages/Home";
import AdminFoods from "./Pages/AdminFoods";
import FoodForm from "./Pages/FoodForm";
import Login from "./Pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.css";
import CartPage from "./pages/CartPage";
import AdminOrders from "./Pages/AdminOrders";
import AdminCreateRestaurants from "./Pages/AdminCreateRestaurants";
import AdminRestaurants from "./Pages/AdminRestaurants";

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
        <Route path="/carrito" element={<CartPage />} />
  

        {/* Protegido */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/restaurants" element={<AdminRestaurants />} />
          <Route path="/admin/restaurants/new" element={<AdminCreateRestaurants />} />
          <Route path="/admin/foods" element={<AdminFoods />} />
          <Route path="/admin/foods/new" element={<FoodForm />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin" element={<Navigate to="/admin/foods" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 16 }}>404 — Página no encontrada</div>} />
      </Routes>
    </>
  );
}
