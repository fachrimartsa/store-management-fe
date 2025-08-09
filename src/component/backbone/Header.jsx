import { FaBars } from "react-icons/fa";
import logo from '../../assets/logo.jfif';

const Header = ({ toggleSidebar, usr_name }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg flex justify-between items-center p-4 lg:left-64">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition duration-200 ease-in-out lg:hidden"
          aria-label="Toggle sidebar"
        >
          <FaBars className="text-white text-xl" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-3">
        {usr_name && (
          <span className="text-lg font-medium text-gray-300">Welcome, {usr_name}</span>
        )}
        <img
          src={logo}
          alt="User Profile"
          className="w-12 h-12 rounded-full border-2 border-blue-400 object-cover"
        />
      </div>
    </div>
  );
};

export default Header;