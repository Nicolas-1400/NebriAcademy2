import Nav from "../components/Nav"
import NavProfesor from "../components/NavProfesor"
import Footer from "../components/Footer"
import PerfilGrid from "../components/PerfilGrid"
import PerfilProfesorGrid from "../components/PerfilProfesorGrid"

function Perfil() {
  return (
    <div>
      {localStorage.getItem('tipo') === "profesor" ? <NavProfesor /> : <Nav />}
      {localStorage.getItem('tipo') === "profesor" ? <PerfilProfesorGrid /> : <PerfilGrid />}
      <Footer />
    </div>
  )
}

export default Perfil