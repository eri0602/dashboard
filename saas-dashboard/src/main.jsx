import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/auth.context";

/* ===== GLOBAL STYLES (ORDER IS IMPORTANT) ===== */
import "./styles/base.css";
import "./styles/theme.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
