import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

function ProtectedRoute({ children, requiredTipo }) {
  const user = useAuthStore((s) => s.user)
  const tipo = useAuthStore((s) => s.tipo)

  if (!user) return <Navigate to="/" replace />
  if (requiredTipo && tipo !== requiredTipo) return <Navigate to="/Home" replace />
  return children
}

export default ProtectedRoute
