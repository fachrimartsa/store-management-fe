import React, { useState, useEffect, useRef } from "react";
import Input from "../../part/Input";
import { API_LINK } from "../../util/Constants";
import { useNavigate } from "react-router-dom";
import SweetAlert from "../../util/SweetAlert";
import Autocomplete from "../../part/Autocomplete";
import Cookies from 'js-cookie';
import Table from "../../part/Table";

const inisialisasiData = [];

export default function Create() {
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [formData, setFormData] = useState({
    pjl_tanggal: "",
    pjl_platform: "",
    pjl_telephone: "",
    pjl_total: "",
  });
  const userCookieString = Cookies.get('user');
  if (!userCookieString) {
    throw new Error("User cookie not found");
  }
  const cookie = JSON.parse(userCookieString);
  const idUser = parseInt(cookie.usr_id);
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
            query getAllBarang($brg_idUser: Int!) {
              getAllBarang(brg_idUser: $brg_idUser) {
                brg_id,
                brg_harga_beli,
                brg_nama,
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
    
    if (name === "pjl_total") {
      setFormData({
        ...formData,
        [name]: formatRupiah(value),
      });
    } else {
      setFormData((prev) => {
        const newForm = { ...prev, [name]: updatedValue };
        return newForm;
      });
    }
  };

  const handleAddBarang = () => {
    if (!barang.brg_id || !formData.pjl_jumlah) {
      setError("Barang dan jumlah harus diisi.");
      return;
    }
    setError("");
    const newItem = {
      Key: barang.brg_id,
      No: currentData.length + 1,
      Barang: barang.brg_nama,
      Jumlah: formData.pjl_jumlah,
      "Modal/Pcs": barang.brg_harga_beli,
      Aksi: ["Delete"]
    };
    setCurrentData((prev) => [...prev, newItem]);
    setFormData((prev) => ({ ...prev, pjl_jumlah: "" }));
    setBarang({});
    if (autocompleteRef.current) {
      autocompleteRef.current.clear();
    }
  };

  const handleCancel = () => {
    navigate("/transaksi-penjualan");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalModal = currentData.reduce((accumulator, currentItem) => {
      const modalNumber = parseFloat(currentItem["Modal/Pcs"]);
      const jumlahNumber = parseInt(currentItem.Jumlah);
      const subtotal = modalNumber * jumlahNumber;
      return accumulator + subtotal;
    }, 0);

    const totalParsed = parseRupiah(formData.pjl_total);
    const profit = totalParsed - totalModal;
    const profitParsed = parseRupiah(profit);

    if (
      !formData.pjl_tanggal ||
      !formData.pjl_platform ||
      !formData.pjl_telephone ||
      !formData.pjl_total
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    setError("");
    try {
      const query = `
        mutation CreatePenjualan(
          $pjl_tanggal: String!,
          $pjl_platform: String!,
          $pjl_telephone: String!,
          $pjl_total: Float!,
          $pjl_profit: Float!,
          $pjl_idUser: Int!
        ) {
          createPenjualan(
            pjl_tanggal: $pjl_tanggal,
            pjl_platform: $pjl_platform,
            pjl_telephone: $pjl_telephone,
            pjl_total: $pjl_total,
            pjl_profit: $pjl_profit,
            pjl_idUser: $pjl_idUser
          ) {
            pjl_id
          }
        }
      `;

      const variables = {
        pjl_tanggal: formData.pjl_tanggal,
        pjl_platform: formData.pjl_platform,
        pjl_telephone: formData.pjl_telephone,
        pjl_total: totalParsed,
        pjl_profit: profitParsed,
        pjl_idUser: idUser,
      };

      const response = await fetch(API_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(
          result.errors[0].message ||
            "Terjadi kesalahan saat menambahkan data penjualan."
        );
      }
      const idPenjualan = result.data.createPenjualan.pjl_id;

      const detailPromises = currentData.map((item) => {
        const queryDetail = `
          mutation CreateDetail(
            $pjl_id: Int!,
            $brg_id: Int!,
            $dtl_jumlah: Int!,
            $dtl_idUser: Int!
          ) {
            createDetail(
              pjl_id: $pjl_id,
              brg_id: $brg_id,
              dtl_jumlah: $dtl_jumlah,
              dtl_idUser: $dtl_idUser
            ) {
              dtl_id
            }
          }
        `;

        const details = {
          pjl_id: parseInt(idPenjualan),
          brg_id: parseInt(item.Key),
          dtl_jumlah: parseInt(item.Jumlah),
          dtl_idUser: idUser,
        };

        return fetch(API_LINK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: queryDetail,
            variables: details,
          }),
        });
      });

      const detailResponses = await Promise.all(detailPromises);
      const detailResults = await Promise.all(
        detailResponses.map((res) => res.json())
      );

      detailResults.forEach((res) => {
        if (res.errors) {
          throw new Error(
            res.errors[0].message ||
              "Terjadi kesalahan saat menambahkan detail penjualan."
          );
        }
      });

      SweetAlert("Sukses!", "Data penjualan berhasil ditambahkan!", "success");
      setFormData({
        pjl_tanggal: "",
        pjl_platform: "",
        pjl_telephone: "",
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

  const handleDelete = (e) => {
    e.preventDefault();
  }

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
      <form>
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
        <div className="flex items-center gap-3">
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
          <button
            type="button"
            className="bg-blue-700 hover:bg-purple-800 text-white font-bold py-2 mt-3 px-3 rounded-lg shadow-md transition duration-300"
            onClick={handleAddBarang}
          >
            Tambah
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg shadow-xl mb-2">
          <Table data={currentData} onDelete={handleDelete} />
        </div>
        <Input
          label="Telephone"
          forInput="pjl_telephone"
          type="text"
          name="pjl_telephone"
          placeholder="Masukkan Telephone Pembeli"
          value={formData.pjl_telephone}
          onChange={handleChange}
          isRequired={true}
          errorMessage={
            error && !formData.pjl_telephone ? "Telephone tidak boleh kosong" : ""
          }
        />
        <Input
          label="Total Harga"
          forInput="pjl_total"
          type="text"
          name="pjl_total"
          placeholder="Total Penjualan"
          value={formData.pjl_total}
          onChange={handleChange}
          isRequired={true}
          errorMessage={
            error && !formData.pjl_total ? "Total Harga tidak boleh kosong" : ""
          }
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
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
