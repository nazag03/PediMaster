export type Food = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  is_available: boolean;
  prep_time_minutes?: number;
  category?: { id: number; name: string };
};
