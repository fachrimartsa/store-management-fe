import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import * as XLSX from "xlsx";
import Cookies from 'js-cookie';

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Tanggal: null,
    Platform: null,
    Telephone: null,
    Total: null,
    Profit: null,
    Aksi: [null],
  },
];

const formatRupiah = (angka) => {
  if (angka === null || angka === undefined || isNaN(angka)) return "";
  const num = typeof angka === "string" ? parseFloat(angka) : angka;
  return `Rp${new Intl.NumberFormat("id-ID").format(num)}`;
};

export default function Index() {
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    navigate("/transaksi-penjualan/create");
  };

  const handleDelete = async (pjl_id) => {
    const result = await SweetAlert(
      "Apakah Anda yakin?",
      "Data penjualan ini akan dihapus secara permanen!",
      "warning",
      "Hapus"
    );
    if (result) {
      try {
        const response = await fetch(API_LINK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation DeletePenjualan($pjl_id: ID!) {
                deletePenjualan(pjl_id: $pjl_id)
              }
            `,
            variables: { pjl_id: pjl_id },
          }),
        });
        const resultJson = await response.json();
        if (resultJson.data?.deletePenjualan) {
          SweetAlert("Sukses", "Data penjualan berhasil dihapus", "success");
          fetchData();
        } else if (resultJson.errors) {
          SweetAlert(
            "Error",
            resultJson.errors[0]?.message || "Gagal menghapus data",
            "error"
          );
        } else {
          SweetAlert("Error", "Gagal menghapus data", "error");
        }
      } catch (error) {
        SweetAlert("Error", "Terjadi kesalahan saat menghapus", "error");
      }
    }
  };

  const fetchData = async () => {
    setIsError(false);

    const userCookieString = Cookies.get('user');
    if (!userCookieString) {
      throw new Error("User cookie not found");
    }
    const cookie = JSON.parse(userCookieString);
    const pjl_idUser = parseInt(cookie.usr_id);

    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query getAllPenjualan($pjl_idUser: Int!) {
              getAllPenjualan(pjl_idUser: $pjl_idUser) {
                pjl_id
                pjl_tanggal
                pjl_platform
                pjl_telephone
                pjl_total
                pjl_profit
              }
            }
          `,
          variables: {
            pjl_idUser: pjl_idUser,
          },
        }),
      });
      const resultJson = await response.json();
      const data = resultJson.data?.getAllPenjualan;
      if (!data || data.length === 0) {
        setCurrentData(inisialisasiData);
      } else {
        const formattedData = data.map((value, index) => ({
          Key: value.pjl_id,
          No: index + 1,
          Tanggal: value.pjl_tanggal,
          Platform: value.pjl_platform,
          Telephone: value.pjl_telephone,
          Total: formatRupiah(value.pjl_total),
          Profit: formatRupiah(value.pjl_profit),
          Aksi: ["Delete"],
          Alignment: [
            "center",
            "center",
            "center",
            "center",
            "center",
            "center",
            "center",
            "center",
          ],
        }));
        setCurrentData(formattedData);
      }
    } catch (err) {
      setIsError(true);
      setCurrentData(inisialisasiData);
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCetak = () => {
    if (!currentData || (currentData.length === 1 && currentData[0].Key === null)) {
      SweetAlert("Info", "Tidak ada data untuk dicetak!", "info");
      return;
    }
    const dataToExport = currentData.map(({ Key, Aksi, Alignment, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataPenjualan");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "DataPenjualan.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600">Memuat data...</div>;
  }

  if (isError) {
    return <div className="text-center p-6 text-red-600">Terjadi kesalahan saat memuat data.</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">Data Penjualan</h1>
        <div className="flex gap-4">
          <button
            onClick={handleClick}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
          >
            Tambah Penjualan
          </button>
          <button
            onClick={handleCetak}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Export Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-xl">
        <Table data={currentData} onDelete={handleDelete}  />
      </div>
    </div>
  );
}
