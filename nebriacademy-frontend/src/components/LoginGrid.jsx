import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function LoginGrid() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (evento) => {
    evento.preventDefault();
    setError("");

    try {
      const respuesta = await fetch("http://localhost:3000/login/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
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
