import React, { useState, useEffect } from "react";
import Input from "../../part/Input";
import { API_LINK } from "../../util/Constants";
import { useNavigate } from "react-router-dom";
import SweetAlert from "../../util/SweetAlert";
import Cookies from 'js-cookie';

export default function Create() {
  const navigate = useNavigate();
  const userCookieString = Cookies.get('user');
  if (!userCookieString) {
    throw new Error("User cookie not found");
  }
  const cookie = JSON.parse(userCookieString);
  const idUser = parseInt(cookie.usr_id);
  const [formData, setFormData] = useState({
    pgl_tanggal: "",
    pgl_barang: "",
    pgl_jumlah: "",
    pgl_total: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    setFormData((prev) => ({ ...prev, pgl_tanggal: `${yyyy}-${mm}-${dd}` }));
  }, []);

  const formatRupiah = (number) => {
    if (!number) return "";
    const numStr = String(number).replace(/\D/g, '');
    if (!numStr) return "";
    return new Intl.NumberFormat('id-ID').format(Number(numStr));
  };

  const parseRupiah = (rupiahString) => {
    return parseInt(String(rupiahString).replace(/[^0-9]/g, ''), 10) || 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pgl_total") {
      setFormData({
        ...formData,
        [name]: formatRupiah(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = () => {
    navigate("/transaksi-pengeluaran");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jumlahParsed = parseInt(formData.pgl_jumlah, 10);
    const totalParsed = parseRupiah(formData.pgl_total);

    if (
      !formData.pgl_tanggal ||
      !formData.pgl_barang ||
      !formData.pgl_jumlah ||
      !formData.pgl_total
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (isNaN(jumlahParsed) || isNaN(totalParsed)) {
      setError("Jumlah dan Total harus berupa angka.");
      return;
    }

    setError("");

    try {
      const query = `
        mutation CreatePengeluaran(
          $pgl_tanggal: String!,
          $pgl_barang: String!,
          $pgl_jumlah: Int!,
          $pgl_total: Float!,
          $pgl_idUser: Int!
        ) {
          createPengeluaran(
            pgl_tanggal: $pgl_tanggal,
            pgl_barang: $pgl_barang,
            pgl_jumlah: $pgl_jumlah,
            pgl_total: $pgl_total,
            pgl_idUser: $pgl_idUser
          ) {
            pgl_id
            pgl_barang
          }
        }
      `;

      const variables = {
        pgl_tanggal: formData.pgl_tanggal,
        pgl_barang: formData.pgl_barang,
        pgl_jumlah: jumlahParsed,
        pgl_total: totalParsed,
        pgl_idUser: idUser
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
        throw new Error(result.errors[0].message || "Terjadi kesalahan saat menambahkan data pengeluaran.");
      }

      SweetAlert("Sukses!", "Data pengeluaran berhasil ditambahkan!", "success");
      setFormData({
        pgl_tanggal: "", 
        pgl_barang: "",
        pgl_jumlah: "",
        pgl_total: "",
      });
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setFormData((prev) => ({ ...prev, pgl_tanggal: `${yyyy}-${mm}-${dd}` }));
      navigate("/transaksi-pengeluaran");
    } catch (err) {
      console.error("Error creating pengeluaran:", err);
      SweetAlert("Oops!", err.message || "Terjadi kesalahan saat menambahkan data pengeluaran.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-fuchsia-400 text-center">Tambah Data Pengeluaran</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Tanggal"
          forInput="pgl_tanggal"
          type="date"
          name="pgl_tanggal"
          placeholder="Pilih Tanggal"
          value={formData.pgl_tanggal}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pgl_tanggal ? "Tanggal tidak boleh kosong" : ""}
        />

        <Input
          label="Nama Barang"
          forInput="pgl_barang"
          type="text"
          name="pgl_barang"
          placeholder="Masukkan Nama Barang/Item"
          value={formData.pgl_barang}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pgl_barang ? "Nama Barang tidak boleh kosong" : ""}
        />

        <Input
          label="Jumlah"
          forInput="pgl_jumlah"
          type="number"
          name="pgl_jumlah"
          placeholder="Masukkan Jumlah Item"
          value={formData.pgl_jumlah}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pgl_jumlah ? "Jumlah tidak boleh kosong" : ""}
        />

        <Input
          label="Total Biaya"
          forInput="pgl_total"
          type="text"
          name="pgl_total"
          placeholder="Masukkan Total Biaya"
          value={formData.pgl_total}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pgl_total ? "Total Biaya tidak boleh kosong" : ""}
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