// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// VerificacionAlumnoNebrijaGrid: Primer paso en el flujo de registro institucional.
// Solícita un correo y un código para validar que la persona pertenece efectivamente a la academia.
function VerificacionAlumnoNebrijaGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  // Manejo estándar de credenciales de entrada
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  // Feedback visual para denegaciones de acceso o problemas de conexión
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // 4. FUNCIONES Y HANDLERS
  // ==========================================
  // Proceso de confrontación de credenciales institucionales contra la base de datos
  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/alumnos/verificacionnebrija/auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasena }),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // En caso positivo, se emite un salvoconducto vía sessionStorage
        // y se redirige a la fase 2 cargando el correo en la ruta (location.state)
        sessionStorage.setItem("verifiedStudentEmail", email);
        navigate("/Register/RegisterAlumnoNebrija", { state: { email } });
      } else {
        setError(datos.error || "Error en la verificación");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  // ==========================================
  // 5. RENDERIZADO
  // ==========================================
  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        <form className="formulario-login" onSubmit={handleVerification}>
          <input
            type="email"
            placeholder="Email de la familia Nebrija"
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

// ==========================================
// 6. EXPORTACIONES
// ==========================================
export default VerificacionAlumnoNebrijaGrid;
