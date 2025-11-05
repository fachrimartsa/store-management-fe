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
import { useNavigate } from "react-router-dom";
import { API_LINK } from "../util/Constants";
import Cookies from 'js-cookie';

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
  const [penjualanMonth, setPenjualanMonth] = useState(0);
  const [pengeluaranMonth, setPengeluaranMonth] = useState(0);
  const [pembelianMonth, setPembelianMonth] = useState(0);
  const [profitMonth, setProfitMonth] = useState(0);
  const [penarikanMonth, setPenarikanMonth] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userCookieString = Cookies.get('user');
  const userCookie = userCookieString ? JSON.parse(userCookieString) : null;
  const idUser = userCookie ? parseInt(userCookie.usr_id) : null;

  useEffect(() => {
    if (!idUser) {
      setIsError(true);
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const queries = [
          {
            query: `query getTotalStok($brg_idUser: Int!) { getTotalStok(brg_idUser: $brg_idUser) }`,
            variables: { brg_idUser: idUser },
          },
          {
            query: `query getPenarikanMonth($pnr_idUser: Int!) { getPenarikanMonth(pnr_idUser: $pnr_idUser) }`,
            variables: { pnr_idUser: idUser },
          },
          {
            query: `query getPenjualanMonth($pjl_idUser: Int!) { getPenjualanMonth(pjl_idUser: $pjl_idUser) }`,
            variables: { pjl_idUser: idUser },
          },
          {
            query: `query getPengeluaranMonth($pgl_idUser: Int!) { getPengeluaranMonth(pgl_idUser: $pgl_idUser) }`,
            variables: { pgl_idUser: idUser },
          },
          {
            query: `query getPembelianMonth($pbl_idUser: Int!) { getPembelianMonth(pbl_idUser: $pbl_idUser) }`,
            variables: { pbl_idUser: idUser },
          },
          {
            query: `query getProfitMonth($pjl_idUser: Int!) { getProfitMonth(pjl_idUser: $pjl_idUser) }`,
            variables: { pjl_idUser: idUser },
          },
        ];

        const fetchPromises = queries.map(({ query, variables }) =>
          fetch(API_LINK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables }),
          }).then(res => res.json())
        );

        const [
          totalStokRes,
          penarikanRes,
          penjualanMonthRes,
          pengeluaranMonthRes,
          pembelianMonthRes,
          profitMonthRes,
        ] = await Promise.all(fetchPromises);

        setTotalStok(totalStokRes.data.getTotalStok || 0);
        setPenarikanMonth(penarikanRes.data.getPenarikanMonth || 0);
        setPenjualanMonth(penjualanMonthRes.data.getPenjualanMonth || 0);
        setPengeluaranMonth(pengeluaranMonthRes.data.getPengeluaranMonth || 0);
        setPembelianMonth(pembelianMonthRes.data.getPembelianMonth || 0);
        setProfitMonth(profitMonthRes.data.getProfitMonth || 0);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idUser]);

  const stats = [
    { label: "Total Barang", value: totalStok, icon: "fas fa-boxes" },
    { label: "Penarikan Bulan Ini", value: `Rp. ${penarikanMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "fas fa-wallet" },
    { label: "Penjualan Bulan Ini", value: `Rp. ${penjualanMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "fas fa-cash-register" },
    { label: "Pembelian Bulan Ini", value: `Rp. ${pembelianMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "fas fa-shopping-cart" },
    { label: "Pengeluaran Bulan Ini", value: `Rp. ${pengeluaranMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "fas fa-hand-holding-usd" },
    { label: "Profit Sementara", value: `Rp. ${profitMonth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "fa fa-dollar" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center sm:text-left">Dashboard Overview</h2>
      
      {isLoading ? (
        <div className="text-center text-gray-500 text-xl">Loading...</div>
      ) : isError ? (
        <div className="text-center text-red-500 text-xl">Terjadi kesalahan saat memuat data.</div>
      ) : (
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
      )}
    </div>
  );
}