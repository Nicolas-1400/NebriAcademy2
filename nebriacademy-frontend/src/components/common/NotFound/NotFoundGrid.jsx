import { useNavigate } from "react-router-dom";
import ArrowCorrect from "../../../assets/Icons/arrow-correct.png";

// Página que se muestra cuando el usuario intenta acceder a una URL que no existe
function NotFoundGrid() {
  const navigate = useNavigate();
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h2>404</h2>
        <p>Página no encontrada</p>
        {/* El botón "Volver" navega a la página anterior en el historial del navegador */}
        <button className="boton-go-back" onClick={() => navigate(-1)}>
          <img src={ArrowCorrect} alt="Volver" />
          <p>Volver</p>
        </button>
      </div>
    </div>
  );
}

export default NotFoundGrid;
