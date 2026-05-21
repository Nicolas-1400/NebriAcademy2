// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../../components/layout/Nav/Nav.jsx";
import ProfessorInfoGrid from "../../../components/catalogs/Professors/ProfessorInfoGrid/ProfessorInfoGrid.jsx";
import Footer from "../../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de detalle de un profesor concreto: datos personales y cursos que imparte
function ProfessorInfo() {
  return (
    <div>
      <Nav />
      <ProfessorInfoGrid />
      <Footer />
    </div>
  );
}

export default ProfessorInfo;
