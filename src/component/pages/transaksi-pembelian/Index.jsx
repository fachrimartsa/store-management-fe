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
    "Nama Barang": null,
    Supplier: null,
    Jumlah: null,
    "Harga Beli": null,
    Total: null,
    Aksi: [null],
  },
];

const formatRupiah = (angka) => {
  if (angka === null || angka === undefined || angka === "") return "";
  const num = typeof angka === 'string' ? parseFloat(angka) : angka;
  return `Rp${new Intl.NumberFormat("id-ID").format(num)}`;
};

export default function IndexPage() {
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    navigate("/transaksi-pembelian/create");
  };

  const handleDelete = async (pbl_id) => {
    const result = await SweetAlert(
      "Apakah Anda yakin?",
      "Data pembelian ini akan dihapus secara permanen!",
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
              mutation DeletePembelian($pbl_id: ID!) {
                deletePembelian(pbl_id: $pbl_id)
              }
            `,
            variables: { pbl_id: pbl_id },
          }),
        });

        const resultJson = await response.json();
        if (resultJson.data?.deletePembelian) {
          SweetAlert("Sukses", "Data berhasil dihapus", "success");
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

    const userCookieString = Cookies.get('user');
    if (!userCookieString) {
      throw new Error("User cookie not found");
    }
    const cookie = JSON.parse(userCookieString);
    const pbl_idUser = parseInt(cookie.usr_id);

    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query getAllPembelian($pbl_idUser: Int!) {
              getAllPembelian(pbl_idUser: $pbl_idUser) {
                pbl_id
                pbl_tanggal
                brg_nama
                sp_nama
                pbl_jumlah
                pbl_harga_beli
                pbl_total
              }
            }
          `,
          variables: {
            pbl_idUser: pbl_idUser
          },
        }),
      });

      const resultJson = await response.json();
      const data = resultJson.data?.getAllPembelian;

      if (!data || data.length === 0) {
        setCurrentData(inisialisasiData);
      } else {
        const formattedData = data.map((value, index) => ({
          Key: value.pbl_id,
          No: index + 1,
          Tanggal: value.pbl_tanggal,
          "Nama Barang": value.brg_nama,
          Supplier: value.sp_nama,
          Jumlah: value.pbl_jumlah,
          "Harga Beli": formatRupiah(value.pbl_harga_beli),
          Total: formatRupiah(value.pbl_total),
          Aksi: ["Delete"],
          Alignment: ["center", "center", "center", "center", "center", "center", "center", "center"],
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataPembelian");

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
    link.setAttribute("download", "DataPembelian.xlsx");
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
        <h1 className="text-3xl font-semibold text-blue-900">Data Pembelian</h1>
        <div className="flex gap-4">
          <button
            onClick={handleClick}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
          >
            Tambah Pembelian
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