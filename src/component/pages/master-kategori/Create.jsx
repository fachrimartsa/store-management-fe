import React, { useState, useRef } from "react";
import Autocomplete from "../../part/Autocomplete";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import { useNavigate } from "react-router-dom";

const inisialisasiMobil = [
  {
    Key: null,
    No: null,
    Nama: null,
    Status: null,
    Aksi: null,
  },
];

export default function CreateKategori() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
  });
  const [error, setError] = useState("");
  const [mobilList, setMobilList] = useState(inisialisasiMobil);
  const [selectedMobil, setSelectedMobil] = useState(null);
  const autocompleteRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate("/dataKategori");
  }

  const handleAddMobil = () => {
    if (!selectedMobil) {
      setError("Nama mobil harus dipilih");
      return;
    }

    if(mobilList == inisialisasiMobil) {
      mobilList.length = 0;
    }

    const isMobilExists = mobilList.some((mobil) => mobil.Key === selectedMobil.value);

    if (isMobilExists) {
      setError("Mobil ini sudah ada dalam daftar");
      return;
    }

    const newMobil = {
      Key: selectedMobil.value,
      No: mobilList.length + 1,
      Nama: selectedMobil.label,
      Status: "Aktif",        
      Aksi: ["Delete"]          
    };

    setMobilList([...mobilList, newMobil]);
    setSelectedMobil(null); 
    autocompleteRef.current?.resetInput(); 
    setError(""); 
  };

  const handleDeleteMobil = (id) => {
    setMobilList(mobilList.filter((mobil) => mobil.Key !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error sebelum validasi baru
  
    if (!formData.nama) {
      setError("Nama kategori tidak boleh kosong");
      return;
    }
  
    if (mobilList.length < 1) {
      setError("Mobil tidak boleh kurang dari 1");
      return;
    }
  
    try {
      // Kirim request untuk membuat kategori dan mendapatkan ID Kategori
      const kategoriResponse = await UseFetch(
        API_LINK + "MasterKategori/createKategori.php",
        formData,
        "POST"
      );
 
      if (!kategoriResponse.ktg_id) {
        setError("Gagal mendapatkan ID Kategori");
        return;
      }
  
      const idKategori = kategoriResponse.ktg_id;
  
      // Loop melalui mobilList untuk membuat detail kategori
      for (const mobil of mobilList) {
        await UseFetch(
          API_LINK + "MasterKategori/createDetail.php",
          {
            idKategori: idKategori,
            idMobil: mobil.Key, 
          },
          "POST"
        );
      }
  
      // Menampilkan SweetAlert setelah sukses
      swal({
        title: "Berhasil!",
        text: "Kategori dan mobil berhasil ditambahkan!",
        icon: "success",
        button: "OK",
      }).then(() => {
        navigate("/dataKategori"); // Redirect setelah klik OK
      });
  
    } catch (error) {
      swal({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan data",
        icon: "error",
        button: "Coba Lagi",
      });
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        Tambah Data Kategori
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2">Nama Kategori</label>
          <input
            type="text"
            name="nama"
            placeholder="Masukkan Nama Kategori"
            value={formData.nama}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-white mb-2">Nama Mobil</label>
            <Autocomplete
              ref={autocompleteRef}
              placeholder="Cari Mobil..."
              fetchData={async (query) => {
                const data = await UseFetch(API_LINK + "MasterMobil/readMobil.php", {}, "GET");

                const filtered = data.filter((item) =>
                  item.Nama.toLowerCase().includes(query.toLowerCase()) 
                );

                return filtered.map(item => ({
                  label: item.Nama,
                  value: item.Key   
                }));
              }}
              onSelect={(item) => {
                setSelectedMobil(item);  
              }}
              renderLabel={(item) => item.label}
            />
          </div>
          <button
            type="button"
            onClick={handleAddMobil}
            className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 mt-8 rounded-lg text-lg"
          >
            Add
          </button>
        </div>

        <div className="mt-6">
          <Table
            data={mobilList} 
            onDelete={handleDeleteMobil}
          />
        </div>

        <div className="text-center space-x-5 mt-5">
          <button
            type="button"
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-lg text-lg"
            onClick={handleCancel}
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg text-lg"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
