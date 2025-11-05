// Persistencia temporal en localStorage (simula un backend)
const LS_KEY = "restaurants_db_v1";

function readAll() {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function writeAll(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

// 👉 LUEGO: reemplazás estas funciones por fetch a tu backend
export async function createRestaurant(payload) {
  const list = readAll();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const item = { id, created_at: now, updated_at: now, ...payload };
  list.push(item);
  writeAll(list);
  return item;
}

export async function listRestaurants() {
  return readAll();
}

export async function getRestaurantBySlug(slug) {
  return readAll().find(r => r.slug === slug) || null;
}

export async function slugExists(slug) {
  return !!readAll().find(r => r.slug === slug);
}

export function slugify(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"");
}
