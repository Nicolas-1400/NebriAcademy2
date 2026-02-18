import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerificacionProfesorGrid() {
  // Estados
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handlers
  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/profesores/verificacionprofesor/auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasena }),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Guardamos email verificado en sesión para proteger el registro
        sessionStorage.setItem("verifiedProfessorEmail", email);
        // Navegamos al registro de profesor
        navigate("/Register/RegisterProfesor", { state: { email } });
      } else {
        setError(datos.error || "Error en la verificación");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        <form className="formulario-login" onSubmit={handleVerification}>
          <input
            type="email"
            placeholder="Email corporativo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Código de verificación"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          {error && <p className="error-login">{error}</p>}
          <button type="submit">Verificar Cuenta</button>
        </form>
        <p>
          ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default VerificacionProfesorGrid;
