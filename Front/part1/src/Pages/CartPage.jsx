import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { ROTI, waBase } from "../config/roti";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { items, increment, decrement, removeItem, clear, subtotal } = useCart();
  const { create } = useOrders(); // 👈 NUEVO
  const [nota, setNota] = useState("");
  const navigate = useNavigate();

  const waText = useMemo(() => {
    if (!items.length) return "";
    const header = `¡Hola ${ROTI.nombre}! Quiero hacer este pedido:\n`;
    const lines = items.map(
      (it) =>
        `• ${it.qty}x ${it.name} - $${it.price.toLocaleString("es-AR")} c/u = $${(
          it.price * it.qty
        ).toLocaleString("es-AR")}`
    );
    const total = `\nTotal: $${subtotal.toLocaleString("es-AR")}`;
    const extra = nota ? `\nNota: ${nota}` : "";
    return encodeURIComponent(header + lines.join("\n") + total + extra);
  }, [items, nota, subtotal]);

  const canSend = items.length > 0;

  // 👇 NUEVO: crea el pedido y abre WhatsApp sin ser bloqueado
  async function handleSend() {
    if (!canSend) return;

    // abrir ventana primero para evitar bloqueos del navegador
    const win = window.open("", "_blank");

    try {
      // 1) Guardar el pedido (quedan en localStorage vía OrdersContext)
      await create({
        items: items.map(({ id, name, qty, price }) => ({ id, name, qty, price })),
        subtotal,
        customer: null, // si luego agregás nombre/teléfono, ponelos acá
        note: nota || "",
      });

      // 2) Armar URL de WhatsApp y navegar la ventana ya abierta
      const url = `${waBase()}${waText}`;
      if (win) {
        win.location.href = url;
      } else {
        window.open(url, "_blank");
      }

      // 3) (Opcional) limpiar carrito
      // clear();
    } catch (err) {
      console.error(err);
      if (win) win.close();
      alert("No se pudo crear el pedido. Intentá nuevamente.");
    }
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.btnGhost} onClick={() => navigate(-1)}>← Volver</button>
        <h1>Tu pedido</h1>
        <div />
      </header>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Tu carrito está vacío.</p>
          <button className={styles.btnPrimary} onClick={() => navigate("/")}>
            Ver menú
          </button>
        </div>
      ) : (
        <>
          <ul className={styles.list}>
            {items.map((it) => (
              <li key={it.id} className={styles.item}>
                <div className={styles.info}>
                  {it.image_url && (
                    <img src={it.image_url} alt={it.name} className={styles.thumb} />
                  )}
                  <div>
                    <div className={styles.name}>{it.name}</div>
                    <div className={styles.price}>
                      ${it.price.toLocaleString("es-AR")} c/u
                    </div>
                  </div>
                </div>

                <div className={styles.controls}>
                  <button onClick={() => decrement(it.id)} className={styles.step}>−</button>
                  <span className={styles.qty}>{it.qty}</span>
                  <button onClick={() => increment(it.id)} className={styles.step}>＋</button>
                </div>

                <div className={styles.lineTotal}>
                  ${ (it.price * it.qty).toLocaleString("es-AR") }
                </div>

                <button
                  className={styles.remove}
                  onClick={() => removeItem(it.id)}
                  aria-label={`Quitar ${it.name}`}
                  title="Quitar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.noteBox}>
            <label className={styles.label}>Nota para el comercio (opcional)</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Sin sal en la guarnición, timbre roto, etc."
            />
          </div>

          <div className={styles.summary}>
            <div>Total</div>
            <div className={styles.total}>${subtotal.toLocaleString("es-AR")}</div>
          </div>

          <div className={styles.actions}>
            <button className={styles.btnGhost} onClick={clear}>Vaciar carrito</button>

            {/* 👇 ahora es un botón que dispara handleSend */}
            <button
              className={styles.btnPrimary}
              onClick={handleSend}
              disabled={!canSend}
              aria-disabled={!canSend}
            >
              Enviar por WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
}
