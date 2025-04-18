import React, { useState } from "react";
import Input from "../../part/Input"; 
import  UseFetch  from "../../util/UseFetch";
import { API_LINK } from "../../util/Constants";
import { useNavigate } from "react-router-dom";

export default function CreateMekanik() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    telepon: "",
    status: "Aktif"
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
      API_LINK + "MasterMekanik/createMekanik.php",
      formData,
      "POST"
    );    

    if (data === "ERROR") {
      swal("Oops!", "Terjadi kesalahan saat menambahkan mekanik.", "error");
    } else {
      swal("Sukses!", "Mekanik berhasil ditambahkan!", "success");
      setFormData({ nama: "", telepon: "", status: "Aktif" });
      navigate("/dataMekanik"); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">Tambah Data Mekanik</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

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