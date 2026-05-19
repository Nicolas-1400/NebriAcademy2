// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente de formulario para el inicio de sesión de usuarios (Alumnos, Profesores, Admins)
function LoginGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Email del usuario
  const [email, setEmail] = useState("");
  // Contraseña del usuario
  const [contrasena, setContrasena] = useState("");
  // Mensaje de error para mostrar en el formulario
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // Guarda usuario y rol en el store global tras login exitoso
  const setUser = useAuthStore((state) => state.setUser);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  const handleLogin = async (evento) => {
    // Envía las credenciales al backend y actualiza el store en caso de éxito
    evento.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/login/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Autenticación exitosa: se guarda el usuario globalmente y se redirige
        setUser(datos.usuario, datos.tipo);
        navigate("/Home");
      } else {
        setError(datos.error || "Error en el login");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="auth-grid">
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          {error && <p className="login-error-message">{error}</p>}

          <button type="submit">Iniciar Sesión</button>
        </form>

        <a href="/PreRegister">Crear cuenta</a>
      </div>
    </div>
  );
}

export default LoginGrid;
