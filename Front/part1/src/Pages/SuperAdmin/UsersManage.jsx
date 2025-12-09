// src/pages/SuperAdminUsers.jsx
import { useEffect, useState } from "react";
import styles from "./UsersManage.module.css";
import { userApi } from "../../api/userApi";
import { restaurantApi } from "../../api/restaurantApi";

const ROLE_OPTIONS = [
  { value: "SuperAdmin", label: "SuperAdmin" },
  { value: "Admin", label: "Admin" },
  { value: "Client", label: "Client" },
];

function normalizeRole(rawRole) {
  if (rawRole == null) return "";
  const r = String(rawRole).toLowerCase();
  if (r === "0") return "SuperAdmin";
  if (r === "1") return "Admin";
  if (r === "2") return "Client";
  if (r === "superadmin") return "SuperAdmin";
  if (r === "admin") return "Admin";
  if (r === "client" || r === "usuario") return "Client";
  return rawRole; // por si ya viene "SuperAdmin", etc.
}

function getUserId(u) {
  return u.userId ?? u.id;
}

function getRestaurantsForUser(user, restaurants) {
  const uid = getUserId(user);
  return restaurants.filter((r) => {
    const ownerId =
      r.createdForUserId ??
      r.userId ??
      r.ownerId ??
      r.ownerUserId ??
      null;
    return ownerId === uid;
  });
}

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingUserId, setSavingUserId] = useState(null);
  const [detailUser, setDetailUser] = useState(null);

  // filtros
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const [usersRes, restaurantsRes] = await Promise.all([
          userApi.getAllUsers(),
          restaurantApi.getAllRestaurants(),
        ]);

        // normalizamos rol apenas llegan
        const normalizedUsers = usersRes.map((u) => ({
          ...u,
          role: normalizeRole(u.role ?? u.roleName),
        }));

        setUsers(normalizedUsers);
        setRestaurants(restaurantsRes);
      } catch (e) {
        console.error("Error cargando usuarios", e);
        setErr(e.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChangeRole = async (user, newRoleValue) => {
    const uid = getUserId(user);
    const cleanRole = normalizeRole(newRoleValue);

    try {
      setSavingUserId(uid);

      const updated = {
        ...user,
        role: cleanRole,
      };

      await userApi.update(uid, updated);

      setUsers((prev) =>
        prev.map((u) =>
          getUserId(u) === uid ? { ...u, role: cleanRole } : u
        )
      );
    } catch (e) {
      console.error("Error cambiando rol", e);
      alert("No se pudo cambiar el rol del usuario");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleToggleActive = async (user) => {
    const uid = getUserId(user);
    const currentActive =
      user.isActive ?? user.active ?? user.enabled ?? false;
    const newActive = !currentActive;

    try {
      setSavingUserId(uid);

      const updated = {
        ...user,
        isActive: newActive,
        active: newActive,
        enabled: newActive,
      };

      await userApi.update(uid, updated);

      setUsers((prev) =>
        prev.map((u) =>
          getUserId(u) === uid
            ? {
                ...u,
                isActive: newActive,
                active: newActive,
                enabled: newActive,
              }
            : u
        )
      );
    } catch (e) {
      console.error("Error cambiando estado activo", e);
      alert("No se pudo actualizar el estado del usuario");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    const uid = getUserId(user);
    const name =
      user.fullName ||
      user.name ||
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      uid;

    if (!window.confirm(`¿Eliminar al usuario "${name}"?`)) return;

    try {
      setSavingUserId(uid);
      await userApi.remove(uid);
      setUsers((prev) => prev.filter((u) => getUserId(u) !== uid));
    } catch (e) {
      console.error("Error eliminando usuario", e);
      alert("No se pudo eliminar el usuario");
    } finally {
      setSavingUserId(null);
    }
  };

  const openDetail = (user) => setDetailUser(user);
  const closeDetail = () => setDetailUser(null);

  // filtrado
  const filteredUsers = users.filter((u) => {
    const uidStr = String(getUserId(u) ?? "").toLowerCase();
    const nameStr = (
      u.fullName ||
      u.name ||
      `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
    ).toLowerCase();
    const emailStr = (u.email || "").toLowerCase();
    const roleStr = normalizeRole(u.role).toLowerCase();

    const term = search.trim().toLowerCase();

    const matchesText =
      term === "" ||
      uidStr.includes(term) ||
      nameStr.includes(term) ||
      emailStr.includes(term);

    const matchesRole =
      roleFilter === "all" ||
      roleStr === roleFilter.toLowerCase();

    return matchesText && matchesRole;
  });

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Gestión de usuarios</h1>
        <p className={styles.subTitle}>Cargando usuarios...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Gestión de usuarios</h1>
        <p className={styles.error}>Ocurrió un error: {err}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Gestión de usuarios</h1>
          <p className={styles.subTitle}>
            Administrá roles, estados y restaurantes asociados.
          </p>
        </div>
        <div className={styles.counterChip}>
          Mostrando <strong>{filteredUsers.length}</strong> de{" "}
          <strong>{users.length}</strong> usuarios
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filtersRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar por nombre, email o ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.filterSelect}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Todos los roles</option>
          <option value="SuperAdmin">SuperAdmin</option>
          <option value="Admin">Admin</option>
          <option value="Client">Client</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Restaurantes asociados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const uid = getUserId(u);
              const userRestaurants = getRestaurantsForUser(
                u,
                restaurants
              );
              const active =
                u.isActive ?? u.active ?? u.enabled ?? false;
              const roleDisplay = normalizeRole(u.role) || "Sin rol";

              return (
                <tr key={uid}>
                  <td>{uid}</td>
                  <td>
                    {u.fullName ||
                      u.name ||
                      `${u.firstName ?? ""} ${
                        u.lastName ?? ""
                      }`.trim() ||
                      "(Sin nombre)"}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className={styles.select}
                      value={normalizeRole(u.role)}
                      onChange={(e) =>
                        handleChangeRole(u, e.target.value)
                      }
                      disabled={savingUserId === uid}
                    >
                      <option value="" disabled>
                        Seleccionar rol
                      </option>
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className={styles.roleHint}>
                      Actual: {roleDisplay}
                    </div>
                  </td>
                  <td>
                    <button
                      className={
                        active
                          ? styles.btnActive
                          : styles.btnInactive
                      }
                      onClick={() => handleToggleActive(u)}
                      disabled={savingUserId === uid}
                    >
                      {active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td>{userRestaurants.length}</td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.btnDetail}
                      onClick={() => openDetail(u)}
                    >
                      Ver detalle
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDeleteUser(u)}
                      disabled={savingUserId === uid}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal detalle */}
      {detailUser && (
        <div className={styles.modalOverlay} onClick={closeDetail}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Detalle de usuario</h2>
            <p className={styles.modalLine}>
              <strong>Nombre:</strong>{" "}
              {detailUser.fullName ||
                detailUser.name ||
                `${detailUser.firstName ?? ""} ${
                  detailUser.lastName ?? ""
                }`.trim() ||
                "(Sin nombre)"}
            </p>
            <p className={styles.modalLine}>
              <strong>Email:</strong> {detailUser.email}
            </p>
            <p className={styles.modalLine}>
              <strong>Rol:</strong>{" "}
              {normalizeRole(detailUser.role) || "Sin rol"}
            </p>

            <h3 className={styles.modalSubtitle}>
              Restaurantes asociados
            </h3>
            <ul className={styles.restaurantList}>
              {getRestaurantsForUser(detailUser, restaurants).length ===
              0 ? (
                <li className={styles.restaurantEmpty}>
                  No tiene restaurantes asociados.
                </li>
              ) : (
                getRestaurantsForUser(detailUser, restaurants).map(
                  (r) => (
                    <li key={r.restaurantId ?? r.id}>
                      <strong>{r.name}</strong> –{" "}
                      {r.address || "Sin dirección"}
                    </li>
                  )
                )
              )}
            </ul>

            <button
              className={styles.btnClose}
              onClick={closeDetail}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
