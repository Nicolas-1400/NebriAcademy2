// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../components/layout/Nav/Nav.jsx";
import MySpaceGrid from "../../components/catalogs/MySpaceGrid/MySpaceGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página del espacio personal del alumno: cursos en proceso, favoritos y apuntes
function MySpace() {
  return (
    <div>
      <Nav />
      <MySpaceGrid />
      <Footer />
    </div>
  );
}

export default MySpace;
