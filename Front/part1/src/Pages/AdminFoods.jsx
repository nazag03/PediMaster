import { useEffect, useMemo, useState } from "react";
import { fetchFoods, deleteFood } from "../Components/Api";
import { Link } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import styles from "./AdminFoods.module.css"; // 👈 módulos

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchFoods();
      setFoods(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const txt = q.trim().toLowerCase();
    if (!txt) return foods;
    return foods.filter(f =>
      [f.name, f?.category?.name].join(" ").toLowerCase().includes(txt)
    );
  }, [foods, q]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const f of filtered) {
      const key = f?.category?.name || "Sin categoría";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(f);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const onRemove = async (id) => {
    if (!confirm("¿Quitar esta comida?")) return;
    setRemoving(id);
    const prev = foods;
    setFoods(prev.filter(f => f.id !== id));
    try {
      await deleteFood(id);
    } catch {
      setFoods(prev);
      alert("No se pudo eliminar");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className={styles.af}>
      <div className={styles.topbar}>
        <h1 className={styles.title}>Comidas</h1>
        <div className={styles.actions}>
          <input
            className={styles.search}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por nombre o categoría…"
          />
          <Link to="/admin/foods/new" className={styles.btnPrimary}>➕ Nueva</Link>
        </div>
      </div>

      {loading ? (
        <p className={styles.muted}>Cargando…</p>
      ) : !foods.length ? (
        <p className={styles.muted}>No hay comidas. Creá la primera con “Nueva”.</p>
      ) : (
        <div className={styles.groups}>
          {groups.map(([cat, items]) => (
            <section key={cat} className={styles.group}>
              <h2 className={styles.groupTitle}>{cat}</h2>
              <div className={styles.grid}>
                {items.map(f => (
                  <div key={f.id} className={styles.cardWrap}>
                    <FoodCard item={f} />
                    <div className={styles.cardBtns}>
                      <button
                        onClick={() => onRemove(f.id)}
                        disabled={removing === f.id}
                        className={styles.btnDanger}
                        title="Quitar"
                      >
                        {removing === f.id ? "Quitando…" : "Quitar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
