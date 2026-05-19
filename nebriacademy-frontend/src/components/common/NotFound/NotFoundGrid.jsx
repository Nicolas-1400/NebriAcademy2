// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import ArrowCorrect from "../../../assets/Icons/arrow-correct.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de error 404 para rutas inexistentes
function NotFoundGrid() {
  // Hook de React Router para navegación programática
  const navigate = useNavigate();
  
  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h2>404</h2>
        <p>Página no encontrada</p>
        {/* onClick={() => navigate(-1)} emula el botón "Atrás" del navegador */}
        <button className="button-go-back" onClick={() => navigate(-1)}>
          <img src={ArrowCorrect} alt="Volver" />
          <p>Volver</p>
        </button>
      </div>
    </div>
  );
}

export default NotFoundGrid;
