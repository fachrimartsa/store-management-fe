import React, { useEffect, useRef, useState } from "react";
import Table from "../part/Table";
import { API_LINK } from "../util/Constants";
import UseFetch from "../util/UseFetch";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Mobil: null,
    "No Plat": null,
    "Tanggal": null,
    "Jenis Servis": null,
    "Estimasi Waktu": null,
    Status: null,
    "Waktu Pengerjaan": null,
  },
];

export default function Monitor() {
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const startTimesRef = useRef({});
  const currentDataRef = useRef(inisialisasiData);

  // ✅ Format waktu ke HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const data = await UseFetch(API_LINK + "monitor.php", {}, "GET");

      if (data === "ERROR" || !data || data.length === 0) {
        setCurrentData(inisialisasiData);
        currentDataRef.current = inisialisasiData;
      } else {
        const now = Date.now();
        const updatedStartTimes = { ...startTimesRef.current };
        const existingKeys = new Set(currentDataRef.current.map(item => item.Key));

        const newData = data.filter(item => !existingKeys.has(item.Key));

        if (newData.length > 0) {
          const formattedNew = newData.map((item) => {
            const key = item.Key;
            updatedStartTimes[key] = now;

            return {
              ...item,
              "Waktu Pengerjaan": "00:00:00",
              Alignment: ["center", "center", "center", "center", "center", "center", "center", "center"],
            };
          });

          const updatedData = [...currentDataRef.current, ...formattedNew];
          setCurrentData(updatedData);
          currentDataRef.current = updatedData;
          startTimesRef.current = updatedStartTimes;
        }
      }
    } catch {
      setIsError(true);
      setCurrentData(inisialisasiData);
      currentDataRef.current = inisialisasiData;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Update waktu pengerjaan setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      const updatedData = currentDataRef.current.map((item, index) => {
        const key = item.Key || index;
        const start = startTimesRef.current[key];
        if (!start) return item;

        const diffSec = Math.floor((now - start) / 1000);
        const waktuStr = formatTime(diffSec);

        return {
          ...item,
          "Waktu Pengerjaan": waktuStr,
        };
      });

      setCurrentData(updatedData);
      currentDataRef.current = updatedData;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch awal & refresh 30 detik
  useEffect(() => {
    fetchData();

    const refresh = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(refresh);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">Monitor Servis</h1>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Memuat data...</div>
      ) : isError ? (
        <div className="text-center text-red-500">Terjadi kesalahan saat mengambil data.</div>
      ) : (
        <Table data={currentData} />
      )}
    </div>
  );
}
