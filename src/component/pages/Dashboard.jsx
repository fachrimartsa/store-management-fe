import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { API_LINK } from "../util/Constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [totalStok, setTotalStok] = useState(0);
  const [totalSupplier, setTotalSupplier] = useState(0);
  const [penjualanMonth, setPenjualanMonth] = useState(0);
  const [pengeluaranMonth, setPengeluaranMonth] = useState(0);
  const [pembelianMonth, setPembelianMonth] = useState(0);
  const [profitMonth, setProfitMonth] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTotalStok = async () => {
    setIsError(false);
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getTotalStok
            }
          `,
        }),
      });

      const resultJson = await response.json();
      setTotalStok(resultJson.data.getTotalStok);
    } catch (err) {
      setIsError(true);
      setTotalStok(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalSupplier = async () => {
    setIsError(false);
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getTotalSupplier
            }
          `,
        }),
      });

      const resultJson = await response.json();
      setTotalSupplier(resultJson.data.getTotalSupplier);
    } catch (err) {
      setIsError(true);
      setTotalSupplier(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPenjualanMonth = async () => {
    setIsError(false);
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getPenjualanMonth
            }
          `,
        }),
      });

      const resultJson = await response.json();
      setPenjualanMonth(resultJson.data.getPenjualanMonth);
    } catch (err) {
      setIsError(true);
      setPenjualanMonth(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPengeluaranMonth = async () => {
    setIsError(false);
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getPengeluaranMonth
            }
          `,
        }),
      });

      const resultJson = await response.json();
      setPengeluaranMonth(resultJson.data.getPengeluaranMonth);
    } catch (err) {
      setIsError(true);
      setPengeluaranMonth(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfitMonth = async () => {
    setIsError(false);
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getProfitMonth
            }
          `,
        }),
      });

      const resultJson = await response.json();
      setProfitMonth(resultJson.data.getProfitMonth);
    } catch (err) {
      setIsError(true);
      setProfitMonth(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPembelianMonth = async () => {
    setIsError(false);
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getPembelianMonth
            }
          `,
        }),
      });

      const resultJson = await response.json();
      setPembelianMonth(resultJson.data.getPembelianMonth);
    } catch (err) {
      setIsError(true);
      setPembelianMonth(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalStok();
    fetchTotalSupplier();
    fetchPenjualanMonth();
    fetchPengeluaranMonth();
    fetchPembelianMonth();
    fetchProfitMonth();
  }, []);

  const stats = [
    { label: "Total Barang", value: totalStok, icon: "fas fa-boxes" },
    { label: "Total Supplier", value: totalSupplier, icon: "fas fa-users" },
    { label: "Penjualan Bulan Ini", value: `Rp. ${penjualanMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "fas fa-cash-register" },
    { label: "Pembelian Bulan Ini", value: `Rp. ${pembelianMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,  icon: "fas fa-shopping-cart" },
    { label: "Pengeluaran Bulan Ini", value: `Rp. ${pengeluaranMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,  icon: "fas fa-hand-holding-usd" },
    { label: "Profit Bulan Ini", value: `Rp. ${profitMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "fa fa-dollar" },
  ];

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Penjualan (Juta IDR)",
        data: [120, 135, 110, 160, 145, 170, 155],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performa Penjualan 7 Bulan Terakhir",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10"> {/* Padding dikembalikan di sini */}
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center sm:text-left">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 items-stretch">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex-shrink-0">
              <i className={`${stat.icon} text-5xl text-blue-600`}></i>
            </div>
            <div>
              <p className="text-gray-500 text-lg font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}