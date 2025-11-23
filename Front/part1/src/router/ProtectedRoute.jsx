// src/router/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function hasAllowedRole(user, allowedRoles) {
  if (!user) return false;
  const roles = user.roles ?? (user.role ? [user.role] : []);
  if (!allowedRoles || allowedRoles.length === 0) return true; // si no se pasan roles, solo requiere estar logueado
  return roles.some((r) => allowedRoles.includes(r));
}

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, ready } = useAuth();
  const loc = useLocation();

  if (!ready) {
    // Mientras se chequea el token
    return <div>Cargando...</div>;
  }

  if (!user) {
    // No logueado → al login
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }

  if (!hasAllowedRole(user, allowedRoles)) {
    // Logueado pero sin permiso
    return <Navigate to="/unauthorized" replace />;
  }

  // Todo OK → renderizar lo que venga dentro
  return <Outlet />;
}
