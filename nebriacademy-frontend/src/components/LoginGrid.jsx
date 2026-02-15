import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

/**
 * Componente: LoginGrid
 * Formulario de inicio de sesión con validación y gestión de estado global.
 */
function LoginGrid() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  /*
   * Gestión del evento de Login
   * Realiza una petición POST asíncrona al backend para validar credenciales.
   * Si es exitoso, actualiza el estado global de la aplicación (Zustand) y redirige.
   */
  const handleLogin = async (evento) => {
    evento.preventDefault(); // Previene la recarga estándar del formulario HTML
    setError("");

    try {
      // Petición HTTP a la API REST (Endpoint de Autenticación)
      const respuesta = await fetch("http://localhost:3000/login/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Login correcto: Actualizar store y redirigir
        setUser(datos.usuario, datos.tipo);
        navigate("/Home");
      } else {
        // Manejo de errores (Credenciales inválidas, usuario no encontrado)
        setError(datos.error || "Error en el login");
      }
    } catch (err) {
      // Manejo de errores de red o servidor
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
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

          {error && <p className="error-login">{error}</p>}

          <button type="submit">Iniciar Sesión</button>
        </form>

        <a href="/PreRegister">Crear cuenta</a>
      </div>
    </div>
  );
}

export default LoginGrid;
