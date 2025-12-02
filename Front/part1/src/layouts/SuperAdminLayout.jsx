import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import styles from "./SuperAdminLayout.module.css";
import logo from "../assets/PedimasterLogo.png";

const superAdminMenu = [
  {
    title: "Configuración de forms",
    items: [
      { label: "Form Usuarios", to: "/admin/forms/users" },
      { label: "Form Restaurantes", to: "/admin/forms/restaurants" },
      { label: "Form Menús", to: "/admin/forms/menus" },
      { label: "Form Tags", to: "/admin/forms/tags" },
    ],
  },
  {
    title: "Gestión",
    items: [
      { label: "Usuarios", to: "/admin/users" },
      { label: "Restaurantes", to: "/admin/restaurants" },
      { label: "Pedidos", to: "/admin/orders" },
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

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const isSuperAdmin = user?.role === "SuperAdmin"; // asegurate que matchee tu JWT

  const menuToUse = isSuperAdmin ? superAdminMenu : adminMenu;

  return (
    <div className={styles.layout}>
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

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
