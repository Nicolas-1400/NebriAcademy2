// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Primer paso del registro para profesores: verifica el email institucional y el código temporal
function VerificacionProfesorGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Envía el email y el código al backend. Si son correctos, guarda el email en sessionStorage y navega al formulario de registro.
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
        // Guardamos el email en sessionStorage para que el guarda de ruta lo encuentre en el siguiente paso
        sessionStorage.setItem("verifiedProfessorEmail", email);
        navigate("/Register/RegisterProfesor", { state: { email } });
      } else {
        setError(datos.error || "Error en la verificación");
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
        <form className="formulario-login" onSubmit={handleVerification}>
          <input
            type="email"
            placeholder="Email"
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
