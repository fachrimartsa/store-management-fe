import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white p-5 shadow-xl transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-64`} 
      >
        <div className="flex justify-between items-center mb-10 lg:block">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-blue-400">Inventory App</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-white hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
            aria-label="Close sidebar"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out group"
              onClick={toggleSidebar}
            >
              <i className="fas fa-tachometer-alt mr-4 text-xl group-hover:text-blue-200"></i>
              Dashboard
            </Link>
          </li>

          <li className="pt-4 border-t border-gray-700">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2 px-3">Data Master</span>
            <ul>
              <li>
                <Link
                  to="/data-supplier"
                  className="flex items-center p-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out group"
                  onClick={toggleSidebar}
                >
                  <i className="fas fa-users mr-4 text-xl group-hover:text-blue-200"></i>
                  Data Supplier
                </Link>
              </li>
              <li>
                <Link
                  to="/data-barang"
                  className="flex items-center p-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out group"
                  onClick={toggleSidebar}
                >
                  <i className="fas fa-boxes mr-4 text-xl group-hover:text-blue-200"></i>
                  Data Barang
                </Link>
              </li>
            </ul>
          </li>

          <li className="pt-4 border-t border-gray-700">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2 px-3">Transaksi</span>
            <ul>
              <li>
                <Link
                  to="/transaksi-pengeluaran"
                  className="flex items-center p-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out group"
                  onClick={toggleSidebar}
                >
                  <i className="fas fa-hand-holding-usd mr-4 text-xl group-hover:text-blue-200"></i>
                  Transaksi Pengeluaran
                </Link>
              </li>
              <li>
                <Link
                  to="/transaksi-pembelian"
                  className="flex items-center p-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out group"
                  onClick={toggleSidebar}
                >
                  <i className="fas fa-shopping-cart mr-4 text-xl group-hover:text-blue-200"></i>
                  Transaksi Pembelian
                </Link>
              </li>
              <li>
                <Link
                  to="/transaksi-penjualan"
                  className="flex items-center p-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out group"
                  onClick={toggleSidebar}
                >
                  <i className="fas fa-cash-register mr-4 text-xl group-hover:text-blue-200"></i>
                  Transaksi Penjualan
                </Link>
              </li>
            </ul>
          </li>
        </ul>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <Link
            to="/login"
            className="flex items-center p-3 rounded-lg text-lg font-medium text-red-400 hover:bg-red-700 hover:text-white transition duration-200 ease-in-out group"
            onClick={toggleSidebar}
          >
            <i className="fas fa-sign-out-alt mr-4 text-xl group-hover:text-white"></i>
            Logout
          </Link>
        </div>
      </div>
    </>
  );
}