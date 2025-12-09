import { useMemo, useState } from "react";
import styles from "./SuperAdminFormUsers.module.css";

const DEFAULT_TAGS = [
  "vegano",
  "sin tacc",
  "promo",
  "horario extendido",
  "novedad",
];

export default function SuperAdminFormTags() {
  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [newTag, setNewTag] = useState("");
  const total = useMemo(() => tags.length, [tags]);

  function addTag() {
    const value = newTag.trim().toLowerCase();
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setNewTag("");
  }

  function removeTag(tag) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Form Tags</h1>
        <p className={styles.subtitle}>
          Mantené un set controlado de etiquetas para restaurantes y platos. Podés limpiarlas
          o ampliarlas sin tocar código.
        </p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Repositorio global</span>
            <span className={styles.statusBadge}>{total} tags</span>
          </div>
          <div className={styles.content}>
            <label className={styles.label}>
              Nueva etiqueta
              <div className={styles.actions}>
                <input
                  className={styles.input}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="apto celiacos"
                />
                <button type="button" className={styles.primaryBtn} onClick={addTag}>
                  Agregar
                </button>
              </div>
            </label>

            <div className={styles.tagList}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => removeTag(tag)}
                  >
                    Quitar
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Sincronización</span>
            <span className={styles.statusBadge}>Manual</span>
          </div>
          <div className={styles.content}>
            <p className={styles.subtitle}>
              Cuando conectes la API, definí aquí si querés sincronizar con una colección de
              base de datos o mantenerlas en memoria para pruebas.
            </p>
            <div className={styles.actions}>
              <button className={styles.primaryBtn} type="button">
                Exportar JSON
              </button>
              <button className={styles.secondaryBtn} type="button">
                Importar JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
