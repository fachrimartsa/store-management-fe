import React, { useEffect, useState } from "react";
import Input from "../../part/Input"; 
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UseFetch from "../../util/UseFetch"; 
import { API_LINK } from "../../util/Constants";

export default function UpdateMekanik() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mekanikId } = location.state || {}; 
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    telepon: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate("/dataMekanik");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadPromises = [];
    if (!formData.nama || !formData.telepon) {
      setError("Nama dan No Telepon tidak boleh kosong.");
      return;
    }

    setError(""); 

    await Promise.all(uploadPromises);

    const data = await UseFetch(
      API_LINK + "MasterMekanik/updateMekanik.php",
      formData,
      "POST"
    );    

    if (data === "ERROR") {
      swal("Oops!", "Terjadi kesalahan saat memperbarui mekanik.", "error");
    } else {
      swal("Sukses!", "Mekanik berhasil diperbarui!", "success");
      setFormData({ nama: "", telepon: "" });
      navigate("/dataMekanik"); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "MasterMekanik/getMekanikById.php", { id: mekanikId }, "POST");
        if (data && data.message && data.message === "Tidak ada mekanik ditemukan") {
          setIsError(true);
        } else {
          setFormData({
            id: data.Key || "",
            nama: data.Nama || "",
            telepon: data["No Telepon"] || ""
          });
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mekanikId]); 

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">Perbarui Data Mekanik</h2>

      {isError && <div className="text-red-500 mb-4">Data tidak ditemukan</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Nama"
          forInput="nama"
          type="text"
          placeholder="Masukkan Nama"
          value={formData.nama}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.nama ? "Nama tidak boleh kosong" : ""}
        />

        <Input
          label="No Telepon"
          forInput="telepon"
          type="number"
          placeholder="Masukkan No Telepon"
          value={formData.telepon}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.telepon ? "No Telepon tidak boleh kosong" : ""}
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
