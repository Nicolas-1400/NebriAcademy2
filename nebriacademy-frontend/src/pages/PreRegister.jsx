import Header from "../components/Header";
import PreRegisterGrid from "../components/PreRegisterGrid";

/**
 * Página de pre-registro
 * Permite al usuario elegir el tipo de registro (alumno Nebrija, alumno externo o profesor)
 */
function PreRegister() {
  return (
    <div>
      <Header />
      <PreRegisterGrid />
    </div>
  );
}

export default PreRegister;
