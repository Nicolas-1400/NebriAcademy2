// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../components/layout/Nav/Nav.jsx";
import AddCourseGrid from "../../components/management/AddCourseGrid/AddCourseGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de creación de un nuevo curso (solo profesores)
function AddCourse() {
  return (
    <div>
      <Nav />
      <AddCourseGrid />
      <Footer />
    </div>
  );
}

export default AddCourse;
