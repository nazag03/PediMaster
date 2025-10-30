import { useEffect, useMemo, useState } from "react";
import { createFood, fetchCategories } from "../Components/Api";
import "./FoodForm.css";

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

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "El nombre es obligatorio";
    if (values.price === "" || isNaN(priceNumber) || priceNumber <= 0) e.price = "Precio inválido";
    if (values.prep_time_minutes === "" || Number(values.prep_time_minutes) < 0) e.prep_time_minutes = "Tiempo inválido";
    // desc opcional, category opcional
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
      // limpiar
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
    <form onSubmit={onSubmit} className="food-form">
      <h2>Alta de comida</h2>

      <div className="field">
        <label>Nombre *</label>
        <input
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Ej: Milanesa napolitana"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="field">
        <label>Descripción</label>
        <textarea
          name="description"
          value={values.description}
          onChange={onChange}
          placeholder="Detalle, porciones, salsas, etc."
          rows={3}
        />
      </div>

      <div className="row">
        <div className="field">
          <label>Precio (ARS) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={onChange}
            placeholder="6500"
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="field">
          <label>Categoría</label>
          <select name="category_id" value={values.category_id} onChange={onChange}>
            <option value="">— Sin categoría —</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label>Tiempo de preparación (min)</label>
          <input
            name="prep_time_minutes"
            type="number"
            min="0"
            value={values.prep_time_minutes}
            onChange={onChange}
          />
          {errors.prep_time_minutes && <span className="error">{errors.prep_time_minutes}</span>}
        </div>

        <div className="field checkbox">
          <label>
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

      <div className="field">
        <label>Foto (opcional)</label>
        <input type="file" accept="image/*" name="photo" onChange={onChange} />
        {preview && (
          <div className="preview">
            <img src={preview} alt="preview" />
          </div>
        )}
      </div>

      <button className="btn" disabled={submitting}>
        {submitting ? "Guardando..." : "Guardar comida"}
      </button>

      {serverMsg && <p className="server-msg">{serverMsg}</p>}
    </form>
  );
}
