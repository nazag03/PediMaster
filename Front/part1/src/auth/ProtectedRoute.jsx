// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, ready } = useAuth();
  const loc = useLocation();

  // Mientras carga el estado de auth
  if (!ready) return null; // o un spinner si querés

  // No está logueado → al login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: loc.pathname }}
      />
    );
  }

  // Si la ruta pide roles específicos, controlo acá
  if (allowedRoles.length > 0) {
    // Soporta:
    // - user.role = "SuperAdmin"
    // - user.role = ["SuperAdmin", "Admin"]
    // - user.roles = ["SuperAdmin", "Admin"]
    const rolesDelUsuario = (() => {
      if (Array.isArray(user.roles)) return user.roles;
      if (Array.isArray(user.role)) return user.role;
      if (user.role) return [user.role];
      return [];
    })();

    const rolesUserLower = rolesDelUsuario.map((r) =>
      String(r).toLowerCase()
    );
    const rolesAllowedLower = allowedRoles.map((r) =>
      String(r).toLowerCase()
    );

    const tieneRol = rolesUserLower.some((r) =>
      rolesAllowedLower.includes(r)
    );

    // DEBUG: si querés ver qué llega
    console.log("ProtectedRoute → user:", user);
    console.log("ProtectedRoute → allowedRoles:", allowedRoles);
    console.log("ProtectedRoute → rolesDelUsuario:", rolesDelUsuario);
    console.log("ProtectedRoute → tieneRol:", tieneRol);

    if (!tieneRol) {
      // Logueado pero sin permiso → lo mando a home (o a /admin si preferís)
      return <Navigate to="/" replace />;
    }
  }

  // Todo bien → muestro las rutas hijas
  return <Outlet />;
}
