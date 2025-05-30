import DropDown from "../../part/Dropdown.jsx"; // Impor dropdown yang sudah kamu buat
import React, { useState, useRef } from "react";
import Autocomplete from "../../part/Autocomplete";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export default function CreateTransaksiServis() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaPemilik: "",
    platMobil: "",
    jenisBarang: "",
  });

  const [error, setError] = useState("");
  const [listServis, setListServis] = useState([]);
  const [listBarang, setListBarang] = useState([]);
  const [totalHarga, setTotalHarga] = useState(0);

  const [selectedMekanik, setSelectedMekanik] = useState(null);

  const [selectedMobil, setSelectedMobil] = useState(null); // ini buat Mobil
  const idMobil = selectedMobil?.value || null;

  const [selectedServis, setSelectedServis] = useState(null);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [jumlahBarang, setJumlahBarang] = useState(0);

  const refServis = useRef(null);
  const refBarang = useRef(null);
  const refMekanik = useRef(null);
  const refMobil = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };  

  const handleCancel = () => {
    navigate("/transaksiServis");
  };

  const hitungTotal = (servis, barang) => {
    const totalServis = servis.reduce((a, b) => a + parseFloat(b.Harga || 0), 0);
    const totalBarang = barang.reduce((a, b) => a + parseFloat(b.Harga || 0), 0);
    setTotalHarga(totalServis + totalBarang);
  };

  const handleAddServis = () => {
    if (!selectedServis) return setError("Pilih jenis servis dulu");

    if (listServis.some(item => item.Key === selectedServis.value)) {
      return setError("Servis sudah ditambahkan");
    }

    const newItem = {
      Key: selectedServis.value,
      No: listServis.length + 1,
      Nama: selectedServis.text,
      Harga: selectedServis.harga || 0,
      Aksi: ["Delete"],
    };

    const newList = [...listServis, newItem];
    setListServis(newList);
    hitungTotal(newList, listBarang);
    setSelectedServis(null);
    refServis.current?.resetInput();
    setError("");
  };

  const handleAddBarang = () => {
    if (!selectedBarang) return;

    const newItem = {
      Key: selectedBarang.value,
      No: listBarang.length + 1,
      Nama: selectedBarang.label,
      Harga: selectedBarang.harga,
      Jumlah: jumlahBarang,
      Subtotal: selectedBarang.harga * jumlahBarang
    };

    const updatedList = [...listBarang, newItem];
    setListBarang(updatedList);

    const total = updatedList.reduce((sum, item) => sum + item.Subtotal, 0);
    setTotalHarga(total);
  };

  const handleDeleteServis = (id) => {
    const updated = listServis.filter(item => item.Key !== id);
    setListServis(updated);
    hitungTotal(updated, listBarang);
  };

  const handleDeleteBarang = (id) => {
    const updated = listBarang.filter(item => item.Key !== id);
    setListBarang(updated);
    hitungTotal(listServis, updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.namaPemilik) return setError("Nama pemilik wajib diisi");
    if (listServis.length === 0 && listBarang.length === 0) return setError("Minimal tambah 1 servis atau barang");
      
    const formDataToSubmit = {
      idMobil: selectedMobil.value,
      idMekanik: selectedMekanik.value,
      namaPemilik: formData.namaPemilik,
      platMobil: formData.platMobil,
      total: totalHarga
    };

    const data = await UseFetch(
      API_LINK + "TransaksiServis/createTransaksiServis.php",
      formDataToSubmit,
      "POST"
    );

    for (const item of listServis) {
      const detailServis = await UseFetch(
        API_LINK + "TransaksiServis/createDetailServis.php",
        {
          idTransaksi: data.srv_id,    // Asumsinya ini ID transaksi
          idServis: item.Key     // srv_id tetap dari luar
        },
        "POST"
      );    
    }

    for (const item of listBarang) {
      const detailBarang = await UseFetch(
        API_LINK + "TransaksiServis/createDetailBarang.php",
        {
          idTransaksi: data.srv_id,    // Asumsinya ini ID transaksi
          idBarang: item.Key,
          jumlah: jumlahBarang     
        },
        "POST"
      );    
    }
    
    if (data === "ERROR") {
      swal("Oops!", "Terjadi kesalahan saat menambahkan barang.", "error");
    } else {
      swal("Sukses!", "Barang berhasil ditambahkan!", "success");
      document.getElementById("cancelButton").style.display = "none";
      document.getElementById("saveButton").style.display = "none";
      document.getElementById("printButton").classList.remove("hidden");
      document.getElementById("backButton").classList.remove("hidden");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-5">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">Tambah Transaksi Servis</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2">Nama Pemilik Mobil</label>
          <input
            type="text"
            name="namaPemilik"
            value={formData.namaPemilik}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Mobil</label>
          <Autocomplete
            ref={refMobil}
            placeholder="Cari Mobil..."
            fetchData={async (query) => {
              const data = await UseFetch(API_LINK + "MasterMobil/readMobil.php", {}, "GET");
              return data.filter((item) =>
                item.Nama.toLowerCase().includes(query.toLowerCase())
              ).map(item => ({
                label: item.Nama,
                value: item.Key
              }));
            }}
            onSelect={(item) => setSelectedMobil(item)}
            renderLabel={(item) => item.label}
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Plat Mobil</label>
          <input
            type="text"
            name="platMobil"
            value={formData.platMobil}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Mekanik</label>
          <Autocomplete
            ref={refMekanik}
            placeholder="Cari Mekanik..."
            fetchData={async (query) => {
              const data = await UseFetch(API_LINK + "MasterMekanik/readMekanik.php", {}, "GET");
              return data.filter((item) =>
                item.Nama.toLowerCase().includes(query.toLowerCase())
              ).map(item => ({
                label: item.Nama,
                value: item.Key
              }));
            }}
            onSelect={(item) => setSelectedMekanik(item)}
            renderLabel={(item) => item.label}
          />
        </div>

        {/* === Input Jenis Servis === */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-white mb-1 block">Jenis Servis</label>
            <Autocomplete
              ref={refServis}
              placeholder="Cari Jenis Servis..."
              fetchData={async (query) => {
                const data = await UseFetch(API_LINK + "MasterJenisServis/getJnsServisByMobil.php", {
                  id: idMobil
                }, "POST");
                return data.filter((item) => item.text.toLowerCase().includes(query.toLowerCase())
                ).map(item => ({
                  label: item.text,
                  value: item.value,
                  harga: item.harga
                }));
              }}
              onSelect={(item) => setSelectedServis(item)}
              renderLabel={(item) => item.label}
            />
          </div>
          <button type="button" onClick={handleAddServis} className="bg-green-600 text-white px-4 py-2 mt-6 rounded-lg">
            Tambah Servis
          </button>
        </div>
        
        {/* === Tabel Jenis Servis === */}
        <h3 className="text-white font-bold mb-2">Daftar Jenis Servis</h3>
        <Table data={listServis} onDelete={handleDeleteServis} />

        {/* === Input Jenis Barang === */}
        <div className="flex items-center gap-4 mb-2 mt-4">
          <div className="flex-1">
            <DropDown
              label="Jenis Barang"
              forInput="jenisBarang"
              value={formData.jenisBarang}
              onChange={handleChange}
              isRequired={true}
              arrData={[
                { Value: "original", Text: "Original" },
                { Value: "lokal", Text: "Lokal" },
              ]}
              errorMessage={error && !formData.jenisBarang ? "Jenis Barang harus dipilih" : ""}
            />
          </div>
        </div>

        {/* === Input Barang === */}
        <div className="flex items-end gap-4 mb-4">
          {/* Autocomplete Barang */}
          <div className="flex-1">
            <label className="text-white mb-1 block">Barang</label>
            <Autocomplete
              ref={refBarang}
              placeholder="Cari Barang..."
              fetchData={async (query) => {
                const data = await UseFetch(API_LINK + "MasterBarang/getBarangByJenis.php", {
                  jenis: formData.jenisBarang
                }, "POST");
                return data.filter((item) => item.Nama.toLowerCase().includes(query.toLowerCase())
                ).map(item => ({
                  label: item.Nama,
                  value: item.Key,
                  harga: item.Harga
                }));
              }}
              onSelect={(item) => setSelectedBarang(item)}
              renderLabel={(item) => item.label}
            />
          </div>

          {/* Jumlah Barang */}
          <div className="w-32">
            <label className="text-white mb-1 block">Jumlah</label>
            <input
              type="number"
              min="0"
              value={jumlahBarang}
              onChange={(e) => setJumlahBarang(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Tombol Tambah */}
          <div>
            <button
              type="button"
              onClick={handleAddBarang}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Tambah Barang
            </button>
          </div>
        </div>
        {/* === Tabel Barang === */}
        <h3 className="text-white font-bold mb-2">Daftar Barang</h3>
        <Table data={listBarang} onDelete={handleDeleteBarang} />

        {/* === Total Harga === */}
        <div className="mt-4">
          <label className="block text-white mb-2">Total Harga</label>
          <input
            type="text"
            value={`Rp ${totalHarga.toLocaleString("id-ID")}`}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
          />
        </div>

        {/* === Tombol Aksi === */}
        <div className="text-center mt-6 space-x-4">
          <button id="backButton" type="button" onClick={handleCancel} className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg hidden">
            Kembali
          </button>
          <button id="cancelButton" type="button" onClick={handleCancel} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg">
            Batal
          </button>
          <button id="saveButton" type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
