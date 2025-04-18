import React, { useState, useRef, useEffect } from "react";
import Autocomplete from "../../part/Autocomplete";
import Input from "../../part/Input";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import swal from "sweetalert";

export default function CreateJenisServis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jenisId } = location.state || {};
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedKategori, setSelectedKategori] = useState(null);
  const autocompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    harga: "",
    waktu: "",
    kategori: "",
  });

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

  useEffect(() => {
    const fetchData = async () => {
      if (!jenisId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await UseFetch(
          API_LINK + "MasterJenisServis/getJnsServisById.php",
          { id: jenisId },
          "POST"
        );

        if (data && data.Key) {
          setFormData({
            id: data.Key || "",
            nama: data.Nama || "",
            waktu: data.Waktu || "",
            harga: formatRupiah(data.Harga?.toString() || ""),
            kategori: data.Kategori || ""
          });

        } else {
          setIsError(true);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jenisId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !formData.harga || !formData.waktu ) {
      setError("Semua field wajib diisi");
      return;
    }

    const payload = {
      id: formData.id,
      waktu: formData.waktu,
      harga: parseInt(formData.harga.replace(/\./g, ""), 10),
    };

    try {
      const response = await UseFetch(API_LINK + "MasterJenisServis/updateJnsServis.php", payload, "POST");
      if (response !== "error") {
        swal({
          title: "Berhasil!",
          text: `Jenis servis berhasil ${jenisId ? "diubah" : "ditambahkan"}!`,
          icon: "success",
          button: "OK",
        }).then(() => {
          navigate("/dataJenisServis");
        });
      } else {
        setError("Gagal menyimpan data");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat menghubungi server");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-20">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        {jenisId ? "Edit" : "Tambah"} Data Jenis Servis
      </h2>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {!isLoading && (
        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <div className="mb-4">
            <Input
              label="Kategori Mobil"
              forInput="kategori"
              name="kategori"
              type="text"
              value={formData.kategori}
              onChange={handleChange}
              isRequired={true}
            />
          </div>

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
            />
          </div>

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
            />
          </div>

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
      )}
    </div>
  );
}
