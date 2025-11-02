import { Food } from "../src/typescript";
import { View, Text, Image, Pressable } from "react-native";

export default function FoodCard({ item, onAdd }: { item: Food; onAdd: (f: Food) => void }) {
  return (
    <View style={{ borderRadius: 16, overflow: "hidden", backgroundColor: "#fff", elevation: 2 }}>
      {!!item.image && (
        <Image source={{ uri: item.image }} style={{ width: "100%", height: 140 }} />
      )}
      <View style={{ padding: 12, gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.name}</Text>
        <Text style={{ color: "#111" }}>${item.price.toLocaleString("es-AR")}</Text>
        <Pressable
          onPress={() => onAdd(item)}
          style={{
            backgroundColor: "#111827",
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Agregar</Text>
        </Pressable>
      </View>
    </View>
  );
}
