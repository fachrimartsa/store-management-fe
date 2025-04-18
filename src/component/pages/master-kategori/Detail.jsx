import React, { useState, useRef, useEffect } from "react";
import Autocomplete from "../../part/Autocomplete";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const inisialisasiMobil = [
  {
    No: null,
    Nama: null,
  },
];

export default function CreateKategori() {
  const location = useLocation();
  const navigate = useNavigate();
  const { kategoriId } = location.state || {}; 
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
  });
  const [detailData, setDetailData] = useState(inisialisasiMobil);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate("/dataKategori");
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "MasterKategori/getKategoriById.php", { id: kategoriId }, "POST");
        if (data && data.message && data.message === "Tidak ada kategori ditemukan") {
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
        console.log("data",data);
        if (!Array.isArray(data) || data.length === 0 || data.message === "Tidak ada kategori ditemukan") {
          setIsError(true);
        } else {
          const formattedData = data.map((item, index) => ({
            No: index + 1,
            Nama: item.Nama, 
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

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        Tambah Data Kategori
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form>
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
        <div className="mt-6">
          <Table data={detailData} />
        </div>

        <div className="text-center space-x-5 mt-5">
          <button
            type="button"
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-lg text-lg"
            onClick={handleCancel}
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
