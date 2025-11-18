import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import styles from "./Login.module.css";
import logo from "../assets/PedimasterLogo.png";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, handleGoogleCredential } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from || "/admin/foods";

  const [mode, setMode] = useState("login"); // "login" | "register"
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

    // por ahora siempre login clásico
    const res = await login(form.user.trim(), form.pass);
    setSub(false);

    if (res.ok) {
      nav(redirectTo, { replace: true });
    } else {
      setErr(res.error || "Error de autenticación");
    }
  };

  // Inicializar Google y renderizar el botón una vez que la lib está lista
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log("CLIENT ID FRONT:", clientId);
    console.log("ORIGIN FRONT:", window.location.origin);

    if (!window.google || !window.google.accounts || !clientId) {
      console.log("⚠️ Google no está listo o falta clientId");
      return;
    }

    // inicializamos con callback que, cuando termine, redirige
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (cred) => {
        await handleGoogleCredential(cred);
        nav(redirectTo, { replace: true });
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
          <div className={styles.field}>
            <label>Email</label>
            <input
              name="user"
              type="email"
              value={form.user}
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
              mode === "login" ? styles.btnPrimaryLogin : styles.btnPrimaryRegister
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
