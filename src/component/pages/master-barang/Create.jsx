import DropDown from "../../part/Dropdown.jsx"; // Impor dropdown yang sudah kamu buat
import React, { useState } from "react";
import Input from "../../part/Input"; 
import  UseFetch  from "../../util/UseFetch";
import { API_LINK } from "../../util/Constants";
import { useNavigate } from "react-router-dom";


export default function CreateBarang() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaBarang: "",
    jenisBarang: "",
    hargaBarang: "",
    stokBarang: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;

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
  
    // Validasi input
    if (!formData.namaBarang || !formData.jenisBarang || !formData.hargaBarang || !formData.stokBarang) {
      setError("Semua kolom harus diisi.");
      return;
    }
  
    setError("");
  
    const harga = parseFloat(formData.hargaBarang.replace(/\D/g, ""));
  
    const stok = parseInt(formData.stokBarang, 10);
  
    const formDataToSubmit = {
      nama: formData.namaBarang,
      jenis: formData.jenisBarang,
      harga: harga,
      stok: stok
    };
  
    const data = await UseFetch(
      API_LINK + "MasterBarang/createBarang.php",
      formDataToSubmit,
      "POST"
    );
    console.log(data);
  
    if (data === "ERROR") {
      swal("Oops!", "Terjadi kesalahan saat menambahkan barang.", "error");
    } else {
      swal("Sukses!", "Barang berhasil ditambahkan!", "success");
      setFormData({
        namaBarang: "",
        jenisBarang: "",
        hargaBarang: "",
        stokBarang: ""
      });
      navigate("/dataBarang");  // Ganti ke halaman yang sesuai
    }
  };
  

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
          type="number"
          placeholder="Masukkan Stok Barang"
          value={formData.stokBarang}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.stokBarang ? "Harga Barang tidak boleh kosong" : ""}
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
