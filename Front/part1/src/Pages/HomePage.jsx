import { Link } from "react-router-dom";
import hero from "../assets/PedimasterLogo.png";
import styles from "./HomePage.module.css";

const highlights = [
  {
    title: "Pedidos simples",
    desc: "Elegí tu rotisería favorita, armá el pedido y seguí el estado en tiempo real.",
  },
  {
    title: "Experiencia cuidada",
    desc: "Diseñamos la app pensando en lo que necesitás: rapidez, claridad y cero vueltas.",
  },
  {
    title: "Equipo confiable",
    desc: "Trabajamos con locales de confianza que aman cocinar y llegar a tiempo.",
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.badge}>¿Con hambre?</span>
          <h1>
            Pedí con <span className={styles.brand}>PediMaster</span> y llega antes de
            que suene tu panza.
          </h1>
          <p className={styles.lead}>
            Una sola app para descubrir rotiserías, elegir tus platos y recibirlos sin
            dolores de cabeza. Registrate en segundos o entrá con Google.
          </p>

          <div className={styles.actions}>
            <Link to="/login" className={styles.primary}>
              Iniciar sesión
            </Link>
            <Link to="/app" className={styles.secondary}>
              Explorar menú
            </Link>
          </div>

          <div className={styles.miniCards}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>⚡</span>
              <div>
                <strong>Envíos ágiles</strong>
                <p>Coordinamos con la cocina y el delivery en un mismo lugar.</p>
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🛡️</span>
              <div>
                <strong>Cuenta segura</strong>
                <p>Accedé con tu correo o Google, sin complicarte con formularios.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.bubble} />
          <div className={styles.bubbleSecondary} />
          <img src={hero} alt="Logo de PediMaster" className={styles.heroImg} />

          <div className={styles.floatingCard}>
            <div>
              <p className={styles.floatingTitle}>Listo para ordenar</p>
              <p className={styles.floatingDesc}>3 rotiserías abiertas cerca tuyo</p>
            </div>
            <span className={styles.floatingBadge}>EN LÍNEA</span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <p className={styles.sectionKicker}>Lo que hace distinta a la app</p>
        <h2>Menos clicks, más comida rica</h2>
        <div className={styles.grid}>
          {highlights.map((item) => (
            <article key={item.title} className={styles.tile}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
