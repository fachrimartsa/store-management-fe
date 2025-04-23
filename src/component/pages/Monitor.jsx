import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../part/Table";
import mjl from "../../assets/mjl.jfif"

export default function Monitor() {
  const data = [
    {
      Key: null,
      No: null,
      Nama: null,
      Mobil: null,
      "No Plat": null,
      Mekanik: null,
      "Estimasi Waktu": null,
      "Waktu Aktual": null,
      Status: null
    },
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
