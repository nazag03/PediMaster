export type Address = {
  street: string;    // "Bv. 25 de Mayo 450"
  city: string;      // "San Francisco"
  province: string;  // "Córdoba"
  lat?: number;
  lng?: number;
};

export type ScheduleItem = {
  days: string;      // "Lun a Vie"
  hours: string;     // "11:30–15:00 / 20:00–23:00"
  closed?: boolean;
};

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  is_available: boolean;
  prep_time_minutes?: number;
  tags?: string[];        // ["vegetariano", "sin tacc"]
};

export type MenuCategory = {
  id: number;
  name: string;           // "Platos del día"
  items: MenuItem[];
};

export type Rotiseria = {
  id: number;
  slug: string;           // "rotiseria-don-sabor"
  name: string;           // "Rotisería Don Sabor"
  phone: string;          // "3564 651874"
  whatsapp: string;       // "5493564651874" // para wa.me
  address: Address;
  logoUrl?: string;       // URL o require("@/assets/logos/...")
  coverUrl?: string;      // imagen de portada
  schedule: ScheduleItem[];
  rating?: number;        // 4.5
  tags?: string[];        // ["milanesas", "pastas"]
};
