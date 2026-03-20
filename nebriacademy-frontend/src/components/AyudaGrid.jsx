import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import "../styles/Ayuda.css";

function AyudaGrid() {
  const { user, tipo } = useAuthStore();
  const [tipoReporte, setTipoReporte] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipoReporte || !descripcion) {
      alert("Por favor, rellena todos los campos requeridos.");
      return;
    }

    if (archivo && archivo.size > 10 * 1024 * 1024) {
      alert("El archivo adjunto no puede superar los 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("tipo", tipoReporte);
    formData.append("descripcion", descripcion);
    if (user) {
      formData.append("usuario_id", user.id || "");
      formData.append("usuario_nombre", `${user.nombre || ""} ${user.apellidos || ""}`.trim());
      formData.append("usuario_tipo", tipo || "");
      formData.append("usuario_email", user.email || "");
    }
    if (archivo) {
      formData.append("archivo", archivo);
    }

    try {
      setEnviando(true);
      const res = await fetch("http://localhost:3000/incidencias", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Incidencia enviada correctamente.");
        setTipoReporte("");
        setDescripcion("");
        setArchivo(null);
        // Reseteamos el input file
        document.getElementById("archivoIncidencia").value = "";
      } else {
        alert("Error al enviar la incidencia.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contenedor-ayuda">
      <h1>Solicita ayuda al equipo de soporte de Nebriacademy</h1>
      <h3>¿Necesitas ayuda con algo? 
        <br />
        Escríbenos y resolveremos tu problema lo antes posible.</h3>
      <form className="form-ayuda" onSubmit={handleSubmit}>
        <p>
          Selecciona qué quieres reportar
          <select
            className="seleccion-report"
            name="tipoReporte"
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            required
          >
            <option value="" disabled hidden></option>
            <option value="Error">Informar de un error</option>
            <option value="Denuncia">Denunciar un contenido</option>
            <option value="Consulta">Hacer una consulta</option>
            <option value="Sugerencia">Hacer una sugerencia</option>
          </select>
        </p>
        <p>
          Describe el problema o mejora
          <br />
          <textarea
            className="descripcion-contenedor"
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </p>
        <p>
          ¿Tienes alguna imagen, video o documento? Adjúntalo para que podamos entender mejor el problema (Máximo 10MB):
          <input 
            className="seleccion-archivo"
            type="file" 
            id="archivoIncidencia"
            onChange={(e) => setArchivo(e.target.files[0])}
          />
        </p>
        <button className="btn-enviar" type="submit" disabled={enviando}>Enviar</button>
      </form>
      {enviando && <span className="text-enviar">Enviando tu reporte a Jira, espera un momento...</span>}
    </div>
  );
}

export default AyudaGrid;
