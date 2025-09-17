import Doctor from "./roles/Doctor";
import Patient from "./roles/Patient";
import Pharmacist from "./roles/Pharmacist";
import Admin from "./roles/Admin";
import Auth from "./Auth";
import Header from "./Header";

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="home-header">
        {/* <Header /> */}
        <Doctor />
        <Patient />
        {/* <Pharmacist /> */}
        {/* <Admin /> */}
      </div>
    </div>
  );
};
export default Home;
