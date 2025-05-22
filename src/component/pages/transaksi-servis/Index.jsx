import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../part/Table";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import swal from 'sweetalert';
import * as XLSX from "xlsx";

const inisialisasiData = [
    {
        Key: null,
        No: null,
        Nama: null,
        Mobil: null,
        "No Plat": null,
        Mekanik: null,
        "Estimasi Waktu": null,
        "Waktu Aktual": null,
        Status: null,
        Aksi: null,
    },
];

const formatRupiah = (angka) => {
    return `Rp.${new Intl.NumberFormat("id-ID").format(angka)}`;
};

export default function IndexPage() {
    const navigate = useNavigate();
    const [currentData, setCurrentData] = useState(inisialisasiData);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleClick = () => {
        navigate("/transaksiServis/create");
    };

    const handleDetail = (transaksiId) => {
        navigate("/transaksiServis/detail", { state: { transaksiId } });
    };

    const handleUpdate = (transaksiId) => {
        swal({
            title: "Apakah Anda yakin?",
            text: "Servis Mobil Ini Telah Selesai!",
            icon: "warning",
            buttons: ["Batal", "Yakin"],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    const data = await UseFetch(
                        API_LINK + "TransaksiServis/updateTransaksi.php",
                        {
                            id: transaksiId,
                            status: "Selesai"
                        },
                        "POST"
                    );
                    console.log(data);

                    if (data === "ERROR") {
                        throw new Error("Gagal memperbaharui data");
                    }

                    swal("Sukses", "Transaksi Selesai", "success");
                    fetchData();

                } catch (error) {
                    swal("Error", "Terjadi kesalahan saat menyelesaikan transaksi", "error");
                }
            }
        });
    };

    const fetchData = async () => {
        setIsError(false);
        try {
            const data = await UseFetch(API_LINK + "TransaksiServis/readTransaksi.php", {}, "GET");
            if (data === "ERROR") {
                setIsError(true);
            } else if (data.length === 0) {
                setCurrentData(inisialisasiData);
            } else {
                const formattedData = data.map((value) => {
                    const aksi = value["Status Servis"] !== "Selesai" ? ["Edit", "Detail"] : ["Detail"];  // Hanya tampilkan "Edit" jika status tidak "Selesai"
                    return {
                        ...value,
                        "Total Biaya": formatRupiah(value["Total Biaya"]),
                        Aksi: aksi,
                        Alignment: ["center", "center", "center", "center"],
                    };
                });
                setCurrentData(formattedData);
            }
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCetak = () => {
      if (!currentData || currentData.length === 0) {
        alert("Tidak ada data untuk dicetak!");
        return;
      }

      // const filteredData = currentData.map((item) => ({
      //   No: item.No,
      //   Kegiatan: item["Kegiatan"],
      //   "Jumlah Penerima Manfaat": item["Jumlah Penerima Manfaat"],
      //   "Asal Penerima Manfaat": item["Asal Penerima Manfaat"],
      //   "Waktu Pelaksanaan": item["Waktu Pelaksanaan"],
      //   Biaya: item["Biaya"],
      //   Status: item.Status,
      // }));

      // Membuat worksheet dari data
      const worksheet = XLSX.utils.json_to_sheet(currentData);

      // Membuat workbook dan menambahkan worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Membuat file Excel dan otomatis mendownload
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Membuat blob untuk mengunduh
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Membuat URL dan trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "TransaksiServis.xlsx"); // Nama file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold text-blue-900 mb-4">Data Transaksi Servis</h1>
            <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                <button
                    onClick={handleClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    Tambah Transaksi
                </button>
                <button
                    onClick={handleCetak}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                >
                    Export Excel
                </button>
            </div>
            <Table
                data={currentData}
                onDetail={handleDetail}
                onEdit={handleUpdate} />
        </div>
    );
}

