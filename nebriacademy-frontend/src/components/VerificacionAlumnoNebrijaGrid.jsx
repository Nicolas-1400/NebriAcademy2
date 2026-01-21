import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerificacionAlumnoNebrijaGrid() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/verificacionnebrija/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        console.log("Verificación exitosa:", datos);
        navigate("/RegisterAlumnoNebrija", { state: { email: email, alumnoId: datos.alumnoId } });
      } else {
        setError(datos.error || "Error en la verificación");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

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
          {error && <p className="error-login">{error}</p>}
          <button type="submit">Verificar Email</button>
        </form>
      </div>
    </div>
  );
}

export default VerificacionAlumnoNebrijaGrid;