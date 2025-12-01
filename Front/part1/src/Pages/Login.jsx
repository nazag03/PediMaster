import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import styles from "./Login.module.css";
import logo from "../assets/PedimasterLogo.png";
import { Eye, EyeOff } from "lucide-react";
import { NETWORK_ERROR_MESSAGE } from "../config/messages";

export default function Login() {
  const { login, register, handleGoogleCredential } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from;

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ email: "", pass: "", userName: "" });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [sub, setSub] = useState(false);

  useEffect(() => {
    setErr("");
    setSub(false);
  }, [mode]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((v) => ({ ...v, [name]: value }));
    setErr("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSub(true);
    setErr("");

    try {
      const email = form.email.trim();
      const password = form.pass;
      const userName = form.userName.trim();

      const res =
        mode === "login"
          ? await login(email, password)
          : await register(email, password, userName);

      setSub(false);

      if (res?.ok) {
        const roles = res.user?.roles ?? (res.user?.role ? [res.user.role] : []);
        const isAdmin = roles.includes("Admin") || roles.includes("SuperAdmin");
        const target = redirectTo ?? (isAdmin ? "/admin/foods" : "/app");

        nav(target, { replace: true });
        return;
      }

      setErr(
        res?.message ||
          (mode === "login"
            ? "Error de autenticación"
            : "No se pudo completar el registro")
      );
    } catch (error) {
      console.error("Error en login/register:", error);
      setErr(NETWORK_ERROR_MESSAGE);
      setSub(false);
    }
  };

  // GOOGLE LOGIN
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!window.google || !window.google.accounts || !clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (cred) => {
        try {
          const result = await handleGoogleCredential(cred);

          if (result?.ok) {
            const target =
              redirectTo ??
              (result.user?.role === "Admin" || result.user?.role === "SuperAdmin"
                ? "/admin/foods"
                : "/app");

            nav(target, { replace: true });
          } else {
            throw new Error(result?.message);
          }
        } catch (error) {
          console.error("Google login error:", error);
          setErr(error?.message || NETWORK_ERROR_MESSAGE);
        }
      },
    });

    const wrapper = document.getElementById("googleWrapper");
    if (wrapper && wrapper.childElementCount === 0) {
      window.google.accounts.id.renderButton(wrapper, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
      });
    }
  }, [handleGoogleCredential, nav, redirectTo]);

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.card} ${
          mode === "login" ? styles.cardLogin : styles.cardRegister
        }`}
      >
        <header className={styles.header}>
          <img src={logo} alt="PediMaster" className={styles.logo} />
          <h1 className={styles.title}>PediMaster</h1>
        </header>

        <p className={styles.subtitle}>
          {mode === "login" ? "Ingresá a tu panel" : "Creá tu cuenta gratis"}
        </p>

        {/* BOTÓN GOOGLE */}
        <div className={styles.googleBtnWrapper}>
          <div
            id="googleWrapper"
            className={`${styles.googleWrapper} ${
              mode === "login" ? styles.loginMode : styles.registerMode
            }`}
          ></div>
        </div>

        <div className={styles.divider}>
          <span>o con email</span>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          {mode === "register" && (
            <div className={styles.field}>
              <label>Nombre de usuario</label>
              <input
                name="userName"
                type="text"
                value={form.userName}
                onChange={onChange}
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="tucorreo@ejemplo.com"
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
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {err && <div className={styles.error}>{err}</div>}

          <button
            type="submit"
            disabled={sub}
            className={`${styles.btnPrimary} ${
              mode === "login"
                ? styles.btnPrimaryLogin
                : styles.btnPrimaryRegister
            }`}
          >
            {sub
              ? mode === "login"
                ? "Ingresando..."
                : "Registrando..."
              : mode === "login"
              ? "Ingresar"
              : "Registrarme"}
          </button>

          <p className={styles.switch}>
            {mode === "login" ? (
              <>
                ¿No tenés cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`${styles.link} ${styles.linkLogin}`}
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
                  className={`${styles.link} ${styles.linkRegister}`}
                >
                  Iniciá sesión
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
