import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import * as XLSX from "xlsx";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Tanggal: null,
    Barang: null,
    Jumlah: null,
    Total: null,
    Aksi: [null],
  },
];

const formatRupiah = (angka) => {
  if (angka === null || angka === undefined) return "";
  return `Rp${new Intl.NumberFormat("id-ID").format(angka)}`;
};

export default function IndexPage() {
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    navigate("/transaksi-pengeluaran/create");
  };

  const handleUpdate = (pgl_id) => {
    navigate(`/transaksi-pengeluaran/update`, { state: { id: pgl_id } });
  };

  const handleDelete = async (pgl_id) => {
    const result = await SweetAlert(
      "Apakah Anda yakin?",
      "Data pengeluaran ini akan dihapus secara permanen!",
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
              mutation DeletePengeluaran($pgl_id: ID!) {
                deletePengeluaran(pgl_id: $pgl_id)
              }
            `,
            variables: { pgl_id: pgl_id },
          }),
        });

        const resultJson = await response.json();
        if (resultJson.data?.deletePengeluaran) {
          SweetAlert("Sukses", "Data pengeluaran berhasil dihapus", "success");
          fetchData();
        } else if (resultJson.errors) {
          SweetAlert("Error", resultJson.errors[0]?.message || "Gagal menghapus data", "error");
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
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getAllPengeluaran {
                pgl_id
                pgl_tanggal
                pgl_barang
                pgl_jumlah
                pgl_total
              }
            }
          `,
        }),
      });

      const resultJson = await response.json();
      const data = resultJson.data?.getAllPengeluaran;

      if (!data || data.length === 0) {
        setCurrentData(inisialisasiData);
      } else {
        const formattedData = data.map((value, index) => ({
          Key: value.pgl_id,
          No: index + 1,
          Tanggal: value.pgl_tanggal,
          Barang: value.pgl_barang,
          Jumlah: value.pgl_jumlah,
          Total: formatRupiah(value.pgl_total),
          Aksi: ["Delete"],
          Alignment: ["center", "center", "center", "center", "center", "center"],
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
    if (!currentData || currentData.length <= 1 && currentData[0].Key === null) { 
      SweetAlert("Info", "Tidak ada data untuk dicetak!", "info");
      return;
    }

    const dataToExport = currentData.map(({ Key, Aksi, Alignment, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataPengeluaran");

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
    link.setAttribute("download", "DataPengeluaran.xlsx");
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
        <h1 className="text-3xl font-semibold text-blue-900">Data Pengeluaran</h1>
        <div className="flex gap-4">
          <button
            onClick={handleClick}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
          >
            Tambah Pengeluaran
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
        <Table
          data={currentData}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}