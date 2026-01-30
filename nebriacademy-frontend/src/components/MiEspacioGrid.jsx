import { useEffect, useState } from "react";

function MiEspacioGrid() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioIniciado = localStorage.getItem("usuario");
    if (usuarioIniciado) {
      setUsuario(JSON.parse(usuarioIniciado));
    }
  }, []);
  return (
    <div>
      <h1>
        Tu espacio{" "}
        {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
      </h1>
      <div className="MiEspacio-secciones">
        <div className="MiEspacio-seccion-cursos-proceso">
          <h2>Cursos en proceso</h2>
          <div className="MiEspacio-cursos-proceso-carousel">
            {/* Aquí irían los cursos en proceso del usuario */}
          </div>
        </div>
        <div className="MiEspacio-seccion-cursos-favoritos">
            <h2>Cursos favoritos</h2>
            <div className="MiEspacio-cursos-favoritos-carousel">
              {/* Aquí irían los cursos favoritos del usuario */}
            </div>
        </div>
        <div className="MiEspacio-seccion-tus-apuntes">
          <h2>Tus apuntes</h2>
          <div className="MiEspacio-tus-apuntes-carousel">
            {/* Aquí irían los apuntes del usuario */}
          </div>
        </div>
        <div className="MiEspacio-seccion-apuntes-guardados">
          <h2>Apuntes guardados</h2>
          <div className="MiEspacio-apuntes-guardados-carousel">
            {/* Aquí irían los apuntes guardados del usuario */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiEspacioGrid;
