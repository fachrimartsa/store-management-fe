import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Nama Supplier": null,
    Alamat: null,
    "No Telepon": null,
    Aksi: [null],
  },
];

export default function IndexPage() {
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    navigate("/data-supplier/create");
  };

  const handleDelete = async (supplierId) => {
    const result = await SweetAlert(
      "Apakah Anda yakin?",
      "Supplier ini akan dihapus secara permanen!",
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
              mutation deleteSupplier($sp_id: ID!) {
                deleteSupplier(sp_id: $sp_id)
              }
            `,
            variables: { sp_id: supplierId },
          }),
        });

        const resultJson = await response.json();
        if (resultJson.data?.deleteSupplier) {
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

   const handleUpdate = (supplierId) => {
    navigate(`/data-supplier/update`, { state: { id: supplierId } });
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
              getAllSuppliers {
                sp_id,
                sp_nama,
                sp_contact,
                sp_kategori,
                sp_alamat
              }
            }
          `,
        }),
      });

      const resultJson = await response.json();
      const data = resultJson.data?.getAllSuppliers;
      if (!data || data.length === 0) {
        setCurrentData(inisialisasiData);
      } else {
        const formattedData = data.map((value, index) => ({
          Key: value.sp_id,
          No: index + 1,
          "Nama Supplier": value.sp_nama,
          "Kontak": value.sp_contact,
          "Kategori": value.sp_kategori,
          Alamat: value.sp_alamat,
          Aksi: ["Edit", "Delete"],
          Alignment: ["center", "center", "center", "center", "center", "center"],
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
        <h1 className="text-3xl font-semibold text-blue-900">Data Supplier</h1>
        <button
          onClick={handleClick}
          className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Tambah Supplier
        </button>
      </div>
      <Table data={currentData} onDelete={(id) => handleDelete(id)} onEdit={(id) => handleUpdate(id)} />
    </div>
  );
}