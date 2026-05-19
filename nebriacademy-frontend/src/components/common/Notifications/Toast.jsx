// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import useToastStore from "../../../store/toastStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente global que muestra notificaciones emergentes (toasts)
const Toast = () => {
  // Suscripción al estado global de notificaciones y función de borrado
  const { toasts, removeToast } = useToastStore();

  // ── RENDER ───────────────────────────────────────────────────────────────────
  // Si no hay notificaciones, no renderizamos nada en el DOM
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {/* Iteramos sobre el array de notificaciones activas */}
      {toasts.map((toast) => (
        // Asignamos key única y clase dinámica según el tipo (ej: success, error)
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          {/* Botón para cerrar la notificación manualmente antes del timeout */}
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
