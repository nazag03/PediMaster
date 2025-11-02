import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { fetchOrders, createOrder, updateOrderStatus, deleteOrder } from "../Components/Api";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  const api = useMemo(() => ({
    orders,
    loading,
    reload,

    create: async (payload) => {
      const o = await createOrder(payload);
      setOrders(prev => [o, ...prev]);
      return o;
    },

    setStatus: async (id, status) => {
      const updated = await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
    },

    remove: async (id) => {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    },
  }), [orders, loading]);

  return (
    <OrdersContext.Provider value={api}>
      {children}
    </OrdersContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de <OrdersProvider>");
  return ctx;
}
