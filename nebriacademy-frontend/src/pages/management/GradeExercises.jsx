// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../components/layout/Nav/Nav.jsx";
import GradeExercisesGrid from "../../components/management/GradeExercisesGrid/GradeExercisesGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de corrección de entregas de un ejercicio (profesor/administrador)
function GradeExercises() {
  return (
    <div>
      <Nav />
      <GradeExercisesGrid />
      <Footer />
    </div>
  );
}

export default GradeExercises;
