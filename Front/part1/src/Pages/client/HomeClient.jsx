// src/pages/client/HomeClient.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantApi } from "../../api/restaurantApi";
import styles from "./HomeClient.module.css";

export default function HomeClient() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErr("");
        const data = await restaurantApi.getAll();
        if (!mounted) return;

        // Ajustá esto según lo que devuelva tu API
        const list = Array.isArray(data) ? data : data.items ?? [];
        setRestaurants(list);
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "No se pudo cargar las rotiserías");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleOpenRestaurant = (id) => {
    nav(`/restaurants/${id}`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Pedimaster</h1>
          <p className={styles.subtitle}>¿Qué comemos hoy?</p>
        </div>
        <div className={styles.chipRow}>
          <span className={styles.chip}>Abierto ahora</span>
          <span className={styles.chip}>Promo del día</span>
          <span className={styles.chip}>Cerca mío</span>
        </div>
      </header>

      {loading && <div className={styles.info}>Cargando rotiserías...</div>}
      {err && !loading && <div className={styles.error}>{err}</div>}

      {!loading && !err && restaurants.length === 0 && (
        <div className={styles.info}>
          Todavía no hay rotiserías cargadas. Volvé más tarde 🧡
        </div>
      )}

      <section className={styles.grid}>
        {restaurants.map((r) => (
          <article
            key={r.id}
            className={styles.card}
            onClick={() => handleOpenRestaurant(r.id)}
          >
            <div className={styles.cardImageWrap}>
              {r.imageUrl ? (
                <img
                  src={r.imageUrl}
                  alt={r.name}
                  className={styles.cardImage}
                />
              ) : (
                <div className={styles.cardImagePlaceholder}>PM</div>
              )}
              <span className={styles.badge}>Envío rápido</span>
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{r.name}</h2>
              <p className={styles.cardDesc}>{r.description}</p>

              <div className={styles.cardMeta}>
                <span>📍 {r.address}</span>
                {r.telephone && <span>📞 {r.telephone}</span>}
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.tag}>Minutas</span>
                <span className={styles.tag}>Pizzas</span>
                <span className={styles.tag}>Empanadas</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
