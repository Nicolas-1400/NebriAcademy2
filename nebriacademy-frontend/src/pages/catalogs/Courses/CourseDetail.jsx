// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../../components/layout/Nav/Nav.jsx";
import CourseGrid from "../../../components/catalogs/Courses/CourseGrid/CourseGrid.jsx";
import Footer from "../../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de detalle de un curso concreto
function CourseDetail() {
  return (
    <div>
      <Nav />
      <CourseGrid />
      <Footer />
    </div>
  );
}

export default CourseDetail;
