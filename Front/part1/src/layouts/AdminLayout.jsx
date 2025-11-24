// src/layouts/AdminLayout.jsx
import Navbar from "../Components/Navbar"; // podés hacer una nav distinta si querés

export default function AdminLayout({ children }) {
  return (
    <div className="pm-admin-layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
