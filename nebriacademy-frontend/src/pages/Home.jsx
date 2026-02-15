import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HomeFeed from "../components/HomeFeed";
import HomeProfesorGrid from "../components/HomeProfesorGrid";
import useAuthStore from "../store/useAuthStore";

/**
 * Página principal de la aplicación
 * Muestra diferentes contenidos según el tipo de usuario (profesor o alumno)
 */
function Home() {
  return (
    <div>
      <Nav />
      {/* Renderizar vista de profesor o alumno según el tipo de usuario */}
      {useAuthStore((state) => state.tipo) === "profesor" ? (
        <HomeProfesorGrid />
      ) : (
        <HomeFeed />
      )}
      <Footer />
    </div>
  );
}

export default Home;
