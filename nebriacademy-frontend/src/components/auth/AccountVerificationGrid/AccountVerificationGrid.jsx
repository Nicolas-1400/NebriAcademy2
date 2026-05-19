// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Valida que el usuario pertenezca a la institución mediante un código temporal
function AccountVerificationGrid({ tipo }) {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Correo del usuario usado para verificación
  const [email, setEmail] = useState("");
  // Código de verificación temporal enviado por la institución
  const [contrasena, setContrasena] = useState("");
  // Mensaje de error mostrado al usuario
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Envía el email y el código al backend y redirige si la verificación es correcta
  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    // Bifurcación según el tipo de usuario para llamar al endpoint correspondiente
    if (tipo === "alumnonebrija") {
      try {
        // Llamada al endpoint de verificación para alumnos Nebrija
        const respuesta = await fetch(
          `${API_URL}/alumnos/verificacionnebrija/auth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contrasena }),
          },
        );

        const datos = await respuesta.json();

        if (respuesta.ok) {
          // Guardamos el email en sessionStorage para que el guarda de ruta lo encuentre en el siguiente paso
          sessionStorage.setItem("verifiedStudentEmail", email);
          navigate("/Register/alumnonebrija", { state: { email } });
        } else {
          setError(datos.error || "Error en la verificación");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor");
      }
    } else if (tipo === "profesor") {
      try {
        // Llamada al endpoint de verificación para profesores
        const respuesta = await fetch(
          `${API_URL}/profesores/verificacionprofesor/auth`,
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
          navigate("/Register/profesor", { state: { email } });
        } else {
          setError(datos.error || "Error en la verificación");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor");
      }
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="auth-grid">
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleVerification}>
          {/* Input para el correo corporativo (Nebrija) */}
          <input
            type="email"
            placeholder="Email de la familia Nebrija"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Input para el código facilitado por la universidad/departamento */}
          <input
            type="text"
            placeholder="Código de verificación"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          {error && <p className="verification-error-message">{error}</p>}
          <button type="submit">Verificar Cuenta</button>
        </form>
        <p>
          ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default AccountVerificationGrid;
