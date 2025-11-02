import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login, loading, session } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // si ya hay sesión, vamos directo a home
  if (!loading && session) {
    router.replace("/home");
  }

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
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", color: "#1E293B", marginBottom: 24 }}>
        ¡Bienvenido!
      </Text>

      <View style={{ gap: 12 }}>
        <View>
          <Text style={{ marginBottom: 6, color: "#334155", fontWeight: "600" }}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>

        <View>
          <Text style={{ marginBottom: 6, color: "#334155", fontWeight: "600" }}>Contraseña</Text>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              paddingHorizontal: 14,
              paddingVertical: 2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="********"
              value={pass}
              onChangeText={setPass}
              secureTextEntry={!showPass}
              style={{ flex: 1, paddingVertical: 10 }}
            />
            <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={8}>
              <Text style={{ color: "#2563EB", fontWeight: "600" }}>
                {showPass ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={onSubmit}
          disabled={disabled}
          style={{
            backgroundColor: disabled ? "#94A3B8" : "#111827",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {submitting ? "Ingresando..." : "Ingresar"}
          </Text>
        </Pressable>

        <View style={{ marginTop: 8, alignItems: "center", gap: 8 }}>
          <Pressable onPress={() => { /* futuro: recuperar pass */ }}>
            <Text style={{ color: "#2563EB" }}>¿Olvidaste tu contraseña?</Text>
          </Pressable>
          <Pressable onPress={() => { /* futuro: registro */ }}>
            <Text style={{ color: "#0EA5E9" }}>Crear cuenta</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
