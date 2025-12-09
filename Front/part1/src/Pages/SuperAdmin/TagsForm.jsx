// src/pages/superadmin/SuperAdminFormTags.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "./TagsForm.module.css";
import { tagApi } from "../../api/tagApi";

const GLOBAL_RESTAURANT_ID = 0; // 👈 para tags "globales"

function normalizeTag(dto) {
  return {
    id: dto.id ?? dto.tagId,
    name: dto.name,
    restaurantId: dto.restaurantId,
  };
}

export default function SuperAdminFormTags() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const total = useMemo(() => tags.length, [tags]);

  // Cargar tags al montar
  useEffect(() => {
    let cancelled = false;

    async function loadTags() {
      setLoading(true);
      setErr("");
      try {
        const data = await tagApi.getAll();
        if (!cancelled) {
          const normalized = Array.isArray(data)
            ? data.map(normalizeTag)
            : [];
          setTags(normalized);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setErr("Error al cargar las tags.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTags();
    return () => {
      cancelled = true;
    };
  }, []);

  async function addTag() {
    const value = newTag.trim().toLowerCase();
    if (!value) return;
    if (tags.some((t) => t.name.toLowerCase() === value)) return;

    setSaving(true);
    setErr("");
    setOk("");

    try {
      const payload = {
        restaurantId: GLOBAL_RESTAURANT_ID,
        name: value,
      };

      const created = await tagApi.create(payload);
      const normalized = normalizeTag(created);

      setTags((prev) => [...prev, normalized]);
      setNewTag("");
      setOk("Tag creada correctamente.");
    } catch (e) {
      console.error(e);
      setErr("No se pudo crear la tag.");
    } finally {
      setSaving(false);
    }
  }

  async function removeTag(tagId) {
    if (!tagId) return;

    setSaving(true);
    setErr("");
    setOk("");

    try {
      await tagApi.remove(tagId);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
      setOk("Tag eliminada.");
    } catch (e) {
      console.error(e);
      setErr("No se pudo eliminar la tag.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Form Tags</h1>
        <p className={styles.subtitle}>
          Mantené un set controlado de etiquetas para restaurantes y platos. Podés
          limpiarlas o ampliarlas sin tocar código.
        </p>
      </header>

      {err && <div className={styles.errorAlert}>{err}</div>}
      {ok && <div className={styles.successAlert}>{ok}</div>}

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Repositorio global</span>
            <span className={styles.statusBadge}>
              {loading ? "Cargando..." : `${total} tags`}
            </span>
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
                  disabled={saving}
                />
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={addTag}
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Agregar"}
                </button>
              </div>
            </label>

            <div className={styles.tagList}>
              {!loading &&
                tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => removeTag(tag.id)}
                      disabled={saving}
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
            <span className={styles.statusBadge}>API</span>
          </div>
          <div className={styles.content}>
            <p className={styles.subtitle}>
              Estas tags se guardan en la base vía API. Más adelante podés
              conectar export/import para backups o migraciones.
            </p>
            <div className={styles.actions}>
              <button className={styles.primaryBtn} type="button" disabled>
                Exportar JSON
              </button>
              <button className={styles.secondaryBtn} type="button" disabled>
                Importar JSON
              </button>
              {/* Más adelante podés implementar estas acciones usando tagApi */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
