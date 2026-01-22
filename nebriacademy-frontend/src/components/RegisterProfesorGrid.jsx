import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterProfesorGrid() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [numeroTarjeta, setTarjeta] = useState("");
  const [pais, setPais] = useState("");
  const [localidad, setLocalizacion] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/registerProfesor/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombre,
            apellidos: apellidos,
            dni: dni,
            email: email,
            contrasena: contrasena,
            numeroTarjeta: numeroTarjeta,
            pais: pais,
            localidad: localidad,
          }),
        },
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        console.log("Registro exitoso:", datos);
        navigate("/");
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
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
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
          <input
            type="text"
            placeholder="Tarjeta"
            value={numeroTarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="País"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Localidad"
            value={localidad}
            onChange={(e) => setLocalizacion(e.target.value)}
            required
          />
          {error && <p className="error-login">{error}</p>}
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterProfesorGrid;