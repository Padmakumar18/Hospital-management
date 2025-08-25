import Doctor from "./roles/Doctor";
import Nurse from "./roles/Nurse";
import Patient from "./roles/Patient";
import Pharmacist from "./roles/Pharmacist";

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="home-header">
        <p>Hello User</p>
        <Doctor />
        <Nurse />
        <Patient />
        <Pharmacist />
      </div>
    </div>
  );
};
export default Home;
