import { useEffect, useMemo, useState } from "react";
import { fetchFoods, deleteFood, toggleFoodAvailability } from "../../Components/Api";
import { Link } from "react-router-dom";
import FoodCard from "../../Components/FoodCard";
import { Eye, EyeOff } from "lucide-react"; // 👈 íconos livianos y lindos
import styles from "./AdminFoods.module.css";


export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchFoods();
      // aseguramos que cada comida tenga is_available true por defecto
      setFoods(data.map(f => ({ ...f, is_available: f.is_available ?? true })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);



  const toggleVisibility = async (id) => {
  // Optimista
  setFoods(prev => prev.map(f => f.id === id ? { ...f, is_available: !f.is_available } : f));
  try {
    await toggleFoodAvailability(id); // 👈 persistís en la API mock
  } catch {
    // rollback si falla
    setFoods(prev => prev.map(f => f.id === id ? { ...f, is_available: !f.is_available } : f));
    alert("No se pudo cambiar la visibilidad");
  }
};

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
                  <div
                    key={f.id}
                    className={`${styles.cardWrap} ${!f.is_available ? styles.hiddenCard : ""}`}
                  >
                    <FoodCard item={f} />

                    <div className={styles.cardBtns}>
                      {/* 👁️ Botón para mostrar/ocultar */}
                      <button
                        onClick={() => toggleVisibility(f.id)}
                        className={styles.btnSecondary}
                        title={f.is_available ? "Ocultar del menú" : "Mostrar en el menú"}
                      >
                        {f.is_available ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>

                      {/* ❌ Botón para eliminar */}
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
