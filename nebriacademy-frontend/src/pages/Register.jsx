import { useParams } from "react-router-dom";
import Header from "../components/Header";
import RegisterGrid from "../components/RegisterGrid";

function Register() {
  const { tipo } = useParams();

  return (
    <div>
      <Header />
      <RegisterGrid tipo={tipo} />
    </div>
  );
}

export default Register;
