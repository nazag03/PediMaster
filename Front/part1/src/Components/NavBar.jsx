// src/Components/NavBar.jsx (o como lo tengas)
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import logo from "../assets/PedimasterLogo.png";
import styles from "./NavBar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.nav__link} ${styles.nav__linkActive}` : styles.nav__link;

  // 🔥 Función helper para ver si es SuperAdmin,
  // soporta user.role = "SuperAdmin" o user.roles = ["SuperAdmin", ...]
  const isSuperAdmin = (() => {
    if (!user) return false;
    const roles = user.roles ?? [];
    return roles.includes("SuperAdmin");
  })();

  return (
    <header className={styles.nav}>
      <div className={styles.nav__inner}>
        <NavLink
          to="/"
          className={styles.nav__brand}
          onClick={() => setOpen(false)}
        >
          <img src={logo} alt="PediMaster" className={styles.nav__logo} />
          <span>PediMaster</span>
        </NavLink>

        {/* Botón hamburguesa (mobile) */}
        <button
          className={styles.nav__burger}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <nav className={`${styles.nav__links} ${open ? styles.isOpen : ""}`}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Inicio
          </NavLink>

          {/* 👑 Solo SuperAdmin ve este link */}
          {isSuperAdmin && (
            <NavLink
              to="/superadmin/restaurants/new"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Nueva rotisería
            </NavLink>
          )}

          {user ? (
            <>
              <NavLink
                to="/admin/foods"
                end
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Comidas
              </NavLink>
              <NavLink
                to="/admin/orders"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Pedidos
              </NavLink>
              <NavLink
                to="/admin/foods/new"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Cargar comida
              </NavLink>

              <span className={styles.nav__hello}>
                Hola, {user.email}
              </span>

              <button
                className={`${styles.nav__link} ${styles.asButton}`}
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          )}

          <a
            className={styles.nav__cta}
            href="https://wa.me/5493512345678"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
