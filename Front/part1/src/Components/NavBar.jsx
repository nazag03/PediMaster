import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../auth/useAuth"; // ✅ importa el contexto
import logo from "../assets/LogoPedimaster2.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth(); // ✅ obtenemos el usuario logueado y logout()

  const linkClass = ({ isActive }) =>
    "nav__link" + (isActive ? " nav__link--active" : "");

  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
        <img src={logo} alt="PediMaster" className="nav__logo" />
          PediMaster
        </NavLink>

        {/* Botón hamburguesa (mobile) */}
        <button
          className="nav__burger"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <nav className={"nav__links " + (open ? "is-open" : "")}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Inicio
          </NavLink>

          {user ? (
            <>
              {/* Solo visible si está logueado */}
              <NavLink
                to="/admin/foods"
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
                to="/carrito"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Cargar comida
              </NavLink>
              {user && <span style={{ color:"#86efac", fontSize:12 }}>Hola, {user.username}</span>}
              <button
                className="nav__link"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                }}
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            // Si no hay usuario logueado → mostrar Login
            <NavLink
              to="/login"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          )}

          {/* CTA / botón derecho */}
          <a
            className="nav__cta"
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
