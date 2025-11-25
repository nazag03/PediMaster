// src/pages/AppPage.jsx
import { useEffect, useState } from "react";
import { fetchRestaurants } from "../api/restaurantApi";
import styles from "./AppPage.module.css";
import Navbar from "../Components/NavBar";

export default function AppPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPromo, setFilterPromo] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchRestaurants()
      .then((data) => {
        if (mounted) {
          setRestaurants(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = restaurants.filter((r) => {
    if (filterOpen && !r.isOpen) return false;
    if (filterPromo && !r.promo) return false;
    return true;
  });

  return (
    <div className={styles.page}>
        <Navbar></Navbar>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Rotiserías cerca tuyo</p>
          <h1 className={styles.title}>Elegí dónde pedir esta vez</h1>
          <p className={styles.lead}>
            Explora las rotiserías de tu barrio, mirá la demora estimada y las promos
            antes de hacer tu pedido.
          </p>
        </div>

        <div className={styles.filters}>
          <button
            type="button"
            className={`${styles.filterChip} ${
              filterOpen ? styles.filterChipActive : ""
            }`}
            onClick={() => setFilterOpen((v) => !v)}
          >
            Abierto ahora
          </button>
          <button
            type="button"
            className={`${styles.filterChip} ${
              filterPromo ? styles.filterChipActive : ""
            }`}
            onClick={() => setFilterPromo((v) => !v)}
          >
            Con promo
          </button>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Cargando rotiserías...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No encontramos rotiserías con esos filtros.</p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => {
              setFilterOpen(false);
              setFilterPromo(false);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <main className={styles.grid}>
          {filtered.map((r) => (
            <article key={r.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {r.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div className={styles.cardTitleBlock}>
                  <h2 className={styles.cardTitle}>{r.name}</h2>
                  <p className={styles.cardCategory}>{r.category}</p>
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    r.isOpen ? styles.statusOpen : styles.statusClosed
                  }`}
                >
                  {r.isOpen ? "Abierto" : "Cerrado"}
                </span>
              </div>

              <p className={styles.address}>{r.address}</p>

              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  ⭐ {r.rating.toFixed(1)}{" "}
                  <span className={styles.metaSub}>({r.reviewsCount})</span>
                </span>
                <span className={styles.metaItem}>
                  ⏱ {r.etaMin}–{r.etaMax} min
                </span>
                <span className={styles.metaItem}>
                  📍 {r.distanceKm.toFixed(1)} km
                </span>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  Mínimo ${r.minOrder.toLocaleString("es-AR")}
                </span>
                <span className={styles.metaItem}>
                  Envío {r.deliveryFee === 0 ? "gratis" : `$${r.deliveryFee}`}
                </span>
              </div>

              {r.promo && <p className={styles.promo}>{r.promo}</p>}

              <div className={styles.cardFooter}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  disabled={!r.isOpen}
                >
                  {r.isOpen ? "Ver menú" : "Ver menú igual"}
                </button>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  );
}
