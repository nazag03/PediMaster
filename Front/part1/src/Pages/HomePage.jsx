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
    desc: "Diseñamos la app para que entiendas todo de un vistazo, sin perder tiempo.",
  },
  {
    title: "Equipo confiable",
    desc: "Trabajamos con locales de confianza que aman cocinar y llegar a tiempo.",
  },
  {
    title: "Soporte cercano",
    desc: "¿Algo salió mal? Te ayudamos a resolverlo sin bots eternos ni formularios raros.",
  },
];

const steps = [
  {
    step: "1",
    title: "Buscá tu rotisería",
    desc: "Filtrá por distancia, tipo de comida o promos del día.",
  },
  {
    step: "2",
    title: "Armá tu pedido",
    desc: "Personalizá tus platos, agrega notas y elegí cómo pagar.",
  },
  {
    step: "3",
    title: "Seguí el envío",
    desc: "Ves cuándo lo están preparando, cuándo sale y cuándo llega.",
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.badge}>¿Con hambre ahora mismo?</span>

          <h1 className={styles.title}>
            Pedí con <span className={styles.brand}>PediMaster</span> y que el
            antojo llegue <span className={styles.accent}>bien caliente</span>.
          </h1>

          <p className={styles.lead}>
            Pedidos online pensados para rotiserías de barrio. Encontrá, pedí y
            recibí tu comida sin llamados, sin esperas eternas y sin sorpresas en
            el precio final.
          </p>

          <div className={styles.actions}>
            <Link to="/login" className={styles.primary}>
              Iniciar sesión
            </Link>
            <Link to="/app" className={styles.secondary}>
              Ver rotiserías cerca
            </Link>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <p className={styles.statNumber}>+120</p>
              <p className={styles.statLabel}>Pedidos entregados hoy</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statNumber}>4.8★</p>
              <p className={styles.statLabel}>Promedio de satisfacción</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statNumber}>15 min</p>
              <p className={styles.statLabel}>Promedio en retiro en local</p>
            </div>
          </div>

          <div className={styles.miniCards}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>⚡</span>
              <div>
                <strong>Envíos ágiles</strong>
                <p>Coordinamos cocina y delivery en un mismo lugar.</p>
              </div>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🛡️</span>
              <div>
                <strong>Cuenta segura</strong>
                <p>Entrá con tu correo o Google, sin vueltas ni contraseñas raras.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.bubble} />
          <div className={styles.bubbleSecondary} />
          <div className={styles.heroCard}>
            <img src={hero} alt="Logo de PediMaster" className={styles.heroImg} />

            <div className={styles.orderPreview}>
              <div className={styles.orderHeader}>
                <p className={styles.orderTitle}>Tu pedido de esta noche</p>
                <span className={styles.orderStatus}>Preparando</span>
              </div>
              <p className={styles.orderDesc}>Milanesa napolitana x2 · Papas fritas · Gaseosa</p>
              <div className={styles.orderFooter}>
                <span className={styles.orderEta}>Llega en 25-35 min</span>
                <button className={styles.orderTrackBtn}>Seguir pedido</button>
              </div>
            </div>

            <div className={styles.floatingCard}>
              <div>
                <p className={styles.floatingTitle}>Rotiserías cerca tuyo</p>
                <p className={styles.floatingDesc}>5 abiertas • 2 con promos activas</p>
              </div>
              <span className={styles.floatingBadge}>EN LÍNEA</span>
            </div>
          </div>
        </div>
      </div>

      {/* DIFERENCIALES */}
      <section className={styles.section}>
        <p className={styles.sectionKicker}>Por qué usar PediMaster</p>
        <h2 className={styles.sectionTitle}>Menos app, más comida rica</h2>
        <p className={styles.sectionLead}>
          Queremos que tu experiencia sea como la comida de tu rotisería: abundante,
          clara y sin letra chica.
        </p>

        <div className={styles.grid}>
          {highlights.map((item) => (
            <article key={item.title} className={styles.tile}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className={styles.stepsSection}>
        <p className={styles.sectionKicker}>Así de fácil</p>
        <h2 className={styles.sectionTitle}>Hacé tu pedido en 3 pasos</h2>

        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <article key={step.step} className={styles.stepCard}>
              <div className={styles.stepBadge}>{step.step}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* PARA LOCALES Y PARA VOS */}
      <section className={styles.dualSection}>
        <div className={styles.dualBlock}>
          <h3>¿Tenés una rotisería?</h3>
          <p>
            Sumate a PediMaster y empezá a recibir pedidos online sin perder el control
            de tu cocina. Administrá menús, horarios, estados de pedido y más desde un
            panel simple.
          </p>
          <ul className={styles.list}>
            <li>✔ Panel web para ver todos los pedidos en vivo.</li>
            <li>✔ Modo “pausa” para cuando la cocina explota.</li>
            <li>✔ Estadísticas de ventas por día y plato.</li>
          </ul>
          <Link to="/contact" className={styles.linkGhost}>
            Quiero sumar mi rotisería
          </Link>
        </div>

        <div className={styles.dualBlock}>
          <h3>¿Solo querés comer rico?</h3>
          <p>
            Registrate en segundos, guardá tus pedidos favoritos y repetí tus combos de
            siempre con un par de toques.
          </p>
          <ul className={styles.list}>
            <li>✔ Historial de pedidos para reordenar rápido.</li>
            <li>✔ Direcciones guardadas para distintos lugares.</li>
            <li>✔ Notificaciones cuando tu pedido está por llegar.</li>
          </ul>
          <Link to="/login" className={styles.linkGhost}>
            Crear mi cuenta
          </Link>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} PediMaster · Hecho para las rotiserías de barrio.</p>
        <div className={styles.footerLinks}>
          <Link to="/terms">Términos</Link>
          <span>·</span>
          <Link to="/privacy">Privacidad</Link>
        </div>
      </footer>
    </div>
  );
}
