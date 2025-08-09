import React, { useState, useEffect } from "react";
import Input from "../../part/Input";
import { API_LINK } from "../../util/Constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";

export default function UpdateSupplier() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const supplierId = location.state?.id;  
  const [formData, setFormData] = useState({
    sp_nama: "",
    sp_contact: "",
    sp_kategori: "",
    sp_alamat: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const query = `
          query GetSupplierById($id: ID!) {
            getSupplierById(sp_id: $id) {
              sp_id
              sp_nama
              sp_contact
              sp_kategori
              sp_alamat
            }
          }
        `;
        const variables = { id: supplierId };

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
          throw new Error(result.errors[0].message || "Gagal mengambil data supplier.");
        }

        const supplierData = result.data?.getSupplierById;
        if (supplierData) {
          setFormData({
            sp_nama: supplierData.sp_nama,
            sp_contact: supplierData.sp_contact,
            sp_kategori: supplierData.sp_kategori,
            sp_alamat: supplierData.sp_alamat,
          });
        } else {
          swal("Error", "Data supplier tidak ditemukan.", "error");
          navigate("/data-supplier");
        }
      } catch (err) {
        console.error("Error fetching supplier data:", err);
        swal("Oops!", err.message || "Terjadi kesalahan saat memuat data supplier.", "error");
        navigate("/data-supplier");
      } finally {
        setIsLoading(false);
      }
    };

    if (supplierId) {
      fetchSupplierData();
    } else {
      navigate("/data-supplier"); // Redirect if no ID is provided
    }
  }, [supplierId, navigate]);

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
        mutation UpdateSupplier($sp_id: ID!, $sp_nama: String, $sp_contact: String, $sp_kategori: String, $sp_alamat: String) {
          updateSupplier(sp_id: $sp_id, sp_nama: $sp_nama, sp_contact: $sp_contact, sp_kategori: $sp_kategori, sp_alamat: $sp_alamat) {
            sp_id
            sp_nama
          }
        }
      `;

      const variables = {
        sp_id: supplierId,
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
        throw new Error(result.errors[0].message || "Terjadi kesalahan saat memperbarui supplier.");
      }

      swal("Sukses!", "Supplier berhasil diperbarui!", "success");
      navigate("/data-supplier");
    } catch (err) {
      console.error("Error updating supplier:", err);
      swal("Oops!", err.message || "Terjadi kesalahan saat memperbarui supplier.", "error");
    }
  };

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600">Memuat data supplier...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-fuchsia-400 text-center">Update Data Supplier</h2>

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
            Update
          </button>
        </div>
      </form>
    </div>
  );
}