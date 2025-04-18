import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../part/Table";
import mjl from "../../assets/mjl.jfif"

export default function Monitor() {
  const data = [
    { no: 1, mobil: "Toyota Avanza", mekanik: "Ujang Surijang", estimasiWaktu: "2 Jam", waktuBerjalan: "1 Jam 30 Menit", status: "Selesai" },
    { no: 2, mobil: "Honda Civic", mekanik: "Tatang Kutang", estimasiWaktu: "1 Jam 30 Menit", waktuBerjalan: "1 Jam 15 Menit", status: "Selesai" },
    { no: 3, mobil: "Suzuki Swift", mekanik: "Andi Pratama", estimasiWaktu: "1 Jam", waktuBerjalan: "45 Menit", status: "Dalam Proses" },
    { no: 4, mobil: "Nissan X-Trail", mekanik: "Budi Santoso", estimasiWaktu: "3 Jam", waktuBerjalan: "2 Jam 45 Menit", status: "Dalam Proses" }
  ];  

  const navigate = useNavigate();

  return (
    <div className="">
      {/* Header tanpa padding kiri dan kanan */}
      <header className="bg-blue-600 text-white py-4 flex justify-between items-center">
        {/* Logo di pojok kiri */}
        <div className="flex items-center">
          <img src={mjl} alt="Logo" className="ml-3 w-10 h-10 rounded-full border-2 border-white" /> {/* Ganti path ke logo Anda */}
        </div>
      </header>
      
      <div className="mb-6">
        {/* Tempat untuk elemen tambahan atau navigasi jika diperlukan */}
      </div>

      {/* Tabel Data dengan padding */}
      <div className="p-12">
        <Table data={data} />
      </div>
    </div>
  );
}
