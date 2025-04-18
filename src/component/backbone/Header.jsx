import { FaBars } from "react-icons/fa";
import mjl from "../../assets/mjl.jfif"

const Header = ({ toggleSidebar, usr_name }) => {
  return (
    <div className="sticky top-0 z-20 bg-blue-900 text-white shadow-lg flex justify-between items-center p-4">
      {/* Tombol Hamburger */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-blue-800 hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          <FaBars className="text-white text-xl" />
        </button>
        <h1 className="text-2xl font-semibold tracking-wide">Dashboard</h1>
      </div>

      {/* Pencarian dan Profil */}
      <div className="flex items-center space-x-2">
        {/* Nama Pengguna */}
        {usr_name && (
          <span className="text-lg font-semibold text-white mr-2">{usr_name}</span>
        )}
        {/* Gambar Profil */}
        <img
          className="w-12 h-12 rounded-full border-2 border-white"
          src={mjl}
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default Header;
