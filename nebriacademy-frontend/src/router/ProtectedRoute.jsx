import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// Componente que protege rutas privadas.
// Si no hay usuario en el store, redirige al login. Si se exige un tipo concreto y no coincide, redirige a /Home.
function ProtectedRoute({ children, requiredTipo }) {
  const user = useAuthStore((s) => s.user);
  const tipo = useAuthStore((s) => s.tipo);

  // Si no hay sesión activa, mandamos al login
  if (!user) return <Navigate to="/" replace />;

  // Si la ruta requiere un tipo específico (ej: "profesor") y el usuario no lo tiene, redirigimos a /Home
  if (requiredTipo && tipo !== requiredTipo)
    return <Navigate to="/Home" replace />;

  // Si todo está bien, renderizamos la página protegida
  return children;
}

export default ProtectedRoute;
