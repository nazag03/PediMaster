import { Routes, Route, Link, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const FoodForm = lazy(() => import("./Pages/FoodForm"));
const Home = lazy(() => import("./Pages/Head"));

export default function App() {
  return (
    <>
      <nav>...</nav>
      <Suspense fallback={<div style={{padding:16}}>Cargando…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/foods/new" element={<FoodForm />} />
          <Route path="/admin" element={<Navigate to="/admin/foods/new" replace />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </Suspense>
    </>
  );
}
