import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

/**
 * Componente que protege las rutas.
 * Funciona como un "guardia" de seguridad:
 * 1. Verifica si estás logueado.
 * 2. Verifica si tienes permiso para entrar (por ejemplo, si eres profesor).
 *
 * Si no cumples los requisitos, te devuelve al Login o al Home.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - La página que queremos mostrar
 * @param {string} props.requiredTipo - (Opcional) Si la página es solo para 'profesor'
 */
function ProtectedRoute({ children, requiredTipo }) {
  // Obtenemos el usuario actual
  const user = useAuthStore((s) => s.user);
  const tipo = useAuthStore((s) => s.tipo);

  // Si no hay usuario, mandamos al Login
  if (!user) return <Navigate to="/" replace />;

  // Si la ruta requiere ser profesor y no lo somos, mandamos al Home
  if (requiredTipo && tipo !== requiredTipo)
    return <Navigate to="/Home" replace />;

  // Si todo está bien, mostramos la página solicitada
  return children;
}

export default ProtectedRoute;
