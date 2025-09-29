import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useEffect } from "react";
import Auth from "./components/Auth";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
// import { handleLogin } from "./components/services/AuthService";
import ProtectedRoute from "./components/services/ProtectedRoute";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkSavedCredentials = async () => {
  //     const email = localStorage.getItem("hsp-email-id");
  //     const password = localStorage.getItem("hsp-password");
  //     if (email && password && (await handleLogin(email, password))) {
  //       console.log("Auto-login successful");
  //       navigate("/home", { replace: true });
  //     }
  //   };
  //   checkSavedCredentials();
  // }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default AppWrapper;
