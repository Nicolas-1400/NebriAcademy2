// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../../components/layout/Nav/Nav.jsx";
import AllProfessorsGrid from "../../../components/catalogs/Professors/AllProfessorsGrid/AllProfessorsGrid.jsx";
import Footer from "../../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de listado de todos los profesores con buscador y filtro por especialización
function AllProfessors() {
  return (
    <div>
      <Nav />
      <AllProfessorsGrid />
      <Footer />
    </div>
  );
}

export default AllProfessors;
