import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PerfilGrid from "../components/PerfilGrid";
import PerfilProfesorGrid from "../components/PerfilProfesorGrid";
import useAuthStore from "../store/useAuthStore";

function Perfil() {
  return (
    <div>
      <Nav />
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
