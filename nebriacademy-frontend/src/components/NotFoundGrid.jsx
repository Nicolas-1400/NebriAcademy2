// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// NotFoundGrid: Vista de contingencia para las rutas no resueltas (Código HTTP 404).
function NotFoundGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();

  // ==========================================
  // 4. BLOQUE DE RENDERIZADO
  // ==========================================
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h2>404</h2>
        <p>Página no encontrada</p>

        {/* Retrocede incondicionalmente -1 en el historial de saltos del navegador */}
        <button className="boton-go-back" onClick={() => navigate(-1)}>
          <img src={flecha} alt="Volver" />
          <p>Volver</p>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 5. EXPORTACIONES MÓDULO
// ==========================================
export default NotFoundGrid;
