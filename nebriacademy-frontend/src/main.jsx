import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Punto de entrada de la aplicación React
// render() inyecta la app en el div#root de index.html
createRoot(document.getElementById("root")).render(
  // StrictMode advierte de problemas potenciales durante el desarrollo
  <StrictMode>
    <App />
  </StrictMode>,
);
