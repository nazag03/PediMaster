// src/pages/SuperAdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SuperAdminDashboard.module.css";
import { userApi } from "../../api/userApi";
import { restaurantApi } from "../../api/restaurantApi";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        // Llamadas al back usando tus APIs
        const [users, restaurants] = await Promise.all([
          userApi.getAllUsers(),
          restaurantApi.getAllRestaurants(),
        ]);

        const totalUsers = users.length;
        const totalRestaurants = restaurants.length;

        // Activos / inactivos
        const activeRestaurants = restaurants.filter((r) => {
          const status = (r.status || "").toLowerCase();
          const isActiveValue =
            r.isActive ??
            r.active ??
            (status === "active" || status === "activo");
          return Boolean(isActiveValue);
        }).length;

        const inactiveRestaurants = totalRestaurants - activeRestaurants;

        // ---- helpers de fechas ----
        const normalizeDate = (item) =>
          item.createdAt ||
          item.creationDate ||
          item.createdOn ||
          item.createdDate ||
          item.registeredAt ||
          null;

        const sortByDateDesc = (arr) =>
          [...arr].sort((a, b) => {
            const da = new Date(normalizeDate(a) || 0).getTime();
            const db = new Date(normalizeDate(b) || 0).getTime();
            return db - da;
          });

        // Últimos restaurantes
        const latestRestaurants = sortByDateDesc(restaurants)
          .slice(0, 5)
          .map((r) => ({
            id: r.restaurantId ?? r.id,
            name: r.name,
            createdAt: normalizeDate(r) || "-",
            status:
              (r.status ||
                (r.isActive || r.active ? "active" : "inactive")) ?? "unknown",
            slug: r.slug,
          }));

        // Últimos usuarios
        const latestUsers = sortByDateDesc(users)
          .slice(0, 5)
          .map((u) => ({
            id: u.userId ?? u.id,
            name:
              u.fullName ||
              u.name ||
              `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
              "(Sin nombre)",
            email: u.email,
            createdAt: normalizeDate(u) || "-",
          }));

        setStats({
          totalUsers,
          totalRestaurants,
          activeRestaurants,
          inactiveRestaurants,
          latestRestaurants,
          latestUsers,
        });
      } catch (e) {
        console.error("Error cargando dashboard superadmin", e);
        setErr(e.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Dashboard SuperAdmin</h1>
        <p className={styles.subTitle}>Cargando métricas desde el servidor...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Dashboard SuperAdmin</h1>
        <p className={styles.error}>Ocurrió un error: {err}</p>
      </div>
    );
  }

  if (!stats) return null;

  const {
    totalUsers,
    totalRestaurants,
    activeRestaurants,
    inactiveRestaurants,
    latestRestaurants,
    latestUsers,
  } = stats;

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Dashboard SuperAdmin</h1>
          <p className={styles.subTitle}>
            Visión general de usuarios y restaurantes en Pedimaster.
          </p>
        </div>
      </div>

      {/* Cards métricas */}
      <div className={styles.cardsGrid}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Usuarios totales</span>
          <span className={styles.cardValue}>{totalUsers}</span>
          <span className={styles.cardHint}>Todos los usuarios registrados</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Restaurantes totales</span>
          <span className={styles.cardValue}>{totalRestaurants}</span>
          <span className={styles.cardHint}>Incluye activos e inactivos</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Restaurantes activos</span>
          <span className={styles.cardValue}>{activeRestaurants}</span>
          <span className={styles.cardHint}>Visibles para los usuarios</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Restaurantes inactivos</span>
          <span className={styles.cardValue}>{inactiveRestaurants}</span>
          <span className={styles.cardHint}>Ocultos o pendientes</span>
        </div>
      </div>

      {/* Listas inferiores */}
      <div className={styles.listsWrapper}>
        <section className={styles.listBlock}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Últimos restaurantes creados</h2>
            <Link to="/superadmin/restaurants" className={styles.link}>
              Ver todos
            </Link>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha creación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {latestRestaurants.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.createdAt}</td>
                  <td>
                    <span
                      className={
                        (r.status || "").toLowerCase().includes("active") ||
                        (r.status || "").toLowerCase().includes("activo")
                          ? styles.statusActive
                          : styles.statusInactive
                      }
                    >
                      {(r.status || "").toLowerCase().includes("active") ||
                      (r.status || "").toLowerCase().includes("activo")
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.listBlock}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Últimos usuarios registrados</h2>
            <Link to="/superadmin/users" className={styles.link}>
              Ver todos
            </Link>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Alta</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
