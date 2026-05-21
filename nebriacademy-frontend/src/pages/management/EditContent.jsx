// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../components/layout/Nav/Nav.jsx";
import EditContentGrid from "../../components/management/EditContentGrid/EditContentGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de edición de contenido existente (vídeo, apunte o ejercicio) de un curso
function EditContent() {
  return (
    <div>
      <Nav />
      <EditContentGrid />
      <Footer />
    </div>
  );
}

export default EditContent;
