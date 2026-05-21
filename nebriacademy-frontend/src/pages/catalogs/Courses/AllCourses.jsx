// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Footer from "../../../components/layout/Footer/Footer.jsx";
import Nav from "../../../components/layout/Nav/Nav.jsx";
import AllCoursesGrid from "../../../components/catalogs/Courses/AllCoursesGrid/AllCoursesGrid.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de catálogo de cursos con búsqueda y filtros
function AllCourses() {
  return (
    <div>
      <Nav />
      <AllCoursesGrid />
      <Footer />
    </div>
  );
}

export default AllCourses;
