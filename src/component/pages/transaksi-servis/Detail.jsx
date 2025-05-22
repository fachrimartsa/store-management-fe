import { useEffect, useState } from "react";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import { useLocation, useNavigate } from "react-router-dom";

const inisialisasiBarang = [
  {
    Key: null,
    No: null,
    Nama: null,
    "Jenis Barang": null,
    Harga: null,
  },
];

const inisialisasiServis = [
  {
    Key: null,
    No: null,
    Nama: null,
    Harga: null,
  },
];

export default function DetailTransaksiServis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transaksiId } = location.state || {}; 
  const [formData, setFormData] = useState({
    id: "",
    namaMekanik: "",
    namaPemilik: "",
    mobil: "",
    platMobil: "",
    tanggal: "",
  });
  const [error, setError] = useState("");
  const [totalHarga, setTotalHarga] = useState(0);
  const [barangList, setBarangList] = useState(inisialisasiBarang);
  const [servisList, setServisList] = useState(inisialisasiServis);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);


  const handleCancel = () => {
    navigate("/transaksiServis");
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "TransaksiServis/getTransaksiById.php", { id: transaksiId }, "POST");
        if (data && data.message && data.message === "Tidak ada kategori ditemukan") {
          setIsError(true);
        } else {
          setFormData({
            id: data.Key || "",
            namaPemilik: data["Nama Pemilik"] || "",
            namaMekanik: data["Nama Mekanik"] || "",
            mobil: data["Nama Mobil"] || "",
            platMobil: data["Plat Mobil"] || "",
            tanggal: data["Tanggal Transaksi"] || "",
          });
          setTotalHarga(data["Total Biaya"]);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDetailBarang = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "TransaksiServis/getBarangByIdTransaksi.php", { id: transaksiId }, "POST");
        if (data && data.message && data.message === "Tidak ada kategori ditemukan") {
          setIsError(true);
        } else {
          setBarangList(data);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

     const fetchDetailServis = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(API_LINK + "TransaksiServis/getServisByIdTransaksi.php", { id: transaksiId }, "POST");
        if (data && data.message && data.message === "Tidak ada kategori ditemukan") {
          setIsError(true);
        } else {
          setServisList(data);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchDetailBarang();
    fetchDetailServis();
  }, [transaksiId]);


  return (
    <div className="max-w-4xl mx-auto bg-blue-800 p-8 rounded-lg shadow-lg mt-5">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        Detail Transaksi
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form>
        <div className="mb-4">
          <label className="block text-white mb-2">Nama Pemilik Mobil</label>
          <input
            type="text"
            name="nama"
            placeholder="Masukkan Nama"
            value={formData.namaPemilik}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
            <label className="block text-white mb-2">Mobil</label>
            <input
            type="text"
            name="mobil"
            placeholder="Masukkan Mobil"
            value={formData.mobil}
            className="w-full p-2 border border-gray-300 rounded-lg"
            />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Plat Mobil</label>
          <input
            type="text"
            name="platMobil"
            placeholder="Masukkan Plat Mobil"
            value={formData.platMobil}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
            <label className="block text-white mb-2">Mekanik</label>
            <input
            type="text"
            name="mekanik"
            placeholder="Masukkan Mekanik"
            value={formData.namaMekanik}
            className="w-full p-2 border border-gray-300 rounded-lg"
            />
        </div>

        <div className="mb-4">
            <label className="block text-white mb-2">Tanggal Transaksi</label>
            <input
            type="text"
            name="tanggal"
            placeholder="Masukkan Tanggal"
            value={formData.tanggal}
            className="w-full p-2 border border-gray-300 rounded-lg"
            />
        </div>

        <div className="mt-6 mb-4">
          <label className="block text-white mb-2">Jenis Servis</label>
          <Table
            data={servisList} 
          />
        </div>

        <div className="mt-6">
          <label className="block text-white mb-2">Barang</label>
          <Table
            data={barangList} 
          />
        </div>

        <div className="mt-4">
          <label className="block text-white mb-2">Total Harga</label>
          <input
            type="text"
            value={`Rp ${totalHarga.toLocaleString("id-ID")}`}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
          />
        </div>

        <div className="text-center space-x-5 mt-5">
          <button
            type="button"
            className="bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded-lg text-lg"
            onClick={handleCancel}
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
