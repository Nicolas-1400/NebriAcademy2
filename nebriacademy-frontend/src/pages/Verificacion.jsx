import { useParams } from "react-router-dom";
import Header from "../components/Header";
import VerificacionGrid from "../components/VerificacionCuentaGrid.jsx";

function Verificacion() {
  const { tipo } = useParams();
  return (
    <div>
      <Header />
      <VerificacionGrid tipo={tipo}/>
    </div>
  );
}

export default Verificacion;
