import React, { useState } from "react";
import Input from "../../part/Input";
import UseFetch from "../../util/UseFetch";
import { API_LINK } from "../../util/Constants";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export default function CreateSupplier() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sp_nama: "",
    sp_contact: "",
    sp_kategori: "",
    sp_alamat: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate("/data-supplier");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sp_nama || !formData.sp_contact || !formData.sp_kategori || !formData.sp_alamat) {
      setError("Semua field wajib diisi.");
      return;
    }

    setError("");

    try {
      const query = `
        mutation CreateSupplier($sp_nama: String!, $sp_contact: String!, $sp_kategori: String!, $sp_alamat: String!) {
          createSupplier(sp_nama: $sp_nama, sp_contact: $sp_contact, sp_kategori: $sp_kategori, sp_alamat: $sp_alamat) {
            sp_id
            sp_nama
          }
        }
      `;

      const variables = {
        sp_nama: formData.sp_nama,
        sp_contact: formData.sp_contact,
        sp_kategori: formData.sp_kategori,
        sp_alamat: formData.sp_alamat,
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
        throw new Error(result.errors[0].message || "Terjadi kesalahan saat menambahkan supplier.");
      }

      swal("Sukses!", "Supplier berhasil ditambahkan!", "success");
      setFormData({ sp_nama: "", sp_contact: "", sp_kategori: "", sp_alamat: "" });
      navigate("/data-supplier");
    } catch (err) {
      console.error("Error creating supplier:", err);
      swal("Oops!", err.message || "Terjadi kesalahan saat menambahkan supplier.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-fuchsia-400 text-center">Tambah Data Supplier</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Nama Supplier"
          forInput="sp_nama"
          type="text"
          name="sp_nama"
          placeholder="Masukkan Nama Supplier"
          value={formData.sp_nama}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.sp_nama ? "Nama Supplier tidak boleh kosong" : ""}
        />

        <Input
          label="Kontak"
          forInput="sp_contact"
          type="text"
          name="sp_contact"
          placeholder="Masukkan No Telepon"
          value={formData.sp_contact}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.sp_contact ? "No Telepon tidak boleh kosong" : ""}
        />

        <Input
          label="Kategori"
          forInput="sp_kategori"
          type="text"
          name="sp_kategori"
          placeholder="Masukkan Kategori Supplier"
          value={formData.sp_kategori}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.sp_kategori ? "Kategori tidak boleh kosong" : ""}
        />

        <Input
          label="Alamat"
          forInput="sp_alamat"
          type="text"
          name="sp_alamat"
          placeholder="Masukkan Alamat Supplier"
          value={formData.sp_alamat}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.sp_alamat ? "Alamat tidak boleh kosong" : ""}
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