import { useEffect, useState } from "react";
import { fetchFoods } from "../Components/Api"; // ajustá la ruta si fuera necesario
import FoodCard from "../components/FoodCard";
import "./Prueba.css"
export default function Home() {
  const [foods, setFoods] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await fetchFoods();
      if (alive) setFoods(data);
    })();
    return () => { alive = false; };
  }, []);

  if (!foods) {
    // loading simple
    return (
      <div className="prueba">
      <section className="pruebasection">
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <article className="card" key={i} style={{ opacity: .8 }}>
              <div className="card__img skeleton" style={{ aspectRatio: "4/3", borderRadius: 12 }} />
              <div className="skeleton" style={{ height: 18, width: "70%", borderRadius: 8, marginTop: 10 }} />
              <div className="skeleton" style={{ height: 14, width: 120, borderRadius: 999, marginTop: 8 }} />
              <div className="skeleton" style={{ height: 20, width: 90, borderRadius: 8, marginTop: 12 }} />
            </article>
          ))}
        </div>
      </section>
          </div>
    );
  }

  return (
    <section className="section">
      <div className="grid">
        {foods.map((f) => (
          <FoodCard key={f.id} item={f} />
        ))}
      </div>
    </section>
  );
}
