import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import RegisterGrid from "../../components/auth/RegisterGrid";

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
