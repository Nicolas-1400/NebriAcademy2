// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useParams } from "react-router-dom";
import Nav from "../../components/layout/Nav/Nav.jsx";
import AddContentGrid from "../../components/management/AddContentGrid/AddContentGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de subida de contenido (vídeo, apunte o ejercicio) a un curso
function AddContent() {
  const { tipo, id } = useParams();

  return (
    <div>
      <Nav />
      <AddContentGrid tipo={tipo} idCurso={id} />
      <Footer />
    </div>
  );
}

export default AddContent;
