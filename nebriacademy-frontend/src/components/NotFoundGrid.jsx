import { useNavigate } from "react-router-dom"

function NotFoundGrid() {
    
    const navigate = useNavigate();
  return (
    <div className="not-found-grid">
      <h2>404</h2>
      <p>Página no encontrada</p>
      <button onClick={() => navigate(-1)}>Volver atrás</button>
    </div>
  )
}

export default NotFoundGrid