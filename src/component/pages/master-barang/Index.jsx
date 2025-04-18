import React, { useEffect, useState } from "react";
import Table from "../../part/Table";
import { useNavigate } from "react-router-dom";
import { API_LINK } from "../../util/Constants";
import  UseFetch  from "../../util/UseFetch";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Nama: null,
    Jenis: null,
    Harga: null,
    Stok: null,
    Status: null,
    Aksi: null,
  },
];

export default function IndexPage() {
  const navigate = useNavigate();
  const [currentData,setCurrentData] = useState(inisialisasiData);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    navigate("/dataBarang/create"); 
  };

  const handleUpdate = (barangId) => {
    navigate("/dataBarang/update", { state: { barangId } });
  }; 

  const handleDelete = (barangId) => {
    swal({
      title: "Apakah Anda yakin?",
      text: "Barang ini akan dihapus secara permanen!",
      icon: "warning",
      buttons: ["Batal", "Yakin"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const data = await UseFetch(
            API_LINK + "MasterBarang/deleteBarang.php",
            { id: barangId }, 
            "POST"
          );
  
          if (data === "ERROR") {
            throw new Error("Gagal menghapus data");
          }
  
          swal("Sukses", "Data berhasil dihapus", "success");
          fetchData();
  
        } catch (error) {
          swal("Error", "Terjadi kesalahan saat menghapus", "error");
          console.error(error);
        }
      }
    });
  };

  const fetchData = async () => {
    setIsError(false);
    try {
      const data = await UseFetch(API_LINK + "MasterBarang/readBarang.php", {}, "GET");

      if (data === "ERROR") {
        setIsError(true);
      } else if (data.length === 0) {
        setCurrentData(inisialisasiData);
      } else {
        const formattedData = data.map((value) => ({
          ...value,
          Aksi: ["Edit","Delete"],
          Alignment: ["center", "center", "center", "center", "center", "center", "center", "center"],
        }));
        setCurrentData(formattedData);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">Data Barang</h1>
        <button 
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Tambah Barang
        </button>
      </div>
      <Table 
      data={currentData}
      onDelete={handleDelete}
      onEdit={handleUpdate} />
    </div>
  );
}
