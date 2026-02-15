import { useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";

/**
 * Componente: NotFoundGrid
 * Muestra error 404 y botón para regresar.
 */
function NotFoundGrid() {
  const navigate = useNavigate();
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h2>404</h2>
        <p>Página no encontrada</p>
        <button className="boton-go-back" onClick={() => navigate(-1)}>
          <img src={flecha} alt="Volver" />
          <p>Volver</p>
        </button>
      </div>
    </div>
  );
}

export default NotFoundGrid;
