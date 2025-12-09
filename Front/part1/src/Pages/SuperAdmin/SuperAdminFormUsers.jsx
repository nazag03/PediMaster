// src/pages/superadmin/SuperAdminCreateUser.jsx
import { useState } from "react";
import styles from "./SuperAdminFormUsers.module.css";
import { userApi } from "../../api/userApi";

const initialForm = {
  userName: "",
  email: "",
  password: "",
  role: "1", // Admin por defecto
};

export default function SuperAdminCreateUser() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setOk("");

    try {
      const payload = {
        userName: form.userName, // ✔️ ahora se usa este
        email: form.email,
        password: form.password,
        role: Number(form.role),
      };

      await userApi.create(payload);
      setOk("Usuario creado con éxito.");
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      setErr(error?.message || "Error al crear usuario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear usuario</h1>

      {err && <div className={styles.error}>{err}</div>}
      {ok && <div className={styles.success}>{ok}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Nombre de usuario
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Rol
          <select name="role" value={form.role} onChange={onChange}>
            <option value="0">SuperAdmin</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
          </select>
        </label>

        <button disabled={saving} className={styles.saveBtn}>
          {saving ? "Guardando..." : "Crear usuario"}
        </button>
      </form>
    </div>
  );
}
