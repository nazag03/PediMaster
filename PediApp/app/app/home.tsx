import { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, RefreshControl, Pressable, Alert, Linking } from "react-native";
import { fetchFoods } from "../lib/api";
import FoodCard from "../components/FoodCard";
import { useCart } from "../context/CartContext";
import type { Food } from "../src/typescript";

const ROTI = {
  nombre: "Rotisería Don Sabor",
  telefonoWhatsApp: "5493564651874",
  direccion: "Av. Siempre Viva 742, San Francisco, Córdoba",
  horario: [
    { dias: "Lun a Vie", horas: "11:30–15:00 / 20:00–23:00" },
    { dias: "Sáb", horas: "11:30–15:30 / 20:00–23:30" },
    { dias: "Dom", horas: "11:30–15:30" },
  ],
};

export default function HomeScreen() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const { addItem, items, subtotal } = useCart();

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchFoods();
      setFoods(data);
    } catch (e) {
      Alert.alert("Error", "No pudimos cargar el menú.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  const filtered = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter(f => f.name.toLowerCase().includes(q));
  }, [foods, busqueda]);

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
    return encodeURIComponent(header + lines.join("\n") + total);
  }, [items, subtotal]);

  const goWhatsApp = async () => {
    if (!items.length) {
      Alert.alert("Carrito vacío", "Agregá algún plato antes de enviar el pedido.");
      return;
    }
    const url = `https://wa.me/${ROTI.telefonoWhatsApp}?text=${waText}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
    else Alert.alert("WhatsApp no disponible");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Encabezado con info del local */}
      <View style={{ padding: 16, backgroundColor: "#111827" }}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>{ROTI.nombre}</Text>
        <Text style={{ color: "#ddd", marginTop: 4 }}>{ROTI.direccion}</Text>
        <Text style={{ color: "#ddd", marginTop: 2 }}>
          Horario: {ROTI.horario.map(h => `${h.dias} ${h.horas}`).join(" · ")}
        </Text>
      </View>

      {/* Buscador */}
      <View style={{ padding: 16, gap: 8 }}>
        <Text style={{ fontWeight: "600" }}>Buscar</Text>
        <TextInput
          placeholder="Ej: milanesa, pollo…"
          value={busqueda}
          onChangeText={setBusqueda}
          style={{
            backgroundColor: "white",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        />
      </View>

      {/* Lista de platos */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <FoodCard item={item} onAdd={addItem} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          loading ? null : (
            <Text style={{ textAlign: "center", color: "#6b7280" }}>
              No encontramos platos que coincidan.
            </Text>
          )
        }
      />

      {/* Botón fijo para enviar pedido por WhatsApp */}
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          gap: 8,
        }}
      >
        <Pressable
          onPress={goWhatsApp}
          style={{
            backgroundColor: "#22c55e",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
            elevation: 3,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            Enviar pedido por WhatsApp
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
