// src/components/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import styles from "./AdminSidebar.module.css";
import logo from "../assets/PedimasterLogo.png";

const superAdminMenu = [
  {
    title: "Configuración de forms",
    items: [
      { label: "Form Usuarios", to: "/superadmin/forms/users" },
      { label: "Form Restaurantes", to: "/superadmin/forms/restaurants" },
      { label: "Form Tags", to: "/superadmin/forms/tags" },
    ],
  },
  {
    title: "Gestión",
    items: [
      { label: "Dashboard", to: "/superadmin/dashboard" },
      { label: "Usuarios", to: "/superadmin/users" },
      { label: "Restaurantes", to: "/superadmin/restaurants" },
      { label: "Pedidos", to: "/superadmin/orders" },
    ],
  },
];

const adminMenu = [
  {
    title: "Mi restaurante",
    items: [
      { label: "Mi menú", to: "/admin/foods" },
      { label: "Horarios", to: "/admin/schedule" },
      { label: "Pedidos", to: "/admin/orders" },
    ],
  },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  const isSuperAdmin = user?.role === "SuperAdmin";
  const menuToUse = isSuperAdmin ? superAdminMenu : adminMenu;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src={logo} alt="Pedimaster" />
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>Pedimaster</span>
          <span className={styles.brandSubtitle}>
            Panel {isSuperAdmin ? "SuperAdmin" : "Admin"}
          </span>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuToUse.map((group) => (
          <div key={group.title} className={styles.navGroup}>
            <div className={styles.navGroupTitle}>{group.title}</div>
            <div className={styles.navItems}>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navItem} ${styles.navItemActive}`
                      : styles.navItem
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.userBox}>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name || "Sin nombre"}</div>
          <div className={styles.userEmail}>{user?.email}</div>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
