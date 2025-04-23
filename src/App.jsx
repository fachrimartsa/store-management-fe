import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/pages/Login";  // Pastikan Login diimpor dengan benar
import Dashboard from "./component/pages/Dashboard";
import Layout from "./component/backbone/Layout";
import Mekanik from "./component/pages/master-mekanik/Index.jsx"
import Barang from "./component/pages/master-barang/Index.jsx"
import JenisServis from "./component/pages/master-jenis-servis/Index.jsx"
import KategoriMobil from "./component/pages/master-kategori/Index.jsx"
import Mobil from "./component/pages/master-mobil/Index.jsx"
import CreateMekanik from "./component/pages/master-mekanik/Create";
import UpdateMekanik from "./component/pages/master-mekanik/Update.jsx";
import Monitor from "./component/pages/Monitor.jsx";
import CreateBarang from "./component/pages/master-barang/Create.jsx";
import UpdateBarang from "./component/pages/master-barang/Update.jsx";
import CreateMobil from "./component/pages/master-mobil/Create.jsx";
import UpdateMobil from "./component/pages/master-mobil/Update.jsx";
import CreateKategori from "./component/pages/master-kategori/Create.jsx";
import DetailKategori from "./component/pages/master-kategori/Detail.jsx";
import UpdateKategori from "./component/pages/master-kategori/Update.jsx";
import CreateJenisServis from "./component/pages/master-jenis-servis/Create.jsx";
import UpdateJenisServis from "./component/pages/master-jenis-servis/Update.jsx";
import TransaksiServis from "./component/pages/transaksi-servis/Index.jsx";
import CreateTransaksiServis from "./component/pages/transaksi-servis/Create.jsx";
import DetailTransaksiServis from "./component/pages/transaksi-servis/Detail.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect ke halaman login saat aplikasi dijalankan */}
        <Route path="/" element={<Monitor/>} />

        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          {/* Route untuk konten yang berbeda sesuai menu */}
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="dataMekanik" element={<Mekanik />} />
          <Route path="dataMekanik/create" element={<CreateMekanik />} />
          <Route path="dataMekanik/update" element={<UpdateMekanik />} />

          <Route path="dataBarang" element={<Barang />} />
          <Route path="dataBarang/create" element={<CreateBarang />} />
          <Route path="dataBarang/update" element={<UpdateBarang />} />

          <Route path="dataJenisServis" element={<JenisServis />} />
          <Route path="dataJenisServis/create" element={<CreateJenisServis />} />
          <Route path="dataJenisServis/update" element={<UpdateJenisServis />} />

          <Route path="dataKategori" element={<KategoriMobil />} />
          <Route path="dataKategori/create" element={<CreateKategori />} />
          <Route path="dataKategori/detail" element={<DetailKategori />} />
          <Route path="dataKategori/update" element={<UpdateKategori />} />

          <Route path="dataMobil" element={<Mobil />} />
          <Route path="dataMobil/create" element={<CreateMobil />} />
          <Route path="dataMobil/update" element={<UpdateMobil />} />

          <Route path="transaksiServis" element={<TransaksiServis />} />
          <Route path="transaksiServis/create" element={<CreateTransaksiServis />} />
          <Route path="transaksiServis/detail" element={<DetailTransaksiServis />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;