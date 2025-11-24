// src/layouts/SuperAdminLayout.jsx
import Navbar from "../Components/Navbar";

export default function SuperAdminLayout({ children }) {
  return (
    <div className="pm-superadmin-layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
