import { Link } from "react-router-dom";
import styles from "./Contact.module.css";

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}>Hablemos</p>
          <h1 className={styles.title}>Contactate con PediMaster</h1>
          <p className={styles.lead}>
            ¿Tenés una rotisería y querés sumarte? ¿Tuviste un problema con un pedido?
            Escribinos y te respondemos lo antes posible.
          </p>
        </div>

        <div className={styles.chipsRow}>
          <span className={styles.chip}>Rotiserías de barrio</span>
          <span className={styles.chip}>Usuarios con hambre</span>
          <span className={styles.chip}>Soporte técnico</span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* FORM */}
        <section className={styles.formCard}>
          <h2 className={styles.formTitle}>Enviá tu consulta</h2>
          <p className={styles.formSubtitle}>
            Respondemos primero los mensajes de locales asociados o interesados en sumarse.
          </p>

          <form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="name">
                Nombre y apellido
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={styles.input}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email de contacto
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="Ej: juan@ejemplo.com"
              />
            </div>

            <div className={styles.inlineGroup}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="role">
                  Soy
                </label>
                <select id="role" name="role" className={styles.select}>
                  <option value="">Elegí una opción</option>
                  <option value="user">Usuario que hace pedidos</option>
                  <option value="store">Dueño/a de rotisería</option>
                  <option value="courier">Repartidor</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="topic">
                  Motivo
                </label>
                <select id="topic" name="topic" className={styles.select}>
                  <option value="">Seleccionar</option>
                  <option value="join">Quiero sumar mi rotisería</option>
                  <option value="order-issue">Tuve un problema con un pedido</option>
                  <option value="billing">Consultas de facturación</option>
                  <option value="tech">Error o bug en la app</option>
                  <option value="feedback">Sugerencias / feedback</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="store">
                Nombre de la rotisería (opcional)
              </label>
              <input
                id="store"
                name="store"
                type="text"
                className={styles.input}
                placeholder="Ej: Rotisería Don Pepe"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="message">
                Contanos qué necesitás
              </label>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                rows={5}
                placeholder="Daños, retrasos, ideas, dudas... escribí todo lo que nos ayude a entender mejor."
              />
            </div>

            <div className={styles.checkboxRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                <span>
                  Quiero recibir novedades y mejoras de PediMaster en mi email.
                </span>
              </label>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submit}>
                Enviar mensaje
              </button>
              <p className={styles.smallPrint}>
                Al enviar, aceptás que usemos estos datos para responder tu consulta.
              </p>
            </div>
          </form>
        </section>

        {/* SIDE INFO */}
        <aside className={styles.sideCard}>
          <h2 className={styles.sideTitle}>Otras formas de contacto</h2>
          <p className={styles.sideLead}>
            Si tu consulta es urgente o sobre un pedido en curso, usá estos canales.
          </p>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Soporte pedidos</p>
            <p className={styles.infoValue}>soporte@pedimaster.app</p>
            <p className={styles.infoHint}>Enviá número de pedido y captura si tenés.</p>
          </div>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Nuevas rotiserías</p>
            <p className={styles.infoValue}>locales@pedimaster.app</p>
            <p className={styles.infoHint}>
              Contanos dónde estás, qué vendés y cuántos pedidos manejás por día.
            </p>
          </div>

          <div className={styles.scheduleCard}>
            <p className={styles.scheduleTitle}>Horarios de soporte</p>
            <ul className={styles.scheduleList}>
              <li>
                <span>Lunes a viernes</span>
                <span>09:00 — 22:00</span>
              </li>
              <li>
                <span>Sábados</span>
                <span>10:00 — 00:00</span>
              </li>
              <li>
                <span>Domingos y feriados</span>
                <span>18:00 — 23:00</span>
              </li>
            </ul>
            <p className={styles.scheduleHint}>
              Fuera de horario podés escribir igual, respondemos al próximo turno.
            </p>
          </div>

          <div className={styles.miniPanel}>
            <p className={styles.miniTitle}>¿Estás probando la app?</p>
            <p className={styles.miniText}>
              Si sos dev / tester del proyecto, podés ir directo al panel.
            </p>
            <div className={styles.miniActions}>
              <Link to="/login" className={styles.miniBtn}>
                Ir al login
              </Link>
              <Link to="/" className={styles.miniLink}>
                Volver al inicio
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
