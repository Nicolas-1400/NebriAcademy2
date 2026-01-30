import { useEffect, useState } from "react";

function HomeFeed() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioIniciado = localStorage.getItem("usuario");
    if (usuarioIniciado) {
      setUsuario(JSON.parse(usuarioIniciado));
    }
  }, []);
  return (
    <div className="HomeFeed">
      <h1>
        Bienvenido/a{" "}
        {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
      </h1>
      <div className="HomeFeed-secciones">
        <div className="HomeFeed-seccion-tus-cursos">
          <h2>Tus cursos</h2>
          <div className="HomeFeed-tus-cursos-carousel">
            {/* Aquí irían los cursos del usuario */}
          </div>
        </div>
        <div className="HomeFeed-seccion-novedades">
          <h2>Novedades</h2>
          <div className="HomeFeed-novedades-carousel">
            {/* Aquí irían las novedades */}
          </div>
        </div>
        <div className="HomeFeed-seccion-cursos-populares">
          <h2>Cursos populares</h2>
          <div className="HomeFeed-cursos-populares-carousel">
            {/* Aquí irían los cursos populares */}
          </div>
        </div>
        <div className="HomeFeed-seccion-categorias">
          <h2>Categorías</h2>
          <div className="HomeFeed-categorias-carousel">
            {/* Aquí irían las categorías de cursos */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeFeed;
