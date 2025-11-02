import { useState, useMemo } from "react";
import {
  View, Text, TextInput, Pressable, Alert, Image,
  StyleSheet, useWindowDimensions, KeyboardAvoidingView,
  Platform, ScrollView, SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pass, setPass]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Escalas simples según ancho base 375 (iPhone X aprox.)
  const scale = useMemo(() => Math.min(Math.max(width / 375, 0.85), 1.2), [width]);
  const pad = 24 * Math.min(scale, 1.1);
  const logoW = Math.min(width * 0.6, 260);
  const logoH = logoW * 0.55;

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      await login(email, pass);
      router.replace("/home");
    } catch (e: any) {
      Alert.alert("Ingreso", e?.message ?? "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || !email.trim() || !pass.trim();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingHorizontal: pad, minHeight: height }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.center}>
            <Image
              source={require("../assets/PedimasterLogo.png")} // usa tu logo
              style={{ width: logoW, height: logoH, resizeMode: "contain" }}
            />
            <Text style={[styles.brand, { fontSize: 26 * scale }]}>PediMaster</Text>
          </View>

          <View style={[styles.card, { padding: 16 * scale, borderRadius: 16 }]}>
            <Text style={[styles.title, { fontSize: 22 * scale }]}>¡Bienvenido!</Text>

            <Text style={[styles.label, { fontSize: 14 * scale }]}>Email</Text>
            <TextInput
              placeholder="tu@email.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { paddingVertical: 12 * Math.min(scale, 1) }]}
            />

            <Text style={[styles.label, { fontSize: 14 * scale }]}>Contraseña</Text>
            <View style={styles.passRow}>
              <TextInput
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                value={pass}
                onChangeText={setPass}
                secureTextEntry={!showPass}
                style={[styles.passInput, { paddingVertical: 12 * Math.min(scale, 1) }]}
              />
              <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={8}>
                <Text style={[styles.show, { fontSize: 14 * scale }]}>
                  {showPass ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={onSubmit}
              disabled={disabled}
              style={[
                styles.btn,
                { paddingVertical: 14 * Math.min(scale, 1.1), borderRadius: 14 },
                disabled && styles.btnDisabled,
              ]}
            >
              <Text style={[styles.btnText, { fontSize: 16 * scale }]}>
                {submitting ? "Ingresando..." : "Ingresar"}
              </Text>
            </Pressable>

            <View style={styles.links}>
              <Pressable onPress={() => {}}>
                <Text style={[styles.link, { fontSize: 14 * scale }]}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>
              <Pressable onPress={() => {}}>
                <Text style={[styles.linkAlt, { fontSize: 14 * scale }]}>
                  Crear cuenta
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ORANGE = "#FF4500";

const styles = StyleSheet.create({
  scroll: { justifyContent: "center", paddingVertical: 32, backgroundColor: "#fff" },
  center: { alignItems: "center", marginBottom: 24 },
  brand: { fontWeight: "800", color: ORANGE, marginTop: 8 },
  card: {
    width: "100%",
    maxWidth: 520,            // en tablets/desktop no se estira infinito
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: { fontWeight: "700", color: "#1E293B", marginBottom: 12, textAlign: "center" },
  label: { color: "#475569", fontWeight: "600", marginTop: 8, marginBottom: 6 },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
  },
  passRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    marginBottom: 4,
    marginTop: 0,
  },
  passInput: { flex: 1, fontSize: 16, color: "#111827" },
  show: { color: ORANGE, fontWeight: "700" },
  btn: {
    backgroundColor: ORANGE,
    alignItems: "center",
    marginTop: 12,
    width: "100%",
  },
  btnDisabled: { backgroundColor: "#FDBA74" },
  btnText: { color: "#fff", fontWeight: "800" },
  links: { marginTop: 16, alignItems: "center", gap: 8 },
  link: { color: ORANGE, fontWeight: "600" },
  linkAlt: { color: "#FB923C", fontWeight: "600" },
});
