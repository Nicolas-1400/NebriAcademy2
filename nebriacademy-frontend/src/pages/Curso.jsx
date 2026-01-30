import Nav from "../components/Nav"
import NavProfesor from "../components/NavProfesor"
import CursoGrid from "../components/CursoGrid"
import CursoProfesorGrid from "../components/CursoProfesorGrid"
import Footer from "../components/Footer"

function Curso() {
  return (
    <div>
      {localStorage.getItem("tipo") === "profesor" ? <NavProfesor /> : <Nav />}
      {localStorage.getItem("tipo") === "profesor" ? <CursoProfesorGrid /> : <CursoGrid />}
      <Footer />
    </div>
  )
}

export default Curso