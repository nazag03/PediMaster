import { useMemo, useState } from "react";
import { useOrders } from "../../context/OrderContext";
import styles from "./AdminOrders.module.css";

function StatusBadge({ status }) {
  const map = {
    pending: { label: "Pendiente", cls: styles.badgePending },
    completed: { label: "Completado", cls: styles.badgeCompleted },
    canceled: { label: "Cancelado", cls: styles.badgeCanceled },
  };
  const s = map[status] || map.pending;
  return <span className={`${styles.badge} ${s.cls}`}>{s.label}</span>;
}

export default function AdminOrders() {
  const { orders, loading, setStatus, remove } = useOrders();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | completed | canceled

  const filtered = useMemo(() => {
    const txt = q.trim().toLowerCase();
    return orders.filter(o => {
      const byStatus = filter === "all" ? true : o.status === filter;
      const hayTexto = !txt || [
        o?.customer?.name, o?.customer?.phone, o?.note, o.id
      ].join(" ").toLowerCase().includes(txt);
      return byStatus && hayTexto;
    });
  }, [orders, q, filter]);

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <h1 className={styles.title}>Pedidos</h1>
        <div className={styles.filters}>
          <input
            className={styles.search}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por cliente, teléfono, nota, ID…"
          />
          <select className={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
            <option value="canceled">Cancelados</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className={styles.muted}>Cargando pedidos…</p>
      ) : !filtered.length ? (
        <p className={styles.muted}>No hay pedidos con ese filtro.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Direccion</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>Estado</th>
                <th className={styles.thActions}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td className={styles.idMono}>{o.id.slice(-6)}</td>
                  <td>{new Date(o.createdAt).toLocaleString("es-AR")}</td>
                  <td>
                    <div>{o?.customer?.name || "—"}</div>
                    <small className={styles.muted}>{o?.customer?.phone || "—"}</small>
                  </td>
                  <td>"Direccion"</td>
                  <td>
                    <ul className={styles.itemsList}>
                      {o.items.map(it => (
                        <li key={it.id}>{it.qty}× {it.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td>${o.subtotal?.toLocaleString("es-AR")}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className={styles.tdActions}>
                    {o.status !== "completed" && (
                      <button className={styles.btnOk} onClick={() => setStatus(o.id, "completed")}>
                        Completar
                      </button>
                    )}
                    {o.status !== "canceled" && (
                      <button className={styles.btnWarn} onClick={() => setStatus(o.id, "canceled")}>
                        Cancelar
                      </button>
                    )}
                    <button className={styles.btnDanger} onClick={() => remove(o.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
