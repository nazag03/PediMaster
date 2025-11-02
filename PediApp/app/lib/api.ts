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
