import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Doctor from "./roles/Doctor";
import Patient from "./roles/Patient";
import Pharmacist from "./roles/Pharmacist";
import Admin from "./roles/Admin";
import Header from "./Header";

const Home = () => {
  const profile = useSelector((state) => state.profile.profile);
  const navigate = useNavigate();

  useEffect(() => {
    // If no profile after 2 seconds, redirect to auth
    const timer = setTimeout(() => {
      if (!profile || !profile.role) {
        console.log("No profile found, redirecting to auth");
        navigate("/auth");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [profile, navigate]);

  const renderRoleComponent = () => {
    if (!profile || !profile.role) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    switch (profile.role) {
      case "Doctor":
        return <Doctor />;
      case "Patient":
        return <Patient />;
      case "Pharmacist":
        return <Pharmacist />;
      case "Admin":
        return <Admin />;
      default:
        return (
          <div className="p-6 text-center">
            <p className="text-red-600">Invalid role: {profile.role}</p>
            <button
              onClick={() => navigate("/auth")}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Back to Login
            </button>
          </div>
        );
    }
  };

  return (
    <div className="container-fluid">
      <div className="home-header">
        <Header />
        {renderRoleComponent()}
      </div>
    </div>
  );
};
export default Home;
