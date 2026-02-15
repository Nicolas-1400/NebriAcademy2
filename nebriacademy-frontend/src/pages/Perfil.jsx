import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PerfilGrid from "../components/PerfilGrid";
import PerfilProfesorGrid from "../components/PerfilProfesorGrid";
import useAuthStore from "../store/useAuthStore";

/**
 * Página de perfil de usuario
 * Muestra diferentes vistas según el tipo de usuario (profesor o alumno)
 */
function Perfil() {
  return (
    <div>
      <Nav />
      {/* Renderizar perfil de profesor o alumno según el tipo de usuario */}
      {useAuthStore((state) => state.tipo) === "profesor" ? (
        <PerfilProfesorGrid />
      ) : (
        <PerfilGrid />
      )}
      <Footer />
    </div>
  );
}

export default Perfil;
