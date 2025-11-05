import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import Cookies from 'js-cookie';

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Nama Barang": null,
    "Kategori": null,
    "Harga Beli": null,
    Stok: null,
    Status: null,
    Aksi: [null],
  },
];

export default function App() {
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleClick = () => {
    navigate("/data-barang/create");
  };

  const handleDelete = async (barangId) => {
    const result = await SweetAlert(
      "Apakah Anda yakin?",
      "Barang ini akan dihapus secara permanen!",
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
              mutation deleteBarang($brg_id: ID!) {
                deleteBarang(brg_id: $brg_id)
              }
            `,
            variables: { brg_id: barangId },
          }),
        });

        const resultJson = await response.json();
        if (resultJson.data?.deleteBarang) {
          SweetAlert("Sukses", "Data berhasil dihapus", "success");
          fetchData();
        } else {
          SweetAlert("Error", "Gagal menghapus data", "error");
        }
      } catch (error) {
        SweetAlert("Error", "Terjadi kesalahan saat menghapus", "error");
      }
    }
  };

  const handleUpdate = (barangId) => {
    navigate(`/data-barang/update`, { state: { id: barangId } });
  };

  const fetchData = async () => {
    setIsError(false);
    try {
      const userCookieString = Cookies.get('user');
      if (!userCookieString) {
        throw new Error("User cookie not found");
      }
      const cookie = JSON.parse(userCookieString);
      const brg_idUser = parseInt(cookie.usr_id);

      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query getAllBarang($brg_idUser: Int!) {
              getAllBarang(brg_idUser: $brg_idUser) {
                brg_id,
                brg_nama,
                brg_kategori,
                brg_harga_beli,
                brg_stok,
                brg_status
              }
            }
          `,
          variables: {
            brg_idUser: brg_idUser,
          },
        }),
      });

      const resultJson = await response.json();
      const data = resultJson.data?.getAllBarang;
      if (!data || data.length === 0) {
        setCurrentData(inisialisasiData);
      } else {
        const formattedData = data.map((value, index) => ({
          Key: value.brg_id,
          No: index + 1,
          "Nama Barang": value.brg_nama,
          "Kategori": value.brg_kategori,
          "Harga Beli": formatRupiah(value.brg_harga_beli),
          Stok: value.brg_stok,
          Status: value.brg_status,
          Aksi: ["Edit", "Delete"],
          Alignment: ["center", "center", "center", "center", "center", "center", "center"],
        }));
        setCurrentData(formattedData);
      }
    } catch (err) {
      setIsError(true);
      setCurrentData(inisialisasiData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600">Memuat data...</div>;
  }

  if (isError) {
    return <div className="text-center p-6 text-red-600">Terjadi kesalahan saat memuat data.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">Data Barang</h1>
        <button
          onClick={handleClick}
          className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Tambah Barang
        </button>
      </div>
      <Table data={currentData} onDelete={(id) => handleDelete(id)} onEdit={(id) => handleUpdate(id)} />
    </div>
  );
}