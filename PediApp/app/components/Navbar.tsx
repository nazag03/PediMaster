import React, { useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  value: string;
  onChangeText: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;

  // Botones opcionales
  showBack?: boolean;
  onPressBack?: () => void;
  rightIconName?: React.ComponentProps<typeof Ionicons>["name"];
  onPressRight?: () => void;
};

const ORANGE = "#FF4500";

export default function Navbar({
  title = "PediMaster",
  value,
  onChangeText,
  onSubmit,
  placeholder = "¿Qué querés comer?",
  showBack,
  onPressBack,
  rightIconName = "cart-outline",
  onPressRight,
}: Props) {
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Escalas suaves por ancho base 375
  const scale = useMemo(() => Math.min(Math.max(width / 375, 0.9), 1.2), [width]);
  const fontTitle = 18 * scale;

  return (
    <View style={[styles.wrapper, { paddingTop: top + 8 }]}>
      {/* fila título + acciones */}
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable onPress={onPressBack} hitSlop={10} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>
          ) : null}

          <Text style={[styles.title, { fontSize: fontTitle }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {onPressRight ? (
          <Pressable onPress={onPressRight} hitSlop={10} style={styles.iconBtn}>
            <Ionicons name={rightIconName} size={22} color="#fff" />
          </Pressable>
        ) : <View style={{ width: 22 }} />}
      </View>

      {/* buscador */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          onSubmitEditing={() => onSubmit?.(value)}
          style={styles.input}
          autoCorrect={false}
        />
        {!!value && (
          <Pressable onPress={() => onChangeText("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    // sombra
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  iconBtn: {
    padding: 2,
  },
  title: {
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
    paddingVertical: Platform.select({ ios: 10, android: 6 }),
  },
});
