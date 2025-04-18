import React, { useEffect, useState } from "react";
import Input from "../../part/Input"; 
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UseFetch from "../../util/UseFetch"; 
import { API_LINK } from "../../util/Constants";

export default function UpdateMobil() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mobilId } = location.state || {}; 
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    merek: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate("/dataMobil");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadPromises = [];
    if (!formData.nama || !formData.merek) {
      setError("Nama dan Merek tidak boleh kosong.");
      return;
    }

    setError(""); 

    await Promise.all(uploadPromises);

    const data = await UseFetch(
      API_LINK + "MasterMobil/updateMobil.php",
      formData,
      "POST"
    );    

    if (data === "ERROR") {
      swal("Oops!", "Terjadi kesalahan saat memperbarui mobil.", "error");
    } else {
      swal("Sukses!", "Mobil berhasil diperbarui!", "success");
      setFormData({ nama: "", merek: "" });
      navigate("/dataMobil"); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "MasterMobil/getMobilById.php", { id: mobilId }, "POST");
        if (data && data.message && data.message === "Tidak ada mobil ditemukan") {
          setIsError(true);
        } else {
          setFormData({
            id: data.Key || "",
            nama: data.Nama || "",
            merek: data.Merk || ""
          });
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mobilId]); 

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">Perbarui Data Mobil</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Mobil"
            forInput="nama"
            type="text"
            placeholder="Masukkan Nama"
            value={formData.nama}
            onChange={handleChange}
            isRequired={true}
            errorMessage={error && !formData.nama ? "Nama tidak boleh kosong" : ""}
          />

          <Input
            label="Merek Mobil"
            forInput="merek"
            type="text"
            placeholder="Masukkan Merek Mobil"
            value={formData.merek}
            onChange={handleChange}
            isRequired={true}
            errorMessage={error && !formData.merek ? "Merek tidak boleh kosong" : ""}
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