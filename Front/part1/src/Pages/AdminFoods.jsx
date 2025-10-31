import { useEffect, useMemo, useState } from "react";
import { fetchFoods, deleteFood } from "../Components/Api";
import { Link } from "react-router-dom";

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null); // id que se está quitando

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

  // filtro por búsqueda
  const filtered = useMemo(() => {
    const txt = q.trim().toLowerCase();
    if (!txt) return foods;
    return foods.filter(f =>
      [f.name, f?.category?.name].join(" ").toLowerCase().includes(txt)
    );
  }, [foods, q]);

  // agrupar por categoría
  const groups = useMemo(() => {
    const map = new Map();
    for (const f of filtered) {
      const key = f?.category?.name || "Sin categoría";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(f);
    }
    // ordenar por nombre de categoría
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const onRemove = async (id) => {
    if (!confirm("¿Quitar esta comida?")) return;
    setRemoving(id);
    // Optimistic UI
    const prev = foods;
    setFoods(prev.filter(f => f.id !== id));
    try {
      await deleteFood(id);
    } catch {
      // rollback si falla
      setFoods(prev);
      alert("No se pudo eliminar");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display:"flex", gap:12, alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" }}>
        <h1 style={{ margin:0 }}>Comidas</h1>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por nombre o categoría…"
            style={input}
          />
          <Link to="/admin/foods/new" style={btnPrimary}>➕ Nueva</Link>
        </div>
      </div>

      {loading ? (
        <p style={{ color:"#9ca3af", marginTop:12 }}>Cargando…</p>
      ) : !foods.length ? (
        <p style={{ color:"#9ca3af", marginTop:12 }}>No hay comidas. Creá la primera con “Nueva”.</p>
      ) : (
        <div style={{ display:"grid", gap:24, marginTop:16 }}>
          {groups.map(([cat, items]) => (
            <section key={cat}>
              <h2 style={{ margin:"0 0 10px" }}>{cat}</h2>
              <div style={cards}>
                {items.map(f => (
                  <article key={f.id} style={card}>
                    <div style={{ margin: "-14px -14px 10px", overflow: "hidden", borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                    {f.photo_url ? (
                        <img
                        src={f.photo_url}
                        alt={f.name}
                        style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                        loading="lazy"
                        />
                    ) : (
                        <div style={{ width: "100%", height: 140, background: "#0f172a", display:"grid", placeItems:"center", color:"#94a3b8", fontSize:12 }}>
                        Sin imagen
                        </div>
                    )}
                    </div>
                    <header style={{ display:"flex", justifyContent:"space-between", alignItems:"start", gap:10 }}>
                      <h3 style={{ margin:0, fontSize:18 }}>{f.image}</h3>
                      <h3 style={{ margin:0, fontSize:18 }}>{f.name}</h3>
                      <span style={{ fontSize:12, color: f.is_available ? "#86efac" : "#fca5a5" }}>
                        {f.is_available ? "Disponible" : "Agotado"}
                      </span>
                    </header>

                    {f.description && (
                      <p style={{ margin:"6px 0 8px", color:"#cbd5e1", fontSize:14 }}>
                        {f.description}
                      </p>
                    )}

                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                      <strong style={{ fontSize:16 }}>
                        ${Number(f.price || 0).toLocaleString("es-AR")}
                      </strong>
                      <span title="Tiempo de preparación" style={{ fontSize:12, color:"#9ca3af" }}>
                        ⏱ {f.prep_time_minutes ?? 0} min
                      </span>
                    </div>

                    <div style={{ display:"flex", gap:8, marginTop:12, justifyContent:"flex-end" }}>
                      {/* (Opcional) botón editar si después lo implementás
                      <Link to={`/admin/foods/${f.id}/edit`} style={btnGhost}>Editar</Link>
                      */}
                      <button
                        onClick={() => onRemove(f.id)}
                        disabled={removing === f.id}
                        style={btnDanger}
                        title="Quitar"
                      >
                        {removing === f.id ? "Quitando…" : "Quitar"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

const input = {
  padding:"10px 12px",
  borderRadius:10,
  border:"1px solid #334155",
  background:"#0f172a",
  color:"#e5e7eb",
  minWidth:280
};

const cards = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))",
  gap:12
};

const card = {
  border:"1px solid #1f2937",
  borderRadius:14,
  padding:14,
  background:"#0b1220",
  color:"#e5e7eb",
  boxShadow:"0 6px 20px rgba(0,0,0,.15)"
};

const btnPrimary = {
  padding:"10px 14px",
  borderRadius:10,
  background:"#22c55e",
  border:"1px solid #14532d",
  color:"#052e16",
  fontWeight:800,
  textDecoration:"none"
};

const btnDanger = {
  padding:"8px 12px",
  borderRadius:10,
  background:"#3f1d1d",
  border:"1px solid #7f1d1d",
  color:"#fecaca",
  cursor:"pointer"
};

// const btnGhost = { padding:"8px 12px", borderRadius:10, background:"transparent", border:"1px solid #334155", color:"#e5e7eb" };
