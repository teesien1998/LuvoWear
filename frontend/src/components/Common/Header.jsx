import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="border-b shadow-md sticky top-0 z-50 bg-white">
      <Topbar />
      <Navbar />
    </header>
  );
};

export default Header;
