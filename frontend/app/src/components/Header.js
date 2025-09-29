import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const profileFromStore = useSelector((state) => state.profile.profile);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    console.log("Profile from store:", profileFromStore);
    setProfile(profileFromStore);
  }, [profileFromStore]);

  const signOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("hsp-email-id");
    localStorage.removeItem("hsp-password");
    navigate("/auth");
  };
  return (
    <div className="patient-header flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold">
          {/* Hello, <span className="font-light">{profile.name}</span> */}
          Hello, <span className="font-light">Hello</span>
        </h1>
      </div>

      <div className="text-center flex-1">
        <h2 className="text-2xl font-extrabold tracking-wide drop-shadow-md">
          🏥 CityCare Hospital
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* <button className="bg-white text-blue-600 px-4 py-1 rounded-lg shadow-md text-sm font-semibold hover:bg-blue-100 transition cursor-pointer">
          Profile
        </button> */}
        <button
          className="bg-white text-red-600 px-4 py-1 rounded-sm shadow-md text-sm font-semibold hover:bg-red-100 transition cursor-pointer"
          onClick={(e) => {
            signOut(e);
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
export default Home;
