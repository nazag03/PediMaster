// src/auth/RequireRole.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export function RequireRole({ roles, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  // Mientras carga el auth (opcional: spinner)
  if (!ready) return null;

  // Si no está logueado, va al login
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Si no tiene el rol requerido, lo mandamos al home (o donde quieras)
  const hasRole = roles.includes(user.role); 
  // si es array:
  // const hasRole = user.roles?.some((r) => roles.includes(r));

  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
