// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Hom1 from "../../../assets/perfiles/hombre-1.png";
import Hom2 from "../../../assets/perfiles/hombre-2.png";
import Hom3 from "../../../assets/perfiles/hombre-3.png";
import Hom4 from "../../../assets/perfiles/hombre-4.png";
import Hom5 from "../../../assets/perfiles/hombre-5.png";
import Hom6 from "../../../assets/perfiles/hombre-6.png";
import Hom7 from "../../../assets/perfiles/hombre-7.png";
import Hom8 from "../../../assets/perfiles/hombre-8.png";
import Hom9 from "../../../assets/perfiles/hombre-9.png";
import Hom10 from "../../../assets/perfiles/hombre-10.png";
import Hom11 from "../../../assets/perfiles/hombre-11.png";
import Hom12 from "../../../assets/perfiles/hombre-12.png";
import Hom13 from "../../../assets/perfiles/hombre-13.png";
import Hom14 from "../../../assets/perfiles/hombre-14.png";
import Hom15 from "../../../assets/perfiles/hombre-15.png";
import Hom16 from "../../../assets/perfiles/hombre-16.png";
import Muj1 from "../../../assets/perfiles/mujer-1.png";
import Muj2 from "../../../assets/perfiles/mujer-2.png";
import Muj3 from "../../../assets/perfiles/mujer-3.png";
import Muj4 from "../../../assets/perfiles/mujer-4.png";
import Muj5 from "../../../assets/perfiles/mujer-5.png";
import Muj6 from "../../../assets/perfiles/mujer-6.png";
import Muj7 from "../../../assets/perfiles/mujer-7.png";
import Muj8 from "../../../assets/perfiles/mujer-8.png";
import Muj9 from "../../../assets/perfiles/mujer-9.png";
import Muj10 from "../../../assets/perfiles/mujer-10.png";
import Muj11 from "../../../assets/perfiles/mujer-11.png";
import Muj12 from "../../../assets/perfiles/mujer-12.png";
import Muj13 from "../../../assets/perfiles/mujer-13.png";
import Muj14 from "../../../assets/perfiles/mujer-14.png";
import Muj15 from "../../../assets/perfiles/mujer-15.png";
import Muj16 from "../../../assets/perfiles/mujer-16.png";

// ── CONSTANTES ─────────────────────────────────────────────────────────────
// Mapa exportado de nombre de archivo → imagen importada.
// Se usa en toda la app (Nav, PerfilProfesor, TarjetaProfesores, InfoProfesor...) para resolver la imagen de perfil.
export const PERFILES = {
  "hombre-1": Hom1,
  "hombre-2": Hom2,
  "hombre-3": Hom3,
  "hombre-4": Hom4,
  "hombre-5": Hom5,
  "hombre-6": Hom6,
  "hombre-7": Hom7,
  "hombre-8": Hom8,
  "hombre-9": Hom9,
  "hombre-10": Hom10,
  "hombre-11": Hom11,
  "hombre-12": Hom12,
  "hombre-13": Hom13,
  "hombre-14": Hom14,
  "hombre-15": Hom15,
  "hombre-16": Hom16,
  "mujer-1": Muj1,
  "mujer-2": Muj2,
  "mujer-3": Muj3,
  "mujer-4": Muj4,
  "mujer-5": Muj5,
  "mujer-6": Muj6,
  "mujer-7": Muj7,
  "mujer-8": Muj8,
  "mujer-9": Muj9,
  "mujer-10": Muj10,
  "mujer-11": Muj11,
  "mujer-12": Muj12,
  "mujer-13": Muj13,
  "mujer-14": Muj14,
  "mujer-15": Muj15,
  "mujer-16": Muj16,
};

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente que muestra la galería de avatares de perfil para que el usuario elija el suyo
function ProfileImageCard({ imagenSeleccionada, onSelect }) {
  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="grid-imagenes-perfil">
      {Object.entries(PERFILES).map(([nombreArchivo, src]) => (
        <img
          key={nombreArchivo}
          src={src}
          alt={nombreArchivo}
          // La imagen actualmente seleccionada recibe la clase "seleccionada" para resaltarse visualmente
          className={`imagen-opcion ${imagenSeleccionada === nombreArchivo ? "seleccionada" : ""}`}
          onClick={() => onSelect(nombreArchivo)}
        />
      ))}
    </div>
  );
}

export default ProfileImageCard;
