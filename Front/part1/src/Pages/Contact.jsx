import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Hablemos</p>
        <h1 className={styles.title}>Contactate con el equipo de PediMaster</h1>
        <p className={styles.subtitle}>
          Contanos qué necesitás: soporte, dudas sobre tu cuenta o cómo sumar tu
          rotisería. Te respondemos a la brevedad.
        </p>
      </header>

      <section className={styles.cards}>
        <article className={styles.card}>
          <h2>Usuarios y pedidos</h2>
          <p>
            ¿Tenés un problema con tu pedido? Compartí tu correo y el número de
            orden para ayudarte más rápido.
          </p>
          <ul>
            <li>Soporte para pedidos en curso</li>
            <li>Actualizaciones de entrega</li>
            <li>Opciones de pago y reintegros</li>
          </ul>
          <a href="mailto:soporte@pedimaster.com" className={styles.link}>
            soporte@pedimaster.com
          </a>
        </article>

        <article className={styles.card}>
          <h2>Sumá tu rotisería</h2>
          <p>
            Si querés vender con PediMaster, dejanos tus datos y te contactamos
            con los pasos para activar tu panel.
          </p>
          <ul>
            <li>Onboarding y capacitación</li>
            <li>Integración de menú y horarios</li>
            <li>Panel de administración en vivo</li>
          </ul>
          <a href="mailto:aliados@pedimaster.com" className={styles.link}>
            aliados@pedimaster.com
          </a>
        </article>

        <article className={styles.card}>
          <h2>Prensa y alianzas</h2>
          <p>
            Para notas, partnerships o consultas comerciales, escribinos y te
            derivamos al equipo indicado.
          </p>
          <ul>
            <li>Prensa y difusión</li>
            <li>Programas de referidos</li>
            <li>Beneficios corporativos</li>
          </ul>
          <a href="mailto:press@pedimaster.com" className={styles.link}>
            press@pedimaster.com
          </a>
        </article>
      </section>

      <section className={styles.contactBox}>
        <div>
          <p className={styles.kicker}>Atención rápida</p>
          <h2>También estamos en WhatsApp</h2>
          <p className={styles.subtitle}>
            De lunes a domingo, de 9 a 23 h. Respondemos en minutos y hacemos
            seguimiento de tu caso.
          </p>
        </div>
        <a href="https://wa.me/5491122334455" className={styles.cta}>
          Escribir por WhatsApp
        </a>
      </section>
    </div>
  );
}
