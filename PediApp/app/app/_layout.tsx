import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerTitle: "PediMaster",
          }}
        >
          {/* Oculta el header en la pantalla inicial (login) */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
