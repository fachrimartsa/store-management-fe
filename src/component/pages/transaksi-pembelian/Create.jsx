import React, { useState, useEffect, useRef } from "react";
import Input from "../../part/Input";
import Autocomplete from "../../part/Autocomplete";
import { API_LINK } from "../../util/Constants";
import { useNavigate } from "react-router-dom";
import SweetAlert from "../../util/SweetAlert";
import Cookies from 'js-cookie';

export default function Create() {
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const userCookieString = Cookies.get('user');
  if (!userCookieString) {
    throw new Error("User cookie not found");
  }
  const cookie = JSON.parse(userCookieString);
  const idUser = parseInt(cookie.usr_id);

  const [formData, setFormData] = useState({
    pbl_tanggal: "",
    pbl_barang: "",
    pbl_barang_nama: "",
    pbl_supplier: "",
    pbl_jumlah: "",
    pbl_harga_beli: "",
    pbl_total: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setFormData((prev) => ({ ...prev, pbl_tanggal: `${yyyy}-${mm}-${dd}` }));
  }, []);

  const formatRupiah = (number) => {
    if (number === null || number === undefined || number === "") return "";
    const numStr = String(number).replace(/\D/g, '');
    if (!numStr) return "";
    return new Intl.NumberFormat('id-ID').format(Number(numStr));
  };

  const parseRupiah = (rupiahString) => {
    return parseInt(String(rupiahString).replace(/[^0-9]/g, ''), 10) || 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pbl_harga_beli" || name === "pbl_total") {
      setFormData({
        ...formData,
        [name]: formatRupiah(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    const hargaBeli = parseRupiah(formData.pbl_harga_beli);
    const jumlah = parseInt(formData.pbl_jumlah, 10);

    if (!isNaN(hargaBeli) && !isNaN(jumlah) && hargaBeli > 0 && jumlah > 0) {
      const calculatedTotal = hargaBeli * jumlah;
      const formattedCalculatedTotal = formatRupiah(calculatedTotal);

      if (formData.pbl_total !== formattedCalculatedTotal) {
        setFormData((prev) => ({
          ...prev,
          pbl_total: formattedCalculatedTotal,
        }));
      }
    } else if (formData.pbl_total !== "") {
      setFormData((prev) => ({ ...prev, pbl_total: "" }));
    }
  }, [formData.pbl_harga_beli, formData.pbl_jumlah, formData.pbl_total]);

  const fetchBarangOptions = async (query) => {

    try {
      const response = await fetch(API_LINK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query getAllBarang($brg_idUser: Int!) {
              getAllBarang(brg_idUser: $brg_idUser) {
                brg_id,
                brg_nama,
                brg_harga_beli
              }
            }
          `,
          variables: {
            brg_idUser: idUser,
          },
        }),
      });
      const result = await response.json();
      const data = result.data.getAllBarang;
      const filtered = data.filter((item) =>
        item.brg_nama.toLowerCase().includes(query.toLowerCase())
      );
      if (result.errors) {
        console.error("GraphQL Error:", result.errors);
        return [];
      }
      return filtered || [];
    } catch (err) {
      console.error("Error fetching barang:", err);
      return [];
    }
  };

  const fetchSupplierOptions = async (query) => {
    try {
      const response = await fetch(API_LINK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query getAllSupplier($sp_idUser: Int!) {
              getAllSuppliers(sp_idUser: $sp_idUser) {
                sp_id,
                sp_nama,
              }
            }
          `,
          variables: {
            sp_idUser: idUser,
          },
        }),
      });
      const result = await response.json();
      const data = result.data.getAllSuppliers;
      const filtered = data.filter((item) =>
        item.sp_nama.toLowerCase().includes(query.toLowerCase())
      );
      if (result.errors) {
        console.error("GraphQL Error:", result.errors);
        return [];
      }
      return filtered || [];
    } catch (err) {
      console.error("Error fetching barang:", err);
      return [];
    }
  };

  const handleBarangSelect = (selectedItem) => {
    setFormData((prev) => ({
      ...prev,
      pbl_barang: selectedItem.brg_id,
      pbl_barang_nama: selectedItem.brg_nama,
      pbl_harga_beli: formatRupiah(selectedItem.brg_harga_beli),
    }));
  };

  const handleSupplierSelect = (selectedItem) => {
    setFormData((prev) => ({
      ...prev,
      pbl_supplier: selectedItem.sp_id,
    }));
  };

  const handleCancel = () => {
    navigate("/transaksi-pembelian");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hargaBeliParsed = parseRupiah(formData.pbl_harga_beli);
    const totalParsed = parseRupiah(formData.pbl_total);
    const jumlahParsed = parseInt(formData.pbl_jumlah, 10);

    if (
      !formData.pbl_tanggal ||
      !formData.pbl_barang ||
      !formData.pbl_supplier ||
      !formData.pbl_jumlah ||
      !formData.pbl_harga_beli ||
      !formData.pbl_total
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (isNaN(jumlahParsed) || isNaN(hargaBeliParsed) || isNaN(totalParsed)) {
      setError("Jumlah, Harga Beli, dan Total harus berupa angka.");
      return;
    }

    setError("");

    try {
      const query = `
        mutation CreatePembelian(
          $pbl_tanggal: String!,
          $pbl_barang: Int!,
          $pbl_supplier: Int!,
          $pbl_jumlah: Int!,
          $pbl_harga_beli: Float!,
          $pbl_total: Float!,
          $pbl_idUser: Int!
        ) {
          createPembelian(
            pbl_tanggal: $pbl_tanggal,
            pbl_barang: $pbl_barang,
            pbl_supplier: $pbl_supplier,
            pbl_jumlah: $pbl_jumlah,
            pbl_harga_beli: $pbl_harga_beli,
            pbl_total: $pbl_total,
            pbl_idUser: $pbl_idUser,
          ) {
            pbl_id
            pbl_tanggal
            pbl_barang
          }
        }
      `;

      const variables = {
        pbl_tanggal: formData.pbl_tanggal,
        pbl_barang: parseInt(formData.pbl_barang),
        pbl_supplier: parseInt(formData.pbl_supplier),
        pbl_jumlah: jumlahParsed,
        pbl_harga_beli: hargaBeliParsed,
        pbl_total: totalParsed,
        pbl_idUser: idUser
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
        throw new Error(result.errors[0].message || "Terjadi kesalahan saat menambahkan data pembelian.");
      }

      SweetAlert("Sukses!", "Data pembelian berhasil ditambahkan!", "success");
      setFormData({
        pbl_tanggal: "",
        pbl_barang: "",
        pbl_barang_nama: "",
        pbl_supplier: "",
        pbl_jumlah: "",
        pbl_harga_beli: "",
        pbl_total: "",
      });
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setFormData((prev) => ({ ...prev, pbl_tanggal: `${yyyy}-${mm}-${dd}` }));
      navigate("/transaksi-pembelian");
    } catch (err) {
      console.error("Error creating pembelian:", err);
      SweetAlert("Oops!", err.message || "Terjadi kesalahan saat menambahkan data pembelian.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-fuchsia-400 text-center">Tambah Data Pembelian</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Tanggal Pembelian"
          forInput="pbl_tanggal"
          type="date"
          name="pbl_tanggal"
          placeholder="Pilih Tanggal"
          value={formData.pbl_tanggal}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pbl_tanggal ? "Tanggal tidak boleh kosong" : ""}
        />

        <Autocomplete
          ref={autocompleteRef}
          label="Barang"
          forInput="brg_nama"
          name="brg_nama"
          placeholder="Cari dan Pilih Barang"
          fetchData={fetchBarangOptions}
          onSelect={handleBarangSelect}
          renderLabel={(item) => item.brg_nama}
          isRequired={true}
          errorMessage={error && !formData.pbl_barang ? "Barang tidak boleh kosong" : ""}
        />

        <Autocomplete
          ref={autocompleteRef}
          label="Supplier"
          forInput="pbl_supplier"
          name="pbl_supplier"
          placeholder="Cari dan Pilih Supplier"
          fetchData={fetchSupplierOptions}
          onSelect={handleSupplierSelect}
          renderLabel={(item) => item.sp_nama}
          isRequired={true}
          errorMessage={error && !formData.pbl_supplier ? "Supplier tidak boleh kosong" : ""}
        />

        <Input
          label="Jumlah"
          forInput="pbl_jumlah"
          type="number"
          name="pbl_jumlah"
          placeholder="Masukkan Jumlah Barang"
          value={formData.pbl_jumlah}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pbl_jumlah ? "Jumlah tidak boleh kosong" : ""}
        />

        <Input
          label="Harga Beli Per Unit"
          forInput="pbl_harga_beli"
          type="text"
          name="pbl_harga_beli"
          placeholder="Masukkan Harga Beli"
          value={formData.pbl_harga_beli}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pbl_harga_beli ? "Harga Beli tidak boleh kosong" : ""}
        />

        <Input
          label="Total Biaya"
          forInput="pbl_total"
          type="text"
          name="pbl_total"
          placeholder="Masukkan Total Biaya"
          value={formData.pbl_total}
          onChange={handleChange}
          isRequired={true}
          errorMessage={error && !formData.pbl_total ? "Total Biaya tidak boleh kosong" : ""}
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