// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Formulario de inicio de sesión: valida credenciales con el backend y redirige al home
function LoginGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Estado local para los campos del formulario y para mostrar errores
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Maneja el envío del formulario: hace la petición al backend y redirige si el login es correcto
  const handleLogin = async (evento) => {
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
        // Guardamos el usuario en el store global y navegamos al home
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
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        {/* Formulario de login: al hacer submit se ejecuta handleLogin */}
        <form className="formulario-login" onSubmit={handleLogin}>
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

          {/* Mostramos el error solo si hay alguno */}
          {error && <p className="error-login">{error}</p>}

          <button type="submit">Iniciar Sesión</button>
        </form>

        <a href="/PreRegister">Crear cuenta</a>
      </div>
    </div>
  );
}

export default LoginGrid;
