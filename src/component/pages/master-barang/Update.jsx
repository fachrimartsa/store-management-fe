import React, { useEffect, useState } from "react";
import Input from "../../part/Input"; // Pastikan ini sudah benar
import DropDown from "../../part/DropDown"; // Impor dropdown yang sudah kamu buat
import { useNavigate } from "react-router-dom";
import UseFetch from "../../util/UseFetch"; 
import { useLocation } from "react-router-dom";
import { API_LINK } from "../../util/Constants";

export default function UpdateBarang() {
  const location = useLocation();
  const navigate = useNavigate();
  const { barangId } = location.state || {};
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [formData, setFormData] = useState({
    id: "",
    namaBarang: "",
    jenisBarang: "",
    hargaBarang: "",
    stokBarang: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Format harga otomatis dengan separator
    if (name === "hargaBarang") {
      value = value.replace(/\D/g, ""); // Hanya angka
      value = new Intl.NumberFormat("id-ID").format(value); // Format ribuan
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate("/dataBarang");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi apakah semua input sudah terisi
    if (!formData.namaBarang || !formData.jenisBarang || !formData.hargaBarang || !formData.stokBarang) {
      setError("Semua kolom harus diisi.");
      return;
    }
  
    setError(""); // Reset error jika tidak ada masalah
  
    const dataUpdate = {
      id: formData.id,
      nama: formData.namaBarang,
      jenis: formData.jenisBarang,
      harga: formData.hargaBarang ? formData.hargaBarang.toString().replace(/\D/g, "") : "0", // Pastikan hanya angka
      stok: formData.stokBarang
    };
  
    try {
      const data = await UseFetch(
        API_LINK + "MasterBarang/updateBarang.php",
        dataUpdate,
        "POST"
      );    
  
      if (data === "ERROR") {
        swal("Oops!", "Terjadi kesalahan saat memperbarui barang.", "error");
      } else {
        swal("Sukses!", "Data barang berhasil diperbarui!", "success");
        navigate("/dataBarang"); 
      }
    } catch (error) {
      swal("Error!", "Terjadi kesalahan pada server.", "error");
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "MasterBarang/getBarangById.php", { id: barangId }, "POST");
        if (data?.message === "Tidak ada barang ditemukan") {
          setIsError(true);
        } else {
          setFormData({
            id: data?.Key || "",
            namaBarang: data?.Nama || "",
            jenisBarang: data?.["Jenis Barang"] || "",
            hargaBarang: data?.Harga || 0,
            stokBarang: data?.Stok || 0,
          });
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [barangId]);
  

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">Tambah Data Barang</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Nama Barang"
          forInput="namaBarang"
          type="text"
          placeholder="Masukkan Nama Barang"
          value={formData.namaBarang}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.namaBarang ? "Nama Barang tidak boleh kosong" : ""}
        />

        <DropDown
          label="Jenis Barang"
          forInput="jenisBarang"
          value={formData.jenisBarang}
          onChange={handleChange}
          isRequired={true}
          arrData={[
            { Value: "original", Text: "Original" },
            { Value: "lokal", Text: "Lokal" },
          ]}
          errorMessage={error && !formData.jenisBarang ? "Jenis Barang harus dipilih" : ""}
        />

        <Input
          label="Harga Barang"
          forInput="hargaBarang"
          type="text"
          placeholder="Masukkan Harga Barang"
          value={formData.hargaBarang}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.hargaBarang ? "Harga Barang tidak boleh kosong" : ""}
        />

        <Input
          label="Stok Barang"
          forInput="stokBarang"
          type="text"
          placeholder="Masukkan Stok Barang"
          value={formData.stokBarang}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.stokBarang ? "Stok Barang tidak boleh kosong" : ""}
        />

        <div className="text-center mt-6">
            <button
              type="button"
              className="bg-red-600 hover:bg-red-400 text-white py-2 px-6 rounded-lg text-lg mx-3"
              onClick={handleCancel}
            >
              Batal
            </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg text-lg mx-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
