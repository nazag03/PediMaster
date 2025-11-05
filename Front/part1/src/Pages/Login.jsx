import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import styles from "./Login.module.css";

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from || "/admin/foods";

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ user: "", pass: "" });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [sub, setSub] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((v) => ({ ...v, [name]: value }));
    setErr("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSub(true);
    setErr("");
    const fn = mode === "login" ? login : register;
    const res = await fn(form.user.trim(), form.pass);
    setSub(false);
    if (res.ok) nav(redirectTo, { replace: true });
    else setErr(res.error || "Error de autenticación");
  };

  const onGoogle = async () => {
    setSub(true);
    const res = await loginWithGoogle();
    setSub(false);
    if (res.ok) nav(redirectTo, { replace: true });
    else setErr(res.error || "No se pudo iniciar con Google");
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logo}>PM</div>
          <h1 className={styles.title}>PediMaster</h1>
        </header>

        <p className={styles.subtitle}>
          {mode === "login" ? "Ingresá a tu panel" : "Creá tu cuenta gratis"}
        </p>

        <button
          type="button"
          className={styles.googleBtn}
          onClick={onGoogle}
          disabled={sub}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
          {sub ? "Conectando..." : "Continuar con Google"}
        </button>

        <div className={styles.divider}><span>o con email</span></div>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Usuario</label>
            <input
              name="user"
              value={form.user}
              onChange={onChange}
              placeholder="Tu usuario"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Contraseña</label>
            <div className={styles.passField}>
              <input
                name="pass"
                type={showPass ? "text" : "password"}
                value={form.pass}
                onChange={onChange}
                placeholder="••••••"
                required
              />
              <button
                type="button"
                className={styles.showBtn}
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {err && <div className={styles.error}>{err}</div>}

          <button type="submit" disabled={sub} className={styles.btnPrimary}>
            {sub ? (mode === "login" ? "Ingresando..." : "Registrando...") : mode === "login" ? "Ingresar" : "Registrarme"}
          </button>

          <p className={styles.switch}>
            {mode === "login" ? (
              <>
                ¿No tenés cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={styles.link}
                >
                  Registrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tenés cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={styles.link}
                >
                  Iniciá sesión
                </button>
              </>
            )}
          </p>

          <p className={styles.note}>
            * Demo local: credenciales definidas en <code>.env.local</code>
          </p>
        </form>
      </div>
    </div>
  );
}
