import { useEffect, useMemo, useState } from "react";
import styles from "./AdminRestaurants.module.css";

// ⬇️ Usa el import que corresponda según dónde guardaste las funciones:
// Si seguiste mi propuesta:
import { listRestaurants } from "../config/restaurants";
// Si las pusiste en src/config/restaurants.js, usa esto:
// import { listRestaurants } from "../config/restaurants";

export default function AdminRestaurants() {
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); // all | open | closed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await listRestaurants();
        if (alive) setAll(Array.isArray(data) ? data : []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    let rows = [...all];

    // Orden: más recientes primero
    rows.sort((a, b) => (b?.created_at || "").localeCompare(a?.created_at || ""));

    // Búsqueda por nombre, ciudad, tags
    const needle = q.trim().toLowerCase();
    if (needle) {
      rows = rows.filter(r => {
        const hay =
          (r.name || "").toLowerCase().includes(needle) ||
          (r.city || "").toLowerCase().includes(needle) ||
          (r.tags || []).some(t => (t || "").toLowerCase().includes(needle));
        return hay;
      });
    }

    // Filtro abierto/cerrado
    if (status !== "all") {
      const isOpen = status === "open";
      rows = rows.filter(r => !!r.isOpen === isOpen);
    }
    return rows;
  }, [all, q, status]);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1>Restaurantes</h1>
        <a className={styles.btnPrimary} href="/admin/restaurants/new">+ Nuevo</a>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar por nombre, ciudad o tag…"
        />
        <select
          className={styles.select}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="open">Abiertos</option>
          <option value="closed">Cerrados</option>
        </select>
      </div>

      {loading ? (
        <p className={styles.muted}>Cargando…</p>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay restaurantes para mostrar.</p>
          <a className={styles.btnPrimary} href="/admin/restaurants/new">Crear el primero</a>
        </div>
      ) : (
        <ul className={styles.grid}>
          {filtered.map(r => (
            <li key={r.id} className={styles.card}>
              <div className={styles.coverWrap}>
                {r.coverUrl ? (
                  <img className={styles.cover} src={r.coverUrl} alt={r.name} />
                ) : (
                  <div className={styles.coverPlaceholder}>Sin portada</div>
                )}
                <span className={`${styles.badge} ${r.isOpen ? styles.badgeOpen : styles.badgeClosed}`}>
                  {r.isOpen ? "Abierto" : "Cerrado"}
                </span>
              </div>

              <div className={styles.body}>
                <div className={styles.headerRow}>
                  <div className={styles.logoWrap}>
                    {r.logoUrl ? (
                      <img className={styles.logo} src={r.logoUrl} alt={`${r.name} logo`} />
                    ) : (
                      <div className={styles.logoPlaceholder}>🍽️</div>
                    )}
                  </div>
                  <div className={styles.titleBox}>
                    <h3 className={styles.title}>{r.name}</h3>
                    <div className={styles.sub}>
                      {(r.city || "—")} · Min ${Number(r.minOrder || 0).toLocaleString("es-AR")}
                      {Number(r.deliveryFee || 0) > 0 ? ` · Envío $${Number(r.deliveryFee).toLocaleString("es-AR")}` : " · Envío $0"}
                    </div>
                  </div>
                </div>

                {r.description && <p className={styles.desc}>{r.description}</p>}

                {Array.isArray(r.tags) && r.tags.length > 0 && (
                  <div className={styles.tags}>
                    {r.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                {/* Cuando tengas la vista pública: */}
                {r.slug && <a className={styles.btnGhost} href={`/r/${r.slug}`}>Ver público</a>}
                {/* Cuando tengas edición: */}
                {/* <a className={styles.btnSecondary} href={`/admin/restaurants/${r.id}/edit`}>Editar</a> */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
