import React, { useState, useEffect, useRef } from "react";
import Input from "../../part/Input";
import { API_LINK } from "../../util/Constants";
import { useNavigate } from "react-router-dom";
import SweetAlert from "../../util/SweetAlert";
import Cookies from 'js-cookie';

export default function Create() {
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  
  const userCookieString = Cookies.get('user');
  if (!userCookieString) {
    console.error("User cookie not found. Redirecting to login or home.");
  }
  const cookie = userCookieString ? JSON.parse(userCookieString) : { usr_id: 0 };
  const idUser = parseInt(cookie.usr_id);

  const [formData, setFormData] = useState({
    pnr_tanggal: "",
    pnr_jumlah_raw: 0,
    pnr_jumlah_display: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setFormData((prev) => ({ ...prev, pnr_tanggal: `${yyyy}-${mm}-${dd}` }));
  }, []);

  const formatRupiah = (number) => {
    if (number === null || number === undefined || number === "" || number === 0) return "";
    const numStr = String(number).replace(/\D/g, '');
    if (!numStr) return "";
    return new Intl.NumberFormat('id-ID').format(Number(numStr));
  };

  const parseRupiah = (rupiahString) => {
    return parseInt(String(rupiahString).replace(/[^0-9]/g, ''), 10) || 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pnr_jumlah_display") {
      
      const rawValue = parseRupiah(value);
      
      
      const formattedValue = formatRupiah(rawValue);

      setFormData((prev) => ({
        ...prev,
        pnr_jumlah_raw: rawValue,
        pnr_jumlah_display: formattedValue,
      }));

    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = () => {
    navigate("/transaksi-penarikan");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jumlahParsed = formData.pnr_jumlah_raw;

    if (
      !formData.pnr_tanggal ||
      jumlahParsed <= 0 
    ) {
      setError("Tanggal dan Jumlah wajib diisi.");
      return;
    }

    if (isNaN(jumlahParsed)) {
      setError("Jumlah harus berupa angka.");
      return;
    }

    setError("");

    try {
      const query = `
        mutation CreatePenarikan(
          $pnr_idUser: Int!,
          $pnr_tanggal: String!,
          $pnr_jumlah: Int!
        ) {
          createPenarikan(
            pnr_idUser: $pnr_idUser,
            pnr_tanggal: $pnr_tanggal,
            pnr_jumlah: $pnr_jumlah,
          ) {
            pnr_id
            pnr_tanggal
          }
        }
      `;

      const variables = {
        pnr_tanggal: formData.pnr_tanggal,
        pnr_jumlah: jumlahParsed,
        pnr_idUser: idUser
      };

      const response = await fetch(API_LINK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message || "Terjadi kesalahan saat menambahkan data penarikan.");
      }

      SweetAlert("Sukses!", "Data penarikan berhasil ditambahkan!", "success");
      
      
      setFormData({
        pnr_tanggal: "",
        pnr_jumlah_raw: 0,
        pnr_jumlah_display: "",
      });
      
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setFormData((prev) => ({ ...prev, pnr_tanggal: `${yyyy}-${mm}-${dd}` }));
      
      navigate("/transaksi-penarikan");
    } catch (err) {
      console.error("Error creating penarikan:", err);
      SweetAlert("Oops!", err.message || "Terjadi kesalahan saat menambahkan data penarikan.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-fuchsia-400 text-center">Tambah Data Penarikan</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Tanggal Penarikan"
          forInput="pnr_tanggal"
          type="date"
          name="pnr_tanggal"
          placeholder="Pilih Tanggal"
          value={formData.pnr_tanggal}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pnr_tanggal ? "Tanggal tidak boleh kosong" : ""}
        />

        
        <Input
          label="Jumlah"
          forInput="pnr_jumlah_display"
          type="text"
          name="pnr_jumlah_display"
          placeholder="Masukkan Jumlah Penarikan"
          value={formData.pnr_jumlah_display}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && formData.pnr_jumlah_raw <= 0 ? "Jumlah harus diisi" : ""}
          
          infoMessage={`Nilai mentah: Rp${formData.pnr_jumlah_raw.toLocaleString('id-ID')}`}
        />

        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
            onClick={handleCancel}
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}