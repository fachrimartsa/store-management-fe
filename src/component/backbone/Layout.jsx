import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const usr_name = sessionStorage.getItem("usr_name");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} usr_name={usr_name} />

      {/* Konten utama dan sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="lg:fixed lg:left-0 lg:-mt-16 md:h-full lg:w-auto lg:bg-gray-100 lg:shadow-md z-10">
            <div
              className={`fixed lg:relative lg:translate-x-0 top-0 left-0 h-full w-auto bg-gray-100 shadow-md transition-all duration-300 z-20 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <Sidebar />
            </div>

            {/* Overlay hanya muncul di layar kecil */}
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={toggleSidebar}
            />
          </div>
        )}

        {/* Konten Utama */}
        <div
          className={`flex-grow p-4 transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-56" : "lg:ml-0"
          }`}
        >
          {/* Menampilkan konten berdasarkan route */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
