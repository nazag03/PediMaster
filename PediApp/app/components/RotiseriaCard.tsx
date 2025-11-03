// src/components/RotiseriaCard.tsx
import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  item: any;
  width: number; // ancho asignado por el grid
};

export default function RotiseriaCard({ item, width }: Props) {
  // tamaños proporcionales al ancho de la card
  const coverH = width * 0.56;                       // ~16:9
  const logoSize = Math.max(52, Math.min(72, width * 0.18));
  const pad = Math.max(12, Math.min(16, width * 0.04));
  const titleSize = Math.max(14, Math.min(18, width * 0.06));
  const subSize = Math.max(12, Math.min(14, width * 0.045));

  return (
    <View style={[styles.card, { width }]}>
      {/* portada */}
      <Image source={{ uri: item.coverUrl }} style={{ width: "100%", height: coverH }} />

      {/* logo centrado, superpuesto */}
      <View style={[styles.logoWrapper, { top: coverH - logoSize / 2 - 6 }]}>
        <Image
          source={{ uri: item.logoUrl }}
          style={{ width: logoSize, height: logoSize, borderRadius: logoSize / 2 }}
        />
      </View>

      {/* info */}
      <View style={[styles.info, { paddingTop: logoSize / 2 + pad, paddingHorizontal: pad, paddingBottom: pad }]}>
        <Text style={[styles.name, { fontSize: titleSize }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.address, { fontSize: subSize }]} numberOfLines={1}>
          {item.address.street}
        </Text>
        <Text style={[styles.desc, { fontSize: subSize }]} numberOfLines={1}>
          {item.tags?.join(" • ") ?? "Comidas caseras"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  logoWrapper: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    alignItems: "center",
  },
  name: { fontWeight: "700", color: "#1E293B" },
  address: { color: "#64748B", marginTop: 4 },
  desc: { color: "#FB923C", marginTop: 4, fontWeight: "600" },
});
