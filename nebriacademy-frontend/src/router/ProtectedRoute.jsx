import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// Componente de Ruta Protegida
function ProtectedRoute({ children, requiredTipo }) {
  // Estados desde el Store
  const user = useAuthStore((s) => s.user);
  const tipo = useAuthStore((s) => s.tipo);

  // Verificación de Usuario
  if (!user) return <Navigate to="/" replace />;

  // Verificación de Tipo
  if (requiredTipo && tipo !== requiredTipo)
    return <Navigate to="/Home" replace />;

  // Renderizado
  return children;
}

export default ProtectedRoute;
