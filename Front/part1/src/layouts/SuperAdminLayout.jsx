// src/layouts/SuperAdminLayout.jsx
import Navbar from "../components/Navbar";

export default function SuperAdminLayout({ children }) {
  return (
    <div className="pm-superadmin-layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
