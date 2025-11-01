import { useEffect, useMemo, useState } from "react";
import { createFood, fetchCategories, createCategory } from "../Components/Api";
import styles from "./FoodForm.module.css";

export default function FoodForm() {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_available: true,
    prep_time_minutes: 15,
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [serverMsg, setServerMsg] = useState("");

  // estado para "nueva categoría"
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const priceNumber = useMemo(() => Number(values.price), [values.price]);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files?.[0] || null;
      setValues(v => ({ ...v, [name]: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else if (type === "checkbox") {
      setValues(v => ({ ...v, [name]: checked }));
    } else {
      setValues(v => ({ ...v, [name]: value }));
    }
    setServerMsg("");
  };

  const onCategoryChange = (e) => {
    const val = e.target.value;
    if (val === "__new__") {
      // mostrar UI de nueva categoría
      setShowNewCat(true);
      setNewCatName("");
      setValues(v => ({ ...v, category_id: "" }));
    } else {
      setShowNewCat(false);
      setNewCatName("");
      setValues(v => ({ ...v, category_id: val }));
    }
  };

  const handleCreateCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    try {
      setCreatingCat(true);
      const created = await createCategory(name);
      // actualizar listado y setear seleccionada
      setCategories(prev => {
        const exists = prev.some(c => c.id === created.id);
        return exists ? prev : [...prev, created].sort((a,b)=>a.name.localeCompare(b.name));
      });
      setValues(v => ({ ...v, category_id: String(created.id) }));
      setShowNewCat(false);
      setNewCatName("");
      setServerMsg(`✅ Categoría creada: ${created.name}`);
    } catch (err) {
      setServerMsg(`❌ No se pudo crear la categoría: ${err.message?.slice(0,200)}`);
    } finally {
      setCreatingCat(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "El nombre es obligatorio";
    if (values.price === "" || isNaN(priceNumber) || priceNumber <= 0) e.price = "Precio inválido";
    if (values.prep_time_minutes === "" || Number(values.prep_time_minutes) < 0) e.prep_time_minutes = "Tiempo inválido";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const fd = new FormData();
    fd.append("name", values.name.trim());
    fd.append("description", values.description.trim());
    fd.append("price", priceNumber.toFixed(2));
    if (values.category_id) fd.append("category_id", values.category_id);
    fd.append("is_available", String(values.is_available));
    fd.append("prep_time_minutes", String(values.prep_time_minutes));
    if (values.photo) fd.append("photo", values.photo);

    try {
      setSubmitting(true);
      setServerMsg("");
      const created = await createFood(fd);
      setServerMsg(`✅ Creado: ${created.name} (id ${created.id})`);
      setValues({
        name: "",
        description: "",
        price: "",
        category_id: "",
        is_available: true,
        prep_time_minutes: 15,
        photo: null,
      });
      setPreview(null);
      setErrors({});
    } catch (err) {
      setServerMsg(`❌ Error: ${err.message?.slice(0, 240)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h2 className={styles.title}>Alta de comida</h2>

      <div className={styles.field}>
        <label className={styles.label}>Nombre *</label>
        <input
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Ej: Milanesa napolitana"
          className={styles.input}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Descripción</label>
        <textarea
          name="description"
          value={values.description}
          onChange={onChange}
          placeholder="Detalle, porciones, salsas, etc."
          rows={3}
          className={styles.textarea}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Precio (ARS) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={onChange}
            placeholder="6500"
            className={styles.input}
          />
          {errors.price && <span className={styles.error}>{errors.price}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Categoría</label>
          <select
            name="category_id"
            value={values.category_id}
            onChange={onCategoryChange}
            className={styles.select}
          >
            <option value="">— Sin categoría —</option>
            {categories.sort((a,b)=>a.name.localeCompare(b.name)).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="__new__">+ Crear categoría…</option>
          </select>

          {showNewCat && (
            <div className={styles.newCatRow}>
              <input
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className={styles.input}
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={creatingCat || !newCatName.trim()}
                className={styles.btnSecondary}
                title="Crear categoría"
              >
                {creatingCat ? "Creando…" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => { setShowNewCat(false); setNewCatName(""); }}
                className={styles.btnGhost}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Tiempo de preparación (min)</label>
          <input
            name="prep_time_minutes"
            type="number"
            min="0"
            value={values.prep_time_minutes}
            onChange={onChange}
            className={styles.input}
          />
          {errors.prep_time_minutes && (
            <span className={styles.error}>{errors.prep_time_minutes}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="is_available"
              checked={values.is_available}
              onChange={onChange}
            />
            Disponible para la venta
          </label>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Foto (opcional)</label>
        <input
          type="file"
          accept="image/*"
          name="photo"
          onChange={onChange}
          className={styles.input}
        />
        {preview && (
          <div className={styles.preview}>
            <img src={preview} alt="preview" />
          </div>
        )}
      </div>

      <button className={styles.btn} disabled={submitting}>
        {submitting ? "Guardando..." : "Guardar comida"}
      </button>

      {serverMsg && <p className={styles.serverMsg}>{serverMsg}</p>}
    </form>
  );
}
