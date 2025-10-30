import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    "nav__link" + (isActive ? " nav__link--active" : "");

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Logo / Marca */}
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
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

          {/* Ejemplo de futuras páginas públicas
          <NavLink to="/menu" className={linkClass} onClick={() => setOpen(false)}>
            Menú
          </NavLink>
          */}

          <NavLink
            to="/admin/foods/new"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Cargar comida
          </NavLink>

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
