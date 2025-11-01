import { useEffect, useMemo, useState } from "react";
import { fetchFoods } from "../Components/Api";
import FoodCard from "../components/FoodCard"; // 👈 usamos tu componente
import styles from "./Home.module.css";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const rotiseria = {
    nombre: "Rotisería Don Sabor",
    telefonoWhatsApp: "5493564651874",
    direccion: "Av. Siempre Viva 742, San Francisco, Córdoba",
    horario: [
      { dias: "Lun a Vie", horas: "11:30–15:00 / 20:00–23:00" },
      { dias: "Sáb", horas: "11:30–15:30 / 20:00–23:30" },
      { dias: "Dom", horas: "11:30–15:30" },
    ],
    mapsEmbed:
      "https://www.google.com/maps?q=Av.+Siempre+Viva+742,+San+Francisco,+C%C3%B3rdoba&output=embed",
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchFoods();
      setFoods(data);
      setLoading(false);
    })();
  }, []);

  // Función de orden de categorías: Promos -> resto -> Bebidas
  const orderKey = (catName = "") => {
    const n = catName.toLowerCase();
    if (n.includes("promo")) return 0;
    if (n.includes("bebida")) return 2;
    return 1;
  };

  // Agrupar por categoría + filtrar búsqueda + ordenar categorías
  const grupos = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const list = q
      ? foods.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f?.description?.toLowerCase().includes(q)
        )
      : foods;

    const map = new Map();
    for (const f of list) {
      const key = f?.category?.name || "Sin categoría";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(f);
    }

    // ordenar items dentro de cada grupo (opcional)
    for (const arr of map.values()) {
      arr.sort((a, b) => a.name.localeCompare(b.name, "es"));
    }

    // ordenar grupos por prioridad
    return Array.from(map.entries()).sort((a, b) => {
      const oa = orderKey(a[0]);
      const ob = orderKey(b[0]);
      if (oa !== ob) return oa - ob; // por prioridad
      return a[0].localeCompare(b[0], "es"); // alfabético dentro del mismo bloque
    });
  }, [foods, busqueda]);

  const waBase = `https://wa.me/${rotiseria.telefonoWhatsApp}?text=`;
  const msgBase = encodeURIComponent(`Hola! Quiero hacer un pedido de ${rotiseria.nombre}.`);

  return (
    <div className={styles.home}>
      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{rotiseria.nombre}</h1>
          <p>Comida casera, porciones abundantes y entrega rápida.</p>
          <button
            className={styles.btnPrimary}
            onClick={() =>
              window.open(
                `${waBase}${encodeURIComponent("Hola! ¿Me pasás el menú del día?")}`,
                "_blank"
              )
            }
          >
            Pedir por WhatsApp
          </button>
        </div>
      </header>

      {/* BÚSQUEDA */}
      <section className={styles.searchSection}>
        <input
          type="search"
          placeholder="🔎 Buscar platos o bebidas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.searchInput}
        />
      </section>

      {/* LISTADO */}
      {loading ? (
        <p className={styles.muted}>Cargando menú...</p>
      ) : (
        grupos.map(([cat, items]) => (
          <section key={cat} className={styles.section}>
            <h2 className={styles.sectionTitle}>{cat}</h2>
            <div className={styles.grid}>
              {items.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))
      )}

      {/* INFO */}
      <section className={styles.infoSection} id="info">
        <h2 className={styles.sectionTitle}>Info y horarios</h2>
        <div className={styles.infoGrid}>
          <div>
            <h3>Dirección</h3>
            <p>{rotiseria.direccion}</p>
            <h3>Horarios</h3>
            <ul className={styles.horarioList}>
              {rotiseria.horario.map((h, i) => (
                <li key={i}>
                  <strong>{h.dias}:</strong> {h.horas}
                </li>
              ))}
            </ul>
          </div>
          <iframe
            title="Mapa"
            src={rotiseria.mapsEmbed}
            loading="lazy"
            className={styles.map}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} {rotiseria.nombre}</span>
      </footer>

      {/* WhatsApp FAB */}
      <a
        className={styles.fabWA}
        href={waBase + msgBase}
        target="_blank"
        rel="noreferrer"
        aria-label="Pedir por WhatsApp"
        title="Pedir por WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
