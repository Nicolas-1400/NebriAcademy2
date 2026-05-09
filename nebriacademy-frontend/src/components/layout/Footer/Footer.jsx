import Linkedin from "../../../assets/Icons/linkedin.png";
import Facebook from "../../../assets/Icons/facebook.png";
import X from "../../../assets/Icons/X.png";
import Instagram from "../../../assets/Icons/instagram.png";
import YouTube from "../../../assets/Icons/youtube.png";

// Footer con los links a las políticas legales y a las redes sociales de la universidad
function Footer() {
  return (
    <div className="footer">
      {/* Links a las páginas legales de la aplicación */}
      <div className="footer-policies">
        <a href="/Home/Policies/privacyPolicy">Política de privacidad</a>
        <a href="/Home/Policies/legalNote">Nota legal</a>
        <a href="/Home/Policies/cookies">Política de cookies</a>
      </div>

      {/* Iconos de redes sociales que enlazan a los perfiles oficiales */}
      <div className="footer-socialmedia">
        <a
          href="https://www.linkedin.com/school/universidad-nebrija/"
          alt="LinkedIn"
        >
          <img src={Linkedin} />
        </a>
        <a href="https://www.facebook.com/nebrijauniversidad" alt="Facebook">
          <img src={Facebook} />
        </a>
        <a href="https://x.com/NEBRIJA" alt="X">
          <img src={X} />
        </a>
        <a
          href="https://www.instagram.com/universidad_nebrija/"
          alt="Instagram"
        >
          <img src={Instagram} />
        </a>
        <a href="https://www.youtube.com/user/Videonebrija" alt="YouTube">
          <img src={YouTube} />
        </a>
      </div>

      <p>Contactanos: +34 914-521-100</p>
      <p>NebriAcademy © 2026</p>
    </div>
  );
}

export default Footer;
