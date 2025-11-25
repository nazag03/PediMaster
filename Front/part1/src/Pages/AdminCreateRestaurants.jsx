import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./AdminCreateRestaurants.module.css";
import { slugify } from "../config/restaurants";
import { useAuth } from "../auth/useAuth";
import { restaurantApi } from "../api/restaurantApi";
import { NETWORK_ERROR_MESSAGE } from "../config/messages";

const DEFAULT_FORM = {
  name: "",
  slug: "",
  description: "",
  phone: "",
  whatsapp: "",
  address: "",
  city: "",
  minOrder: 0,
  deliveryFee: 0,
  isOpen: true,
  acceptsCard: true,
  acceptsCash: true,
  tags: [],
  schedule: [
    { day: 0, label: "Lunes", hours: "" },
    { day: 1, label: "Martes", hours: "" },
    { day: 2, label: "Miércoles", hours: "" },
    { day: 3, label: "Jueves", hours: "" },
    { day: 4, label: "Viernes", hours: "" },
    { day: 5, label: "Sábado", hours: "" },
    { day: 6, label: "Domingo", hours: "" },
  ],
  logoFile: null,
  coverFile: null,
  logoDataUrl: "",
  coverDataUrl: "",
};

function normalizeTime(raw) {
  if (!raw) return null;
  let t = String(raw).trim().toLowerCase();
  if (!t) return null;
  t = t.replace(",", ":").replace(".", ":");
  if (/^\d{1,2}$/.test(t)) {
    const hh = t.padStart(2, "0");
    return `${hh}:00`;
  }
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(t);
  if (!match) return null;
  const hh = match[1].padStart(2, "0");
  const mm = match[2].padStart(2, "0");
  return `${hh}:${mm}`;
}

function parseDayHours(raw) {
  if (!raw) return { active: false, allDay: false, availabilityHours: [] };
  const text = raw.trim().toLowerCase();
  if (!text) return { active: false, allDay: false, availabilityHours: [] };

  if (["cerrado", "c", "x", "-"].includes(text)) {
    return { active: false, allDay: false, availabilityHours: [] };
  }

  if (
    text.includes("24h") ||
    text.includes("24 h") ||
    text.includes("todo el dia") ||
    text.includes("todo el día")
  ) {
    return {
      active: true,
      allDay: true,
      availabilityHours: [{ init: "00:00", end: "23:59" }],
    };
  }

  const parts = text.split(/[\/,;]+/);
  const availabilityHours = [];

  for (let part of parts) {
    if (!part) continue;
    let p = part.trim();
    if (!p) continue;
    p = p.replace(/–/g, "-").replace(/\sa\s/g, "-");
    const [startRaw, endRaw] = p.split("-");
    if (!endRaw) continue;
    const init = normalizeTime(startRaw);
    const end = normalizeTime(endRaw);
    if (init && end) availabilityHours.push({ init, end });
  }

  if (!availabilityHours.length) {
    return { active: false, allDay: false, availabilityHours: [] };
  }

  return { active: true, allDay: false, availabilityHours };
}

export default function AdminCreateRestaurant() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const { user, getAuthToken } = useAuth();

  useEffect(() => {
    if (!form.slug && form.name) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }));
    }
  }, [form.name, form.slug]);

  useEffect(() => {
    const draftRaw = localStorage.getItem("restaurant_draft");
    if (draftRaw) {
      try {
        setForm(JSON.parse(draftRaw));
      } catch (err) {
        console.warn("Error al leer borrador del localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("restaurant_draft", JSON.stringify(form));
  }, [form]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleScheduleChange(idx, value) {
    setForm((f) => {
      const schedule = [...f.schedule];
      schedule[idx] = { ...schedule[idx], hours: value };
      return { ...f, schedule };
    });
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (!t || form.tags.includes(t)) return;
    setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  }

  function removeTag(t) {
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));
  }

  async function handleFile(e, kind) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((err) => ({ ...err, [kind]: "El archivo debe ser una imagen" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({
        ...f,
        [`${kind}File`]: file,
        [`${kind}DataUrl`]: reader.result,
      }));
      setErrors((err) => ({ ...err, [kind]: null }));
    };
    reader.readAsDataURL(file);
  }

  function validateSync(next) {
    const e = {};
    if (!next.name.trim()) e.name = "El nombre es obligatorio";
    if (!next.slug.trim()) e.slug = "El slug es obligatorio";
    if (next.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(next.slug)) {
      e.slug = "Usá minúsculas, números y guiones (ej: rotiseria-don-sabor)";
    }
    if (!next.address.trim()) e.address = "La dirección es obligatoria";
    if (!next.city.trim()) e.city = "La ciudad es obligatoria";
    if (!next.phone.trim()) e.phone = "El teléfono es obligatorio";
    if (!next.description.trim() || next.description.trim().length < 10) {
      e.description = "La descripción debe tener al menos 10 caracteres";
    }
    if (Number(next.minOrder) < 0) e.minOrder = "No puede ser negativo";
    if (Number(next.deliveryFee) < 0) e.deliveryFee = "No puede ser negativo";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setServerSuccess("");

    const baseErrors = validateSync(form);
    setErrors(baseErrors);
    if (Object.keys(baseErrors).length) return;

    if (!user?.userId) {
      setServerError("No se encontró el usuario autenticado.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setServerError("Sesión expirada. Iniciá sesión nuevamente.");
      return;
    }

    setSaving(true);
    try {
      const availabilityOnTheDays = form.schedule.map((d) => {
        const parsed = parseDayHours(d.hours);
        return {
          day: (d.day + 1) % 7,
          active: parsed.active,
          allDay: parsed.allDay,
          availabilityHours: parsed.availabilityHours,
        };
      });

      const paymentMethod = [];
      if (form.acceptsCash) paymentMethod.push(0);
      if (form.acceptsCard) paymentMethod.push(1);

      const images = [];
      if (form.coverDataUrl) images.push(form.coverDataUrl);

      const payload = {
        userId: Number(user.userId),
        name: form.name.trim(),
        address: `${form.address.trim()}${
          form.city ? `, ${form.city.trim()}` : ""
        }`,
        telephone: form.phone.trim(),
        description: form.description.trim(),
        logoUrl: form.logoDataUrl || "",
        images,
        tags: form.tags,
        minOrder: Number(form.minOrder) || 0,
        deliveryCost: Number(form.deliveryFee) || 0,
        whatsappNumber: form.whatsapp.trim(),
        slug: form.slug.trim(),
        paymentMethod,
        availability: { availabilityOnTheDays },
      };

      await restaurantApi.create(payload, token);

      localStorage.removeItem("restaurant_draft");
      setServerSuccess("✅ Restaurante creado correctamente");
      setForm(DEFAULT_FORM);
      if (logoInputRef.current) logoInputRef.current.value = "";
      if (coverInputRef.current) coverInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      const message =
        err?.message === "Failed to fetch"
          ? NETWORK_ERROR_MESSAGE
          : err?.message;
      setServerError(
        message || "Ocurrió un error guardando el restaurante."
      );
    } finally {
      setSaving(false);
    }
  }

  const slugHint = useMemo(() => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://mi-resto.com";
    return form.slug ? `${baseUrl}/r/${form.slug}` : `${baseUrl}/r/mi-resto`;
  }, [form.slug]);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Nuevo restaurante</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label>Nombre *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Rotisería Don Sabor"
            />
            {errors.name && <span className={styles.err}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label>Slug *</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="rotiseria-don-sabor"
            />
            <small className={styles.hint}>URL: {slugHint}</small>
            {errors.slug && <span className={styles.err}>{errors.slug}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Comida casera, minutas y pastas. Envíos a toda la ciudad."
            rows={3}
          />
          {errors.description && (
            <span className={styles.err}>{errors.description}</span>
          )}
        </div>

        <div className={styles.row3}>
          <div className={styles.field}>
            <label>Teléfono</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="3564-..."
            />
            {errors.phone && (
              <span className={styles.err}>{errors.phone}</span>
            )}
          </div>
          <div className={styles.field}>
            <label>WhatsApp</label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="5493564..."
            />
          </div>
          <div className={styles.field}>
            <label>Ciudad *</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="San Francisco, Córdoba"
            />
            {errors.city && <span className={styles.err}>{errors.city}</span>}
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label>Dirección *</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Av. Siempre Viva 742"
            />
            {errors.address && (
              <span className={styles.err}>{errors.address}</span>
            )}
          </div>
          <div className={styles.fieldInline}>
            <div>
              <label>Mínimo de pedido</label>
              <input
                type="number"
                name="minOrder"
                value={form.minOrder}
                onChange={handleChange}
              />
              {errors.minOrder && (
                <span className={styles.err}>{errors.minOrder}</span>
              )}
            </div>
            <div>
              <label>Costo de envío</label>
              <input
                type="number"
                name="deliveryFee"
                value={form.deliveryFee}
                onChange={handleChange}
              />
              {errors.deliveryFee && (
                <span className={styles.err}>{errors.deliveryFee}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.row3}>
          <label className={styles.check}>
            <input
              type="checkbox"
              name="isOpen"
              checked={form.isOpen}
              onChange={handleChange}
            />
            Abierto
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              name="acceptsCard"
              checked={form.acceptsCard}
              onChange={handleChange}
            />
            Acepta tarjeta
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              name="acceptsCash"
              checked={form.acceptsCash}
              onChange={handleChange}
            />
            Acepta efectivo
          </label>
        </div>

        <div className={styles.field}>
          <label>Etiquetas (tags)</label>
          <div className={styles.tagsRow}>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="minutas, pastas, vegano..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={addTag}
            >
              Agregar
            </button>
          </div>
          <div className={styles.tagsList}>
            {form.tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t}{" "}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  aria-label={`Quitar ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <fieldset className={styles.fieldset}>
          <legend>Horarios</legend>
          <div className={styles.scheduleGrid}>
            {form.schedule.map((d, idx) => (
              <div key={d.day} className={styles.scheduleRow}>
                <label>{d.label}</label>
                <input
                  value={d.hours}
                  placeholder="11-15 / 20-23, 24h, cerrado"
                  onChange={(e) => handleScheduleChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </fieldset>

        {serverError && <p className={styles.err}>{serverError}</p>}
        {serverSuccess && (
          <p className={styles.success}>{serverSuccess}</p>
        )}

        <div className={styles.row2}>
          <div className={styles.field}>
            <label>Logo</label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e, "logo")}
            />
            {errors.logo && (
              <span className={styles.err}>{errors.logo}</span>
            )}
            {form.logoDataUrl && (
              <img
                className={styles.logoPreview}
                src={form.logoDataUrl}
                alt="Logo preview"
              />
            )}
          </div>

          <div className={styles.field}>
            <label>Portada</label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e, "cover")}
            />
            {errors.cover && (
              <span className={styles.err}>{errors.cover}</span>
            )}
            {form.coverDataUrl && (
              <img
                className={styles.coverPreview}
                src={form.coverDataUrl}
                alt="Cover preview"
              />
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Crear restaurante"}
          </button>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => {
              localStorage.removeItem("restaurant_draft");
              setForm(DEFAULT_FORM);
            }}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
