import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./auth/AuthContext.jsx";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { OrdersProvider } from "./context/OrderContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <OrdersProvider>
      <CartProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      </CartProvider>
    </OrdersProvider>
    </BrowserRouter>
  </React.StrictMode>
);
