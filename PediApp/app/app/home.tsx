// app/home.tsx (o donde listes las rotiserías)
import { useEffect, useMemo, useState } from "react";
import { View, FlatList, ActivityIndicator, Text, useWindowDimensions } from "react-native";
import { listRotiserias } from "../lib/api";
import RotiseriaCard from "../components/RotiseriaCard";
import Navbar from "../components/Navbar";
export default function Home() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  // padding lateral del contenedor
  const containerPad = 16;

  // columnas según ancho
  const numColumns = useMemo(() => {
    if (width >= 1000) return 3;
    if (width >= 600) return 2;
    return 1;
  }, [width]);

  // ancho de cada card (restando paddings y spacing)
  const gap = 12;
  const cardWidth = useMemo(() => {
    const totalGaps = gap * (numColumns - 1);
    const totalPad = containerPad * 2;
    return (width - totalPad - totalGaps) / numColumns;
  }, [width, numColumns]);
const load = async (term?: string) => {
    const res = await listRotiserias({ q: term });
    setData(res);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    (async () => {
      const rotis = await listRotiserias();
      setData(rotis);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={{ marginTop: 8 }}>Cargando...</Text>
      </View>
    );
  }

  return (
     <View style={{ flex: 1 }}>
      <Navbar
        title="PediMaster"
        value={q}
        onChangeText={(t) => { setQ(t); }}
        onSubmit={(t) => load(t)}
        rightIconName="cart-outline"
        onPressRight={() => {/* navegar a /cart */}}
      />

      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <RotiseriaCard item={item} width={undefined as any /* si usás el grid responsive, pasá cardWidth */} />
        )}
      />
    </View>
  );
}
