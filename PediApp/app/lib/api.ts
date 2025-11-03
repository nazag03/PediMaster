import { Food } from "../src/typescript";

let FOODS: Food[] = [
  { id: 1, name: "Milanesa napolitana",description: "Milanesa al estilo tradicional napolitano", price: 6500, is_available: true, image: "https://picsum.photos/seed/napo/600/400" },
  { id: 2, name: "Pollo al horno",description: "Pollo con verduras al horno" ,price: 7200, is_available: true, image: "https://picsum.photos/seed/pollo/600/400" },
  { id: 3, name: "Ensalada César",description: "La mas autentica ensalada cesar", price: 5400, is_available: true, image: "https://picsum.photos/seed/cesar/600/400" },
];

export async function fetchFoods(): Promise<Food[]> {
  await new Promise(r => setTimeout(r, 400));
  return FOODS;
}

import type { Rotiseria, MenuCategory, MenuItem } from "../src/types";

// ---- helpers de mock / simulación de red -----------------------------------
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

let _autoIncItem = 1000;
const newId = () => _autoIncItem++;

// ---- DATA: Rotiserías de San Francisco (Córdoba) ----------------------------
const ROTISERIAS: Rotiseria[] = [
  {
    id: 1,
    slug: "rotiseria-don-sabor",
    name: "Rotisería Don Sabor",
    phone: "3564 651874",
    whatsapp: "5493564651874",
    address: { street: "Av. del Libertador 1234", city: "San Francisco", province: "Córdoba", lat: -31.427, lng: -62.084 },
    logoUrl: "https://placehold.co/200x200/ff4500/ffffff?text=Don+Sabor",
    coverUrl: "https://picsum.photos/seed/donsabor/1200/600",
    schedule: [
      { days: "Lun a Vie", hours: "11:30–15:00 / 20:00–23:00" },
      { days: "Sáb", hours: "11:30–15:30 / 20:00–23:30" },
      { days: "Dom", hours: "11:30–15:30" },
    ],
    rating: 4.6,
    tags: ["milanesas", "pastas", "delivery"],
  },
  {
    id: 2,
    slug: "la-nonna",
    name: "La Nonna Pastas & Más",
    phone: "3564 442233",
    whatsapp: "5493564442233",
    address: { street: "Bv. 25 de Mayo 450", city: "San Francisco", province: "Córdoba", lat: -31.4275, lng: -62.087 },
    logoUrl: "https://placehold.co/200x200/ff7a00/ffffff?text=La+Nonna",
    coverUrl: "https://picsum.photos/seed/lanonna/1200/600",
    schedule: [
      { days: "Lun a Sáb", hours: "11:30–15:00 / 20:00–23:00" },
      { days: "Dom", hours: "11:30–14:30", closed: false },
    ],
    rating: 4.8,
    tags: ["pastas", "salsas", "casero"],
  },
  {
    id: 3,
    slug: "el-buen-sabor",
    name: "El Buen Sabor",
    phone: "3564 555111",
    whatsapp: "5493564555111",
    address: { street: "San Martín 789", city: "San Francisco", province: "Córdoba", lat: -31.43, lng: -62.09 },
    logoUrl: "https://placehold.co/200x200/f97316/ffffff?text=Buen+Sabor",
    coverUrl: "https://picsum.photos/seed/buensabor/1200/600",
    schedule: [
      { days: "Mar a Dom", hours: "12:00–15:00 / 20:30–23:30" },
      { days: "Lun", hours: "-", closed: true },
    ],
    rating: 4.3,
    tags: ["empanadas", "pizzas"],
  },
  {
    id: 4,
    slug: "sabores-de-barrio",
    name: "Sabores de Barrio",
    phone: "3564 778899",
    whatsapp: "5493564778899",
    address: { street: "Bv. 9 de Julio 1020", city: "San Francisco", province: "Córdoba", lat: -31.425, lng: -62.08 },
    logoUrl: "https://placehold.co/200x200/ff6a00/ffffff?text=Sabores",
    coverUrl: "https://picsum.photos/seed/sabores/1200/600",
    schedule: [
      { days: "Lun a Vie", hours: "12:00–15:00 / 20:00–23:00" },
      { days: "Sáb y Dom", hours: "12:30–15:30 / 20:00–00:00" },
    ],
    rating: 4.1,
    tags: ["parrilla", "lomitos", "minutas"],
  },
];

// ---- DATA: Menús por rotisería ----------------------------------------------
const MENUS: Record<number, MenuCategory[]> = {
  1: [
    {
      id: 1,
      name: "Platos del día",
      items: [
        { id: newId(), name: "Milanesa napolitana con fritas", price: 6900, is_available: true, prep_time_minutes: 15, image: "https://picsum.photos/seed/napo/800/500", tags: ["popular"] },
        { id: newId(), name: "Pollo al horno con papas",      price: 7200, is_available: true, prep_time_minutes: 35, image: "https://picsum.photos/seed/pollo/800/500" },
        { id: newId(), name: "Tarta de verdura + ensalada",    price: 5600, is_available: true, prep_time_minutes: 12, image: "https://picsum.photos/seed/tarta/800/500", tags: ["vegetariano"] },
      ],
    },
    {
      id: 2,
      name: "Guarniciones",
      items: [
        { id: newId(), name: "Puré de papas",      price: 2200, is_available: true, image: "https://picsum.photos/seed/pure/800/500" },
        { id: newId(), name: "Arroz blanco",       price: 1900, is_available: true },
        { id: newId(), name: "Ensalada mixta",     price: 2100, is_available: true },
        { id: newId(), name: "Papas rústicas",     price: 2600, is_available: true },
      ],
    },
    {
      id: 3,
      name: "Bebidas",
      items: [
        { id: newId(), name: "Agua 500ml",   price: 1200, is_available: true },
        { id: newId(), name: "Gaseosa 500ml",price: 1600, is_available: true },
        { id: newId(), name: "Cerveza lata", price: 2200, is_available: true, tags: ["alcohol"] },
      ],
    },
  ],
  2: [
    {
      id: 4,
      name: "Pastas",
      items: [
        { id: newId(), name: "Sorrentinos (8u) + salsa", price: 8200, is_available: true, image: "https://picsum.photos/seed/sorrentinos/800/500" },
        { id: newId(), name: "Ravioles verdura (12u)",   price: 7600, is_available: true, image: "https://picsum.photos/seed/ravioles/800/500", tags: ["vegetariano"] },
        { id: newId(), name: "Ñoquis caseros",           price: 6900, is_available: true, image: "https://picsum.photos/seed/noquis/800/500" },
      ],
    },
    {
      id: 5,
      name: "Salsas",
      items: [
        { id: newId(), name: "Boloñesa",     price: 2200, is_available: true },
        { id: newId(), name: "Fileto",       price: 1800, is_available: true, tags: ["vegano"] },
        { id: newId(), name: "4 quesos",     price: 2600, is_available: true },
      ],
    },
  ],
  3: [
    {
      id: 6,
      name: "Empanadas",
      items: [
        { id: newId(), name: "Carne suave (x6)",  price: 5200, is_available: true },
        { id: newId(), name: "Jamón y queso (x6)",price: 5200, is_available: true },
        { id: newId(), name: "Capresse (x6)",     price: 5400, is_available: true, tags: ["vegetariano"] },
      ],
    },
    {
      id: 7,
      name: "Pizzas",
      items: [
        { id: newId(), name: "Muzzarella",    price: 5200, is_available: true },
        { id: newId(), name: "Napolitana",    price: 5900, is_available: true },
        { id: newId(), name: "Fugazzetta",    price: 6100, is_available: true },
      ],
    },
  ],
  4: [
    {
      id: 8,
      name: "Parrilla",
      items: [
        { id: newId(), name: "Asado porción",   price: 7800, is_available: true },
        { id: newId(), name: "Chorizo + Pan",   price: 2600, is_available: true },
        { id: newId(), name: "Pollo deshuesado",price: 7200, is_available: true },
      ],
    },
    {
      id: 9,
      name: "Minutas",
      items: [
        { id: newId(), name: "Lomito completo",     price: 6900, is_available: true },
        { id: newId(), name: "Hamburguesa doble",   price: 6400, is_available: true },
        { id: newId(), name: "Tostado jamón y queso",price: 3200, is_available: true },
      ],
    },
  ],
};

// ---- API: Rotiserías --------------------------------------------------------
export async function listRotiserias(params?: {
  q?: string;         // busca por nombre/etiquetas/calle
  tag?: string;       // "pastas", "parrilla", etc.
}): Promise<Rotiseria[]> {
  await sleep(250);
  const { q, tag } = params ?? {};
  let data = [...ROTISERIAS];

  if (q && q.trim()) {
    const t = q.toLowerCase();
    data = data.filter(r =>
      r.name.toLowerCase().includes(t) ||
      r.address.street.toLowerCase().includes(t) ||
      (r.tags ?? []).some(x => x.toLowerCase().includes(t))
    );
  }
  if (tag) {
    data = data.filter(r => (r.tags ?? []).includes(tag));
  }
  // orden simple por rating desc
  return data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

export async function getRotiseriaById(id: number): Promise<Rotiseria | null> {
  await sleep(180);
  return ROTISERIAS.find(r => r.id === id) ?? null;
}

export async function getRotiseriaBySlug(slug: string): Promise<Rotiseria | null> {
  await sleep(180);
  return ROTISERIAS.find(r => r.slug === slug) ?? null;
}

// ---- API: Menús -------------------------------------------------------------
export async function getMenu(rotiseriaId: number): Promise<MenuCategory[]> {
  await sleep(300);
  return MENUS[rotiseriaId] ? JSON.parse(JSON.stringify(MENUS[rotiseriaId])) : [];
}

export async function listAllItems(rotiseriaId: number): Promise<MenuItem[]> {
  const cats = await getMenu(rotiseriaId);
  return cats.flatMap(c => c.items);
}

export async function searchItems(params: {
  rotiseriaId?: number;
  q: string;
}): Promise<MenuItem[]> {
  await sleep(220);
  const t = params.q.toLowerCase().trim();
  if (!t) return [];
  const pool = params.rotiseriaId
    ? await listAllItems(params.rotiseriaId)
    : (await Promise.all(ROTISERIAS.map(r => listAllItems(r.id)))).flat();

  return pool.filter(it =>
    it.name.toLowerCase().includes(t) ||
    (it.description ?? "").toLowerCase().includes(t) ||
    (it.tags ?? []).some(tag => tag.toLowerCase().includes(t))
  );
}

// ---- API: Pedido simulado (sin backend) ------------------------------------
export type CreateOrderInput = {
  rotiseriaId: number;
  items: { itemId: number; qty: number }[];
  customerName?: string;
  note?: string;
  whatsapp?: string; // ej: "5493564..."
  address?: string;  // entrega
};

export type OrderResult = {
  orderId: string;
  eta_minutes: number;
  total: number;
};

export async function createOrder(input: CreateOrderInput): Promise<OrderResult> {
  await sleep(600);
  const items = await listAllItems(input.rotiseriaId);
  const map = new Map(items.map(i => [i.id, i]));
  let total = 0;
  let maxPrep = 0;

  for (const it of input.items) {
    const ref = map.get(it.itemId);
    if (!ref || !ref.is_available) continue;
    total += ref.price * it.qty;
    maxPrep = Math.max(maxPrep, ref.prep_time_minutes ?? 20);
  }
  const eta = Math.max(20, Math.min(60, Math.round(maxPrep + 10)));

  return {
    orderId: `PD-${Date.now()}`,
    eta_minutes: eta,
    total,
  };
}
