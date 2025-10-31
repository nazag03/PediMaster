import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from || "/admin/foods";

  const [form, setForm] = useState({ user: "", pass: "" });
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
    const res = await login(form.user.trim(), form.pass);
    setSub(false);
    if (res.ok) nav(redirectTo, { replace: true });
    else setErr(res.error || "Error de login");
  };

  return (
    <div style={wrap}>
      <form onSubmit={onSubmit} style={card}>
        <h2 style={{ marginTop: 0 }}>Iniciar sesión (Admin)</h2>
        <div style={field}>
          <label>Usuario</label>
          <input
            name="user"
            value={form.user}
            onChange={onChange}
            placeholder="admin"
            style={input}
            autoFocus
          />
        </div>
        <div style={field}>
          <label>Contraseña</label>
          <input
            name="pass"
            type="password"
            value={form.pass}
            onChange={onChange}
            placeholder="••••••"
            style={input}
          />
        </div>
        {err && <div style={error}>{err}</div>}
        <button disabled={sub} style={btn}>
          {sub ? "Ingresando..." : "Ingresar"}
        </button>
        <p style={{ color:"#9ca3af", fontSize:12, marginTop:10 }}>
          * Demo local: credenciales definidas en <code>.env.local</code>
        </p>
      </form>
    </div>
  );
}

const wrap = { display:"grid", placeItems:"center", padding:"24px" };
const card = { width:"100%", maxWidth:420, border:"1px solid #1f2937", borderRadius:16, padding:18, background:"#0b1220" };
const field = { display:"flex", flexDirection:"column", gap:6, marginBottom:12 };
const input = { padding:"12px 14px", borderRadius:10, border:"1px solid #334155", background:"#0f172a", color:"#e5e7eb" };
const btn = { padding:"10px 14px", borderRadius:999, border:"1px solid #14532d", background:"#22c55e", color:"#052e16", fontWeight:800, width:"100%" };
const error = { background:"#3f1d1d", border:"1px solid #7f1d1d", color:"#fecaca", padding:"8px 10px", borderRadius:10, marginBottom:8 };
