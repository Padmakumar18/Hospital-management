import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearProfile } from "../Redux/slice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);

  const signOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("hsp-email-id");
    localStorage.removeItem("hsp-password");
    dispatch(clearProfile());
    navigate("/auth");
  };

  return (
    <div className="patient-header flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold">
          Hello, <span className="font-light">{profile?.name || "User"}</span>
        </h1>
        {profile?.role && (
          <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
            {profile.role}
          </span>
        )}
      </div>

      <div className="text-center flex-1">
        <h2 className="text-2xl font-extrabold tracking-wide drop-shadow-md">
          🏥 CityCare Hospital
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="bg-white text-red-600 px-4 py-2 rounded-lg shadow-md text-sm font-semibold hover:bg-red-100 transition cursor-pointer"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
export default Header;
