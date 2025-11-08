import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const profile = useSelector((state) => state.profile.profile);
  const email = localStorage.getItem("hsp-email-id");
  const password = localStorage.getItem("hsp-password");

  // If no saved credentials and no profile, redirect to auth
  if ((!email || !password) && !profile) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
