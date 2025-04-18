import React, { useState, useRef, useEffect } from "react";
import Autocomplete from "../../part/Autocomplete";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import { useLocation, useNavigate } from "react-router-dom";

const inisialisasiMobil = [];

export default function UpdateKategori() {
  const location = useLocation();
  const navigate = useNavigate();
  const { kategoriId } = location.state || {};

  const [formData, setFormData] = useState({ id: "", nama: "" });
  const [error, setError] = useState("");
  const [mobilList, setMobilList] = useState([]);
  const [selectedMobil, setSelectedMobil] = useState(null);
  const autocompleteRef = useRef(null);
  const [detailData, setDetailData] = useState(inisialisasiMobil);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "MasterKategori/getKategoriById.php", { id: kategoriId }, "POST");
        if (data?.message === "Tidak ada kategori ditemukan") {
          setIsError(true);
        } else {
          setFormData({
            id: data.Key || "",
            nama: data.Nama || ""
          });
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDetail = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "MasterKategori/getDetailById.php", { id: kategoriId }, "POST");
        if (!Array.isArray(data) || data.length === 0 || data.message === "Tidak ada kategori ditemukan") {
          setIsError(true);
        } else {
          const formattedData = data.map((item, index) => ({
            Key: item.Key || Date.now() + index,
            No: index + 1,
            Nama: item.Nama,
            Status: "Aktif",
            Aksi: ["Delete"]
          }));
          setDetailData(formattedData);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchDetail();
  }, [kategoriId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMobil = () => {
    if (!selectedMobil) {
      setError("Nama mobil harus dipilih");
      return;
    }

    const newMobil = {
      Key: selectedMobil.value,
      No: mobilList.length + 1,
      Nama: selectedMobil.label,
      Status: "Aktif",
      Aksi: ["Delete"]
    };

    setDetailData([...detailData, newMobil]); // tampilkan di tabel
    setMobilList([...mobilList, newMobil]);   // hanya untuk yang baru di-submit    
    setSelectedMobil(null);
    autocompleteRef.current?.resetInput();
    setError("");
  };

  const handleDeleteMobil = (key) => {
    const updatedList = mobilList.filter((mobil) => mobil.Key !== key);
    const reIndexedList = updatedList.map((mobil, index) => ({
      ...mobil,
      No: index + 1
    }));
    setMobilList(reIndexedList);
    setDetailData(reIndexedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!formData.nama || mobilList.length === 0) {
      setError("Nama kategori dan minimal satu mobil harus diisi");
      return;
    }

    console.log(mobilList);
  
    let response = null;
    try {
      for (const mobil of mobilList) {
        response = await UseFetch(
          API_LINK + "MasterKategori/updateKategori.php",
          {
            idMobil: mobil.Key,
            idKategori: kategoriId,
          },
          "POST"
        );
  
        // Tambahkan pengecekan error per mobil
        if (response == "Error") {
          throw new Error("Gagal memperbarui salah satu mobil");
        }
      }
  
      // Kalau semua berhasil
      navigate("/dataKategori");
    } catch (error) {
      console.error(error); // Biar kelihatan errornya di console
      setError("Terjadi kesalahan saat memperbarui kategori");
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        Perbarui Data Kategori
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
          <Table data={detailData} onDelete={handleDeleteMobil} />
        </div>

        <div className="text-center space-x-5 mt-5">
          <button
            type="button"
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-lg text-lg"
            onClick={() => navigate("/dataKategori")}
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
