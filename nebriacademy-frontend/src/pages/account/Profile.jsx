// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../components/layout/Nav/Nav.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import ProfileGrid from "../../components/account/ProfileGrid/ProfileGrid.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de perfil de usuario: visualización y edición de datos personales
function Profile() {
  return (
    <div>
      <Nav />
      <ProfileGrid />
      <Footer />
    </div>
  );
}

export default Profile;
