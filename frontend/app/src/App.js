import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Auth from "./components/Auth";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import { handleLogin } from "./components/services/AuthService";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const email = localStorage.getItem("hsp-email-id");
    const password = localStorage.getItem("hsp-password");
    if (email && password && handleLogin(email, password)) {
      return <Navigate to="/login" replace />;
    }
  });
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
      {/* <Auth />
      <Profile />
      <Home /> */}
    </div>
  );
}

export default App;
