// src/pages/AdminCreateRestaurant.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantApi } from "../../api/restaurantApi";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../auth/useAuth";
import styles from "./AdminCreateRestaurant.module.css";

export default function AdminCreateRestaurant() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    telephone: "",
    description: "",
    logoUrl: "",
    images: "",
    whatsappNumber: "",
    slug: "",
    ownerId: "", // dueño del restaurante → se manda como userId
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // TAGS
  const [availableTags, setAvailableTags] = useState([
    // Estos idealmente vendrían de un endpoint global de settings
    "pizza",
    "empanadas",
    "veganos",
    "hamburguesas",
    "pastas",
    "pollos",
  ]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar usuarios para poder elegir dueño
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoadingUsers(true);
        const res = await userApi.getAllUsers();
        setUsers(res || []);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setErr("No se pudieron cargar los usuarios para asignar dueño.");
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // TAGS: seleccionar de los existentes
  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  }

  // TAGS: agregar uno nuevo escribiendo
  function handleAddTag(e) {
    e.preventDefault();
    const newTag = tagInput.trim();
    if (!newTag) return;

    setAvailableTags((prev) =>
      prev.includes(newTag) ? prev : [...prev, newTag]
    );
    setSelectedTags((prev) =>
      prev.includes(newTag) ? prev : [...prev, newTag]
    );
    setTagInput("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (!user) {
      setErr("No hay usuario logueado.");
      return;
    }

    if (!form.name.trim()) {
      setErr("El nombre es obligatorio.");
      return;
    }

    if (!form.address.trim()) {
      setErr("La dirección es obligatoria.");
      return;
    }

    if (!form.ownerId) {
      setErr("Tenés que seleccionar un dueño para el restaurante.");
      return;
    }

    const userId = Number(form.ownerId); // dueño elegido

    const payload = {
      userId, // dueño del restaurante
      name: form.name.trim(),
      address: form.address.trim(),
      telephone: form.telephone.trim(),
      description: form.description.trim(),
      logoUrl: form.logoUrl.trim() || null,
      images: form.images
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      tags: selectedTags,
      // minOrder lo sacamos
      deliveryCost: 0, // si tu backend lo requiere, poné 0 o ajustalo luego
      whatsappNumber: form.whatsappNumber.trim(),
      slug: form.slug.trim(), // ahora se manda tal cual
      // paymentMethod lo sacamos
      availability: {
        // por ahora vacío, después lo podés configurar con otro form
        availabilityOnTheDays: [],
      },
    };

    try {
      setLoading(true);
      await restaurantApi.create(payload);
      setSuccess("Restaurante creado correctamente 🎉");
      navigate("/admin/restaurants");
    } catch (error) {
      console.error(error);
      setErr("No se pudo crear el restaurante. Revisá los datos o el log.");
    } finally {
      setLoading(false);
    }
  }

  function getUserLabel(u) {
    const name = u.userName || u.name || "";
    const email = u.email || u.userEmail || "";
    if (name && email) return `${name} (${email})`;
    return name || email || `Usuario #${u.userId ?? u.id}`;
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Crear restaurante</h1>

      {err && <p className={styles.error}>{err}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="name">Nombre *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="address">Dirección *</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="telephone">Teléfono</label>
            <input
              id="telephone"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="whatsappNumber">WhatsApp</label>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              value={form.whatsappNumber}
              onChange={handleChange}
              placeholder="+54 9 ..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="logoUrl">Logo (URL)</label>
            <input
              id="logoUrl"
              name="logoUrl"
              value={form.logoUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="slug">
              Slug 
            </label>
            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="ej. don-pepe"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="ownerId">Dueño del restaurante *</label>
            <select
              id="ownerId"
              name="ownerId"
              value={form.ownerId}
              onChange={handleChange}
              disabled={loadingUsers}
            >
              <option value="">-- Seleccionar dueño --</option>
              {users.map((u) => {
                const id = u.userId ?? u.id;
                return (
                  <option key={id} value={id}>
                    {getUserLabel(u)}
                  </option>
                );
              })}
            </select>
            {loadingUsers && (
              <small className={styles.help}>
                Cargando usuarios...
              </small>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="images">
            Imágenes (URLs separadas por coma)
          </label>
          <textarea
            id="images"
            name="images"
            rows={2}
            value={form.images}
            onChange={handleChange}
            placeholder="https://img1.jpg, https://img2.jpg"
          />
        </div>

        {/* TAGS */}
        <div className={styles.field}>
          <label>Tags del restaurante</label>
          <div className={styles.tagsContainer}>
            <div className={styles.tagsList}>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={
                    selectedTags.includes(tag)
                      ? styles.tagSelected
                      : styles.tag
                  }
                >
                  {tag}
                </button>
              ))}
            </div>

            <form className={styles.tagInputRow} onSubmit={handleAddTag}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Nuevo tag (ej: sin TACC)"
              />
              <button type="submit" className={styles.smallButton}>
                Añadir tag
              </button>
            </form>

            <small className={styles.help}>
              Podés elegir tags existentes o crear otros nuevos.
            </small>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.primary} disabled={loading}>
            {loading ? "Creando..." : "Crear restaurante"}
          </button>
        </div>
      </form>
    </section>
  );
}
