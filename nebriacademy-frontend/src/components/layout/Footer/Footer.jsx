import Linkedin from "../../../assets/Iconos/linkedin.png";
import Facebook from "../../../assets/Iconos/facebook.png";
import X from "../../../assets/Iconos/X.png";
import Instagram from "../../../assets/Iconos/instagram.png";
import YouTube from "../../../assets/Iconos/youtube.png";

// Footer con los links a las políticas legales y a las redes sociales de la universidad
function Footer() {
  return (
    <div className="footer">
      {/* Links a las páginas legales de la aplicación */}
      <div className="footer-politicas">
        <a href="/Home/Politicas/privacidad">Política de privacidad</a>
        <a href="/Home/Politicas/nota-legal">Nota legal</a>
        <a href="/Home/Politicas/cookies">Política de cookies</a>
      </div>

      {/* Iconos de redes sociales que enlazan a los perfiles oficiales */}
      <div className="footer-redes">
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
