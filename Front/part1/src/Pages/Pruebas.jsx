import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Prueba.module.css";
import { auth } from "../auth/auth";

export default function Login() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const emailRef = useRef(null);
  const pwdRef = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  useEffect(() => {
    const u = auth.getUser();
    if (u) navigate("/", { replace: true });
  }, [navigate]);

  const canSubmit = useMemo(() => {
    return (
      /^\S+@\S+\.\S+$/.test(form.email) &&
      form.password.length >= 6 &&
      !loading
    );
  }, [form.email, form.password, loading]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function onKeyUp(e) {
    if (e.getModifierState) setCapsOn(e.getModifierState("CapsLock"));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      const next = search.get("next") || "/";
      await auth.login(form.email.trim(), form.password, { remember: form.remember });
      navigate(next, { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Entrar</h1>
          <p className={styles.subtitle}>Accedé para hacer pedidos o gestionar tu local</p>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input
            ref={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="tu@mail.com"
            required
          />

          <div className={styles.pwdRow}>
            <div className={styles.pwdCol}>
              <label className={styles.label}>Contraseña</label>
              <input
                ref={pwdRef}
                name="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                onKeyUp={onKeyUp}
                className={styles.input}
                placeholder="mínimo 6 caracteres"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className={styles.togglePwd}
            >
              {showPwd ? "🙈" : "👁️"}
            </button>
          </div>

          {capsOn && <div className={styles.hint}>Bloq Mayús activado</div>}

          <label className={styles.remember}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            Mantener sesión iniciada
          </label>

          <button type="submit" className={styles.submit} disabled={!canSubmit}>
            {loading ? "Ingresando…" : "Ingresar"}
          </button>

          <div className={styles.linksRow}>
            <button type="button" className={styles.linkBtn}>¿Olvidaste tu contraseña?</button>
            <button type="button" className={styles.linkBtn} onClick={() => navigate("/register")}>
              Crear cuenta
            </button>
          </div>
        </form>

        {import.meta.env.MODE !== "production" && (
          <DevShortcuts onPick={async (role) => {
            setLoading(true);
            setError("");
            try {
              await auth.devLoginAs(role, { remember: true });
              navigate("/", { replace: true });
            } catch (e) {
              setError(e.message);
            } finally {
              setLoading(false);
            }
          }} />
        )}
      </div>
    </div>
  );
}

function DevShortcuts({ onPick }) {
  return (
    <div className={styles.devBox}>
      <p className={styles.devTitle}>Atajos (dev):</p>
      <div className={styles.roles}>
        {[
          ["CLIENTE", "Cliente"],
          ["REPARTIDOR", "Repartidor"],
          ["DUENO", "Dueño"],
          ["SUPERADMIN", "SuperAdmin"],
        ].map(([val, label]) => (
          <button key={val} className={styles.roleBtn} onClick={() => onPick(val)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
