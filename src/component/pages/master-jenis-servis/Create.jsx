import React, { useState, useRef } from "react";
import Autocomplete from "../../part/Autocomplete";
import Input from "../../part/Input";
import { useNavigate } from "react-router-dom";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import swal from "sweetalert";

export default function CreateJenisServis() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    waktu: "",
  });

  const [error, setError] = useState("");
  const [selectedKategori, setSelectedKategori] = useState(null);
  const autocompleteRef = useRef(null);

  const formatRupiah = (angka) => {
    const numberString = angka.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
  
    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }
  
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return rupiah;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "harga") {
      const formatted = formatRupiah(value);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = () => {
    navigate("/dataJenisServis");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.harga || !formData.waktu || !selectedKategori) {
      setError("Semua field wajib diisi");
      return;
    }

    const payload = {
      nama: formData.nama,
      kategori: selectedKategori.value,
      waktu: formData.waktu,
      harga: parseInt(formData.harga.replace(/\./g, ""), 10), // hapus titik pemisah ribuan
    };

    try {
      const data = await UseFetch(
        API_LINK + "MasterJenisServis/createJnsServis.php",
        payload,
        "POST"
      );

      if (data === error) {
        setError(true);
      } else {
        swal({
          title: "Berhasil!",
          text: "Jenis servis berhasil ditambahkan!",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigate("/dataJenisServis");
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat menghubungi server");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        Tambah Data Jenis Servis
      </h2>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Nama Servis */}
        <div className="mb-4">
          <Input
            label="Nama Servis"
            forInput="nama"
            name="nama"
            type="text"
            placeholder="Masukkan Nama Servis"
            value={formData.nama}
            onChange={handleChange}
            isRequired={true}
            errorMessage={error && !formData.nama ? "Nama Servis tidak boleh kosong" : ""}
          />
        </div>

        {/* Kategori Mobil */}
        <div className="mb-4">
          <label className="form-label text-lg font-medium text-white">
            Kategori Mobil
          </label>
          <Autocomplete
            ref={autocompleteRef}
            placeholder="Cari Kategori..."
            fetchData={async (query) => {
              const data = await UseFetch(API_LINK + "MasterKategori/readKategori.php", {}, "GET");

              const filtered = data.filter((item) =>
                item.Nama.toLowerCase().includes(query.toLowerCase())
              );

              return filtered.map((item) => ({
                label: item.Nama,
                value: item.Key,
              }));
            }}
            onSelect={(item) => {
              setSelectedKategori(item);
            }}
            renderLabel={(item) => item.label}
          />
        </div>

        {/* Harga Servis */}
        <div className="mb-4">
          <Input
            label="Harga Servis"
            forInput="harga"
            name="harga"
            type="text"
            placeholder="Masukkan Harga Servis"
            value={formData.harga}
            onChange={handleChange}
            isRequired={true}
            errorMessage={error && !formData.harga ? "Harga Servis tidak boleh kosong" : ""}
          />
        </div>

        {/* Estimasi Waktu */}
        <div className="mb-4">
          <Input
            label="Estimasi Waktu"
            forInput="waktu"
            name="waktu"
            type="time"
            placeholder="Masukkan Estimasi Waktu"
            value={formData.waktu}
            onChange={handleChange}
            isRequired={true}
            errorMessage={error && !formData.waktu ? "Estimasi Waktu tidak boleh kosong" : ""}
          />
        </div>

        {/* Tombol */}
        <div className="text-center space-x-5 mt-5">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-lg text-lg"
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
