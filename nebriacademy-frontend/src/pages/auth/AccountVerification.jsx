import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header/Header.jsx";
import AccountVerificationGrid from "../../components/auth/AccountVerificationGrid/AccountVerificationGrid.jsx";

function AccountVerification() {
  const { tipo } = useParams();
  return (
    <div>
      <Header />
      <AccountVerificationGrid tipo={tipo} />
    </div>
  );
}

export default AccountVerification;
