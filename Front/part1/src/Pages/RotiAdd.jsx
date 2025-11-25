// src/superadmin/RotiAdd.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth"; // 👈 usamos el contexto de auth
import { NETWORK_ERROR_MESSAGE } from "../config/messages";
import { API_BASE_URL } from "../config/apiConfig";
import styles from "./RotiAdd.module.css";

const dayLabels = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// Genera disponibilidad inicial
const createInitialAvailability = () =>
  Array.from({ length: 7 }, (_, i) => ({
    day: i,
    active: false,
    allDay: true,
    availabilityHours: [
      {
        init: "08:00",
        end: "23:00",
      },
    ],
  }));

export default function RotiAdd() {
  const nav = useNavigate();
  const { user, getAuthToken } = useAuth(); // { email, role, userId, token }

  // --- estados básicos ---
  const [basic, setBasic] = useState({
    name: "",
    address: "",
    telephone: "",
    description: "",
  });

  const [imagesUrl, setImagesUrl] = useState([]);
  const [imageInput, setImageInput] = useState("");

  const [availability, setAvailability] = useState(createInitialAvailability());

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // ----------------- handlers datos básicos -----------------
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasic((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------- imágenes -----------------
  // Agregar imagen desde archivo (base64)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setImagesUrl((prev) => [...prev, base64]);
    };
    reader.readAsDataURL(file);
  };

  // Agregar imagen desde URL
  const handleAddImageByUrl = () => {
    const url = imageInput.trim();
    if (!url) return;
    setImagesUrl((prev) => [...prev, url]);
    setImageInput("");
  };

  const handleRemoveImage = (index) => {
    setImagesUrl((prev) => prev.filter((_, i) => i !== index));
  };

  // ----------------- disponibilidad -----------------
  const toggleDayActive = (index) => {
    setAvailability((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, active: !d.active } : d
      )
    );
  };

  const toggleAllDay = (index) => {
    setAvailability((prev) =>
      prev.map((d, i) =>
        i === index
          ? {
              ...d,
              allDay: !d.allDay,
            }
          : d
      )
    );
  };

  const handleHourChange = (indexDay, field, value) => {
    setAvailability((prev) =>
      prev.map((d, i) => {
        if (i !== indexDay) return d;
        const hours = [...d.availabilityHours];
        hours[0] = { ...hours[0], [field]: value };
        return { ...d, availabilityHours: hours };
      })
    );
  };

  // ----------------- submit POST -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    // Seguridad extra del lado front
    if (!user || user.role !== "SuperAdmin") {
      setErr("No tenés permisos para crear rotiserías.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setErr("Sesión no válida. Volvé a iniciar sesión.");
      return;
    }

    setLoading(true);

    const payload = {
      name: basic.name,
      address: basic.address,
      telephone: basic.telephone,
      imagesUrl,
      description: basic.description,
      availability: {
        availabilityOnTheDays: availability
          .filter((d) => d.active)
          .map((d) => ({
            day: d.day,
            active: true,
            allDay: d.allDay,
            availabilityHours: d.allDay ? [] : d.availabilityHours,
          })),
      },
    };

    try {
      const url = `${API_BASE_URL}/api/v1/restaurants`;

      console.log("POST →", url);
      console.log("JWT (primeros 40 chars) →", token.slice(0, 40) + "...");

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 ahora siempre viene del contexto
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }

      setOkMsg("Rotisería creada correctamente ✅");

      // limpiar form
      setBasic({
        name: "",
        address: "",
        telephone: "",
        description: "",
      });
      setImagesUrl([]);
      setImageInput("");
      setAvailability(createInitialAvailability());
    } catch (error) {
      console.error(error);
      const message =
        error?.message && error.message !== "Failed to fetch"
          ? error.message
          : NETWORK_ERROR_MESSAGE;
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  // Si no está logueado o no es SuperAdmin, mostramos un mensaje simple
  if (!user || user.role !== "SuperAdmin") {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Acceso restringido</h1>
          <p className={styles.subtitle}>
            No tenés permisos para crear rotiserías. Iniciá sesión con una cuenta SuperAdmin.
          </p>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => nav("/login")}
          >
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  // ----------------- RENDER -----------------
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Nueva Rotisería</h1>
        <p className={styles.subtitle}>Cargá la información básica</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ================= DATOS BÁSICOS ================= */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Datos generales</h2>

            <label className={styles.label}>
              Nombre
              <input
                type="text"
                name="name"
                value={basic.name}
                onChange={handleBasicChange}
                className={styles.input}
                required
              />
            </label>

            <label className={styles.label}>
              Dirección
              <input
                type="text"
                name="address"
                value={basic.address}
                onChange={handleBasicChange}
                className={styles.input}
                required
              />
            </label>

            <label className={styles.label}>
              Teléfono
              <input
                type="text"
                name="telephone"
                value={basic.telephone}
                onChange={handleBasicChange}
                className={styles.input}
                required
              />
            </label>

            <label className={styles.label}>
              Descripción
              <textarea
                name="description"
                value={basic.description}
                onChange={handleBasicChange}
                className={styles.textarea}
                rows={3}
              />
            </label>
          </div>

          {/* ================= IMÁGENES ================= */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Imágenes</h2>

            {/* Archivo */}
            <div className={styles.imageRow}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className={styles.input}
              />
            </div>

            {/* URL manual */}
            <div className={styles.imageRow} style={{ marginTop: "0.6rem" }}>
              <input
                type="text"
                placeholder="Pegar URL de imagen..."
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className={styles.input}
              />
              <button
                type="button"
                onClick={handleAddImageByUrl}
                className={styles.secondaryBtn}
              >
                Agregar
              </button>
            </div>

            {/* Preview */}
            {imagesUrl.length > 0 && (
              <ul className={styles.imageList}>
                {imagesUrl.map((url, i) => (
                  <li key={i} className={styles.imageItem}>
                    <img src={url} alt={`img-${i}`} className={styles.preview} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className={styles.deleteBtn}
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ================= DISPONIBILIDAD ================= */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Disponibilidad</h2>

            <div className={styles.daysGrid}>
              {availability.map((dayCfg, index) => (
                <div key={dayCfg.day} className={styles.dayCard}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={dayCfg.active}
                      onChange={() => toggleDayActive(index)}
                    />
                    {dayLabels[index]}
                  </label>

                  {dayCfg.active && (
                    <>
                      <label className={styles.checkboxLabelSmall}>
                        <input
                          type="checkbox"
                          checked={dayCfg.allDay}
                          onChange={() => toggleAllDay(index)}
                        />
                        24 hs
                      </label>

                      {!dayCfg.allDay && (
                        <div className={styles.hoursRow}>
                          <div>
                            <span className={styles.smallLabel}>Desde</span>
                            <input
                              type="time"
                              value={dayCfg.availabilityHours[0].init}
                              onChange={(e) =>
                                handleHourChange(
                                  index,
                                  "init",
                                  e.target.value
                                )
                              }
                              className={styles.inputTime}
                            />
                          </div>

                          <div>
                            <span className={styles.smallLabel}>Hasta</span>
                            <input
                              type="time"
                              value={dayCfg.availabilityHours[0].end}
                              onChange={(e) =>
                                handleHourChange(
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                              className={styles.inputTime}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= MENSAJES + BOTONES ================= */}
          {err && <p className={styles.error}>{err}</p>}
          {okMsg && <p className={styles.success}>{okMsg}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => nav(-1)}
              disabled={loading}
            >
              Volver
            </button>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Crear Rotisería"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
