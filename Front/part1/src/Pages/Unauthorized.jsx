// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div
      style={{
        padding: "2rem 1rem",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
        No tenés permiso para ver esta página
      </h1>
      <p style={{ marginBottom: "1.2rem", color: "#555" }}>
        Si creés que esto es un error, hablá con el administrador de Pedimaster.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          padding: "0.6rem 1.2rem",
          borderRadius: "999px",
          background: "#ff7a1a",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
