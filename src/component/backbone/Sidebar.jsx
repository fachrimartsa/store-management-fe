import React from "react";
import { Link } from "react-router-dom"; // Import Link dari React Router

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white p-5 shadow-lg rounded-r-lg min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold tracking-wide">My Dashboard</h2>
      </div>
      <ul className="space-y-6">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center text-lg font-medium text-white hover:text-blue-300 transition duration-200 ease-in-out"
          >
            <i className="fas fa-tachometer-alt mr-5 text-2xl"></i>
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/dataMekanik"
            className="flex items-center text-lg font-medium text-white hover:text-blue-300 transition duration-200 ease-in-out"
          >
            <i className="fas fa-user-cog mr-5 text-2xl"></i>
            Data Mekanik
          </Link>
        </li>

        <li>
          <Link
            to="/dataBarang"
            className="flex items-center text-lg font-medium text-white hover:text-blue-300 transition duration-200 ease-in-out"
          >
            <i className="fas fa-cogs mr-5 text-2xl"></i>
            Data Barang
          </Link>
        </li>

        <li>
          <Link
            to="/dataJenisServis"
            className="flex items-center text-lg font-medium text-white hover:text-blue-300 transition duration-200 ease-in-out"
          >
            <i className="fas fa-tools mr-5 text-2xl"></i>
            Data Jenis Servis
          </Link>
        </li>

        <li>
          <Link
            to="/dataKategori"
            className="flex items-center text-lg font-medium text-white hover:text-blue-300 transition duration-200 ease-in-out"
          >
            <i className="fas fa-tags mr-5 text-2xl"></i>
            Data Kategori Mobil
          </Link>
        </li>

        <li>
          <Link
            to="/dataMobil"
            className="flex items-center text-lg font-medium text-white hover:text-blue-300 transition duration-200 ease-in-out"
          >
            <i className="fas fa-car mr-5 text-2xl"></i>
            Data Mobil
          </Link>
        </li>

        <li>
          <Link
            to="/transaksiServis"
            className="flex items-center text-lg font-medium text-white hover:text-blue-300 transition duration-200 ease-in-out"
          >
            <i className="fas fa-screwdriver-wrench mr-5 text-2xl"></i>
            Transaksi Servis
          </Link>
        </li>
      </ul>
        <li className="mt-64 list-none">
          <Link
            to="/login"
            className="flex items-center text-lg font-medium text-white hover:text-blue-300 transition duration-200 ease-in-out"
          >
            <i className="fas fa-sign-out-alt mr-5 text-2xl"></i>
            Logout
          </Link>
        </li>
    </div>
  );
}
