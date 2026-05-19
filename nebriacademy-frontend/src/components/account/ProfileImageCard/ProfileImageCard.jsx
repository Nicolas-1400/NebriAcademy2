// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Male1 from "../../../assets/profiles/male-1.png";
import Male2 from "../../../assets/profiles/male-2.png";
import Male3 from "../../../assets/profiles/male-3.png";
import Male4 from "../../../assets/profiles/male-4.png";
import Male5 from "../../../assets/profiles/male-5.png";
import Male6 from "../../../assets/profiles/male-6.png";
import Male7 from "../../../assets/profiles/male-7.png";
import Male8 from "../../../assets/profiles/male-8.png";
import Male9 from "../../../assets/profiles/male-9.png";
import Male10 from "../../../assets/profiles/male-10.png";
import Male11 from "../../../assets/profiles/male-11.png";
import Male12 from "../../../assets/profiles/male-12.png";
import Male13 from "../../../assets/profiles/male-13.png";
import Male14 from "../../../assets/profiles/male-14.png";
import Male15 from "../../../assets/profiles/male-15.png";
import Male16 from "../../../assets/profiles/male-16.png";
import Female1 from "../../../assets/profiles/female-1.png";
import Female2 from "../../../assets/profiles/female-2.png";
import Female3 from "../../../assets/profiles/female-3.png";
import Female4 from "../../../assets/profiles/female-4.png";
import Female5 from "../../../assets/profiles/female-5.png";
import Female6 from "../../../assets/profiles/female-6.png";
import Female7 from "../../../assets/profiles/female-7.png";
import Female8 from "../../../assets/profiles/female-8.png";
import Female9 from "../../../assets/profiles/female-9.png";
import Female10 from "../../../assets/profiles/female-10.png";
import Female11 from "../../../assets/profiles/female-11.png";
import Female12 from "../../../assets/profiles/female-12.png";
import Female13 from "../../../assets/profiles/female-13.png";
import Female14 from "../../../assets/profiles/female-14.png";
import Female15 from "../../../assets/profiles/female-15.png";
import Female16 from "../../../assets/profiles/female-16.png";
import "./ProfileImageCard.css";

// ── CONSTANTES ──────────────────────────────────────────────────────────────
// Mapa clave→imagen usado para resolver avatares en la app (claves coinciden con BD)
export const PERFILES = {
  "male-1": Male1,
  "male-2": Male2,
  "male-3": Male3,
  "male-4": Male4,
  "male-5": Male5,
  "male-6": Male6,
  "male-7": Male7,
  "male-8": Male8,
  "male-9": Male9,
  "male-10": Male10,
  "male-11": Male11,
  "male-12": Male12,
  "male-13": Male13,
  "male-14": Male14,
  "male-15": Male15,
  "male-16": Male16,
  "female-1": Female1,
  "female-2": Female2,
  "female-3": Female3,
  "female-4": Female4,
  "female-5": Female5,
  "female-6": Female6,
  "female-7": Female7,
  "female-8": Female8,
  "female-9": Female9,
  "female-10": Female10,
  "female-11": Female11,
  "female-12": Female12,
  "female-13": Female13,
  "female-14": Female14,
  "female-15": Female15,
  "female-16": Female16,
};

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Galería de avatares; hace `onSelect(nombre)` al elegir uno
function ProfileImageCard({ imagenSeleccionada, onSelect }) {
  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="profile-image-grid">
      {Object.entries(PERFILES).map(([nombreArchivo, src]) => (
        <img
          key={nombreArchivo}
          src={src}
          alt={nombreArchivo}
          // La imagen actualmente seleccionada recibe la clase "selected" para resaltarse visualmente
          className={`avatar-option ${imagenSeleccionada === nombreArchivo ? "selected" : ""}`}
          onClick={() => onSelect(nombreArchivo)}
        />
      ))}
    </div>
  );
}

export default ProfileImageCard;
