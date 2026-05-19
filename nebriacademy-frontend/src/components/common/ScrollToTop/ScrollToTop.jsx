// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente utilitario que desplaza la ventana hacia arriba al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return null;
};

export default ScrollToTop;
