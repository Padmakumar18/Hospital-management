import Doctor from "./roles/Doctor";
import Nurse from "./roles/Nurse";
import Patient from "./roles/Patient";
import Pharmacist from "./roles/Pharmacist";
import Admin from "./roles/Admin";

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="home-header">
        <Doctor />
        {/* <Nurse />
        <Patient />
        <Pharmacist />
        <Admin /> */}
      </div>
    </div>
  );
};
export default Home;
