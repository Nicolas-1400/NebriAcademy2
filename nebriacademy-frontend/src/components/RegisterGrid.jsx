import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterGrid() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/usuarios/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombre,
            email: email,
            contrasena: contrasena,
          }),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        console.log("Registro exitoso:", datos);
        navigate("/Login");
      } else {
        setError(datos.error || "Error en el registro");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

  return (
    <div className="login-grid">
      <div className="formulario-login-contenedor">
        <form className="formulario-login" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
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
          <button type="submit">Registrarse</button>
        </form>

        <a href="/">Iniciar sesión</a>
      </div>
    </div>
  )
}
export default RegisterGrid