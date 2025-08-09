import React, { useState, useEffect, useRef } from "react";
import Input from "../../part/Input";
import { API_LINK } from "../../util/Constants";
import { data, useNavigate } from "react-router-dom";
import SweetAlert from "../../util/SweetAlert";
import Autocomplete from "../../part/Autocomplete";

export default function Create() {
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const [formData, setFormData] = useState({
    pjl_tanggal: "",
    pjl_barang: "",
    pjl_jumlah: "",
    pjl_platform: "",
    pjl_alamat: "",
    pjl_harga_jual: "",
    pjl_total: "",
  });

  const [error, setError] = useState("");
  const [barang, setBarang] = useState({});

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setFormData((prev) => ({ ...prev, pjl_tanggal: `${yyyy}-${mm}-${dd}` }));
  }, []);

  const fetchBarangOptions = async (query) => {
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              getAllBarang {
                brg_id,
                brg_nama,
                brg_harga_beli
              }
            }
          `,
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

  const handleBarangSelect = (selectedItem) => {
    setBarang(selectedItem);
    setFormData((prev) => ({
      ...prev,
      pjl_barang: selectedItem.brg_id,
      pjl_barang_nama: selectedItem.brg_nama,
    }));
  };

  const formatRupiah = (number) => {
    if (!number) return "";
    const numStr = String(number).replace(/\D/g, "");
    if (!numStr) return "";
    return new Intl.NumberFormat("id-ID").format(Number(numStr));
  };

  const parseRupiah = (rupiahString) => {
    return parseInt(String(rupiahString).replace(/[^0-9]/g, ""), 10) || 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "pjl_harga_jual") {
      updatedValue = formatRupiah(value);
    }

    if (name === "pjl_jumlah") {
      updatedValue = value.replace(/\D/g, ""); 
    }

    setFormData((prev) => {
      const newForm = { ...prev, [name]: updatedValue };

      const jumlahParsed = parseInt(String(newForm.pjl_jumlah), 10) || 0;
      const hargaJualParsed = parseRupiah(newForm.pjl_harga_jual);
      const totalCalculated = jumlahParsed * hargaJualParsed;
      newForm.pjl_total = totalCalculated
        ? formatRupiah(totalCalculated)
        : "";

      return newForm;
    });
  };

  const handleCancel = () => {
    navigate("/transaksi-penjualan");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jumlahParsed = parseInt(formData.pjl_jumlah, 10);
    const hargaJualParsed = parseRupiah(formData.pjl_harga_jual);
    const totalParsed = parseRupiah(formData.pjl_total);
    const profit = (parseRupiah(formData.pjl_harga_jual) - parseRupiah(barang.brg_harga_beli)) * jumlahParsed;
    const profitParsed = parseRupiah(profit);

    if (
      !formData.pjl_tanggal ||
      !formData.pjl_barang ||
      !formData.pjl_jumlah ||
      !formData.pjl_platform ||
      !formData.pjl_alamat ||
      !formData.pjl_harga_jual ||
      !formData.pjl_total
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (isNaN(jumlahParsed) || isNaN(hargaJualParsed) ) {
      setError("Jumlah, Harga Jual, dan Total harus berupa angka.");
      return;
    }

    setError("");

    try {
      const query = `
        mutation CreatePenjualan(
          $pjl_tanggal: String!,
          $pjl_barang: Int!,
          $pjl_jumlah: Int!,
          $pjl_platform: String!,
          $pjl_alamat: String!,
          $pjl_harga_jual: Float!,
          $pjl_total: Float!,
          $pjl_profit: Float!
        ) {
          createPenjualan(
            pjl_tanggal: $pjl_tanggal,
            pjl_barang: $pjl_barang,
            pjl_jumlah: $pjl_jumlah,
            pjl_platform: $pjl_platform,
            pjl_alamat: $pjl_alamat,
            pjl_harga_jual: $pjl_harga_jual,
            pjl_total: $pjl_total,
            pjl_profit: $pjl_profit
          ) {
            pjl_id
            pjl_barang
          }
        }
      `;

      const variables = {
        pjl_tanggal: formData.pjl_tanggal,
        pjl_barang: parseInt(formData.pjl_barang),
        pjl_jumlah: jumlahParsed,
        pjl_platform: formData.pjl_platform,
        pjl_alamat: formData.pjl_alamat,
        pjl_harga_jual: hargaJualParsed,
        pjl_total: totalParsed,
        pjl_profit: profitParsed
      };

      const response = await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(
          result.errors[0].message ||
            "Terjadi kesalahan saat menambahkan data penjualan."
        );
      }

      SweetAlert("Sukses!", "Data penjualan berhasil ditambahkan!", "success");
      setFormData({
        pjl_tanggal: "",
        pjl_barang: "",
        pjl_jumlah: "",
        pjl_platform: "",
        pjl_alamat: "",
        pjl_harga_jual: "",
        pjl_total: "",
      });
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setFormData((prev) => ({ ...prev, pjl_tanggal: `${yyyy}-${mm}-${dd}` }));
      navigate("/transaksi-penjualan");
    } catch (err) {
      console.error("Error creating penjualan:", err);
      SweetAlert(
        "Oops!",
        err.message || "Terjadi kesalahan saat menambahkan data penjualan.",
        "error"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-fuchsia-400 text-center">
        Tambah Data Penjualan
      </h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Tanggal"
          forInput="pjl_tanggal"
          type="date"
          name="pjl_tanggal"
          placeholder="Pilih Tanggal"
          value={formData.pjl_tanggal}
          onChange={handleChange}
          isRequired={true}
          errorMessage={
            error && !formData.pjl_tanggal ? "Tanggal tidak boleh kosong" : ""
          }
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
          errorMessage={
            error && !formData.pjl_barang ? "Barang tidak boleh kosong" : ""
          }
        />

        <Input
          label="Jumlah"
          forInput="pjl_jumlah"
          type="number"
          name="pjl_jumlah"
          placeholder="Masukkan Jumlah Barang"
          value={formData.pjl_jumlah}
          onChange={handleChange}
          isRequired={true}
          errorMessage={
            error && !formData.pjl_jumlah ? "Jumlah tidak boleh kosong" : ""
          }
        />

        <Input
          label="Platform Penjualan"
          forInput="pjl_platform"
          type="text"
          name="pjl_platform"
          placeholder="Masukkan Nama Platform (e.g., Shopee, Tokopedia)"
          value={formData.pjl_platform}
          onChange={handleChange}
          isRequired={true}
          errorMessage={
            error && !formData.pjl_platform
              ? "Platform tidak boleh kosong"
              : ""
          }
        />

        <Input
          label="Alamat"
          forInput="pjl_alamat"
          type="text"
          name="pjl_alamat"
          placeholder="Masukkan Alamat Pengiriman"
          value={formData.pjl_alamat}
          onChange={handleChange}
          isRequired={true}
          errorMessage={
            error && !formData.pjl_alamat ? "Alamat tidak boleh kosong" : ""
          }
        />

        <Input
          label="Harga Jual"
          forInput="pjl_harga_jual"
          type="text"
          name="pjl_harga_jual"
          placeholder="Masukkan Harga Jual"
          value={formData.pjl_harga_jual}
          onChange={handleChange}
          isRequired={true}
          errorMessage={
            error && !formData.pjl_harga_jual
              ? "Harga Jual tidak boleh kosong"
              : ""
          }
        />

        <Input
          label="Total Harga"
          forInput="pjl_total"
          type="text"
          name="pjl_total"
          placeholder="Total otomatis"
          value={formData.pjl_total}
          onChange={handleChange}
          isRequired={true}
          errorMessage={
            error && !formData.pjl_total ? "Total Harga tidak boleh kosong" : ""
          }
          readOnly
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
