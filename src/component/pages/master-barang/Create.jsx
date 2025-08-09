import React, { useState } from "react";
import Input from "../../part/Input";
import { API_LINK } from "../../util/Constants";
import { useNavigate } from "react-router-dom";
import SweetAlert from "../../util/SweetAlert";

export default function Create() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brg_nama: "",
    brg_kategori: "",
    brg_harga_beli: "",
    brg_harga_jual: "",
    brg_stok: "",
    brg_status: "Aktif",
  });

  const [error, setError] = useState("");

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
    const { name, value, type, checked } = e.target;

    if (name === "brg_harga_beli" || name === "brg_harga_jual") {
      setFormData({
        ...formData,
        [name]: formatRupiah(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (checked ? "Aktif" : "Nonaktif") : value,
      });
    }
  };

  const handleCancel = () => {
    navigate("/data-barang");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hargaBeliParsed = parseRupiah(formData.brg_harga_beli);
    const hargaJualParsed = parseRupiah(formData.brg_harga_jual);
    const stokParsed = parseInt(formData.brg_stok, 10);

    if (
      !formData.brg_nama ||
      !formData.brg_kategori ||
      !formData.brg_harga_beli ||
      !formData.brg_harga_jual ||
      !formData.brg_stok ||
      !formData.brg_status
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (isNaN(hargaBeliParsed) || isNaN(hargaJualParsed) || isNaN(stokParsed)) {
      setError("Harga beli, harga jual, dan stok harus berupa angka.");
      return;
    }

    setError("");

    try {
      const query = `
        mutation createBarang(
          $brg_nama: String!,
          $brg_kategori: String!,
          $brg_harga_beli: Float!,
          $brg_harga_jual: Float!,
          $brg_stok: Int!,
          $brg_status: String!
        ) {
          createBarang(
            brg_nama: $brg_nama,
            brg_kategori: $brg_kategori,
            brg_harga_beli: $brg_harga_beli,
            brg_harga_jual: $brg_harga_jual,
            brg_stok: $brg_stok,
            brg_status: $brg_status
          ) {
            brg_id
            brg_nama
            brg_kategori
            brg_harga_beli
            brg_harga_jual
            brg_stok
            brg_status
          }
        }
      `;

      const variables = {
        brg_nama: formData.brg_nama,
        brg_kategori: formData.brg_kategori,
        brg_harga_beli: hargaBeliParsed,
        brg_harga_jual: hargaJualParsed,
        brg_stok: stokParsed,
        brg_status: formData.brg_status,
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
        throw new Error(result.errors[0].message || "Terjadi kesalahan saat menambahkan barang.");
      }

      SweetAlert("Sukses!", "Barang berhasil ditambahkan!", "success");
      setFormData({
        brg_nama: "",
        brg_kategori: "",
        brg_harga_beli: "",
        brg_harga_jual: "",
        brg_stok: "",
        brg_status: "Aktif",
      });
      navigate("/data-barang");
    } catch (err) {
      console.error("Error creating barang:", err);
      SweetAlert("Oops!", err.message || "Terjadi kesalahan saat menambahkan barang.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-fuchsia-400 text-center">Tambah Data Barang</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Nama Barang"
          forInput="brg_nama"
          type="text"
          name="brg_nama"
          placeholder="Masukkan Nama Barang"
          value={formData.brg_nama}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.brg_nama ? "Nama Barang tidak boleh kosong" : ""}
        />

        <Input
          label="Kategori Barang"
          forInput="brg_kategori"
          type="text"
          name="brg_kategori"
          placeholder="Masukkan Kategori Barang"
          value={formData.brg_kategori}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.brg_kategori ? "Kategori tidak boleh kosong" : ""}
        />

        <Input
          label="Harga Beli"
          forInput="brg_harga_beli"
          type="text"
          name="brg_harga_beli"
          placeholder="Masukkan Harga Beli"
          value={formData.brg_harga_beli}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.brg_harga_beli ? "Harga Beli tidak boleh kosong" : ""}
        />

        <Input
          label="Harga Jual"
          forInput="brg_harga_jual"
          type="text"
          name="brg_harga_jual"
          placeholder="Masukkan Harga Jual"
          value={formData.brg_harga_jual}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.brg_harga_jual ? "Harga Jual tidak boleh kosong" : ""}
        />

        <Input
          label="Stok"
          forInput="brg_stok"
          type="number"
          name="brg_stok"
          placeholder="Masukkan Jumlah Stok"
          value={formData.brg_stok}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.brg_stok ? "Stok tidak boleh kosong" : ""}
        />

        <div className="mb-4">
          <label htmlFor="brg_status" className="block text-gray-300 text-sm font-bold mb-2">
            Status Barang <span className="text-red-500">*</span>
          </label>
          <select
            id="brg_status"
            name="brg_status"
            value={formData.brg_status}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            required
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
          {error && !formData.brg_status && (
            <p className="text-red-500 text-xs italic mt-2">Status tidak boleh kosong</p>
          )}
        </div>

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