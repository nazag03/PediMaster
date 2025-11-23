// src/layouts/ClientLayout.jsx
import Navbar from "../components/Navbar"; // ajustá la ruta según tu proyecto

export default function ClientLayout({ children }) {
  return (
    <div className="pm-client-layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
