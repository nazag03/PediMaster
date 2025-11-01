import "./FoodCard.css";

export default function FoodCard({ item }) {
  const { name, price, description, photo_url } = item;

  return (
    <article className="card">
      {photo_url ? (
        <img
          src={photo_url}
          alt={name}
          className="card__img"
          loading="lazy"
        />
      ) : (
        <div className="card__noimg">Sin imagen</div>
      )}

      <div className="card__body">
        <h3 className="card__title">{name}</h3>

        {description && (
          <p className="card__desc">{description}</p>
        )}

        <span className="card__price">
          ${Number(price).toLocaleString("es-AR")}
        </span>
      </div>
    </article>
  );
}
