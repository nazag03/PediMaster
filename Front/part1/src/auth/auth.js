const STORAGE_KEY = "app.auth";
const TOKEN_TTL_MIN = 24 * 60;

function now() { return Date.now(); }
function minutes(ms) { return ms * 60 * 1000; }

function saveSession({ token, user, remember }) {
  const payload = { token, user, exp: now() + minutes(TOKEN_TTL_MIN) };
  const target = remember ? localStorage : sessionStorage;
  target.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function readSession() {
  const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data.exp && data.exp < now()) { clear(); return null; }
    return data;
  } catch {
    clear();
    return null;
  }
}

function clear() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

export const auth = {
  async login(email, password, { remember } = { remember: true }) {
    if (!/\S+@\S+\.\S+/.test(email)) throw new Error("Email inválido");
    if (password.length < 6) throw new Error("Contraseña muy corta");

    const role = inferRoleByEmail(email);
    await new Promise((r) => setTimeout(r, 600));

    const token = `dev.${btoa(email)}.${Math.random().toString(36).slice(2)}`;
    const user = { id: crypto.randomUUID(), email, role, restIds: role === "DUENO" ? ["rest-demo"] : [] };
    saveSession({ token, user, remember });
    return user;
  },

  async devLoginAs(role = "CLIENTE", { remember } = { remember: true }) {
    await new Promise((r) => setTimeout(r, 200));
    const email = `${role.toLowerCase()}@demo.local`;
    const token = `dev.${role}.${Math.random().toString(36).slice(2)}`;
    const user = { id: crypto.randomUUID(), email, role, restIds: role === "DUENO" ? ["rest-demo"] : [] };
    saveSession({ token, user, remember });
    return user;
  },

  getUser() {
    return readSession()?.user || null;
  },

  getToken() {
    return readSession()?.token || null;
  },

  async verify() {
    await new Promise((r) => setTimeout(r, 200));
    const data = readSession();
    if (!data) throw new Error("No autenticado");
    return data.user;
  },

  logout() { clear(); },
};

function inferRoleByEmail(email) {
  const e = email.toLowerCase();
  if (e.includes("admin")) return "SUPERADMIN";
  if (e.includes("owner") || e.includes("dueno") || e.includes("dueño")) return "DUENO";
  if (e.includes("delivery") || e.includes("repart")) return "REPARTIDOR";
  return "CLIENTE";
}
