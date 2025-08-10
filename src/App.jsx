import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/pages/Login";
import Dashboard from "./component/pages/Dashboard";
import Layout from "./component/backbone/Layout";
import Supplier from "./component/pages/master-supplier/Index.jsx"
import CreateSupplier from "./component/pages/master-supplier/Create.jsx"
import UpdateSupplier from "./component/pages/master-supplier/Update.jsx"
import Barang from "./component/pages/master-barang/Index.jsx"
import CreateBarang from "./component/pages/master-barang/Create.jsx"
import UpdateBarang from "./component/pages/master-barang/Update.jsx"
import Pengeluaran from "./component/pages/transaksi-pengeluaran/Index.jsx"
import CreatePengeluaran from "./component/pages/transaksi-pengeluaran/Create.jsx"
import Pembelian from "./component/pages/transaksi-pembelian/Index.jsx"
import CreatePembelian from "./component/pages/transaksi-pembelian/Create.jsx"
import Penjualan from "./component/pages/transaksi-penjualan/Index.jsx"
import CreatePenjualan from "./component/pages/transaksi-penjualan/Create.jsx"

function App() {
  return (
    <Router basename="/store-management-fe">
      <Routes>
        {/* Rute untuk halaman login */}
        <Route path="/login" element={<Login />} />

        {/* Semua rute yang menggunakan Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="data-supplier" element={<Supplier />} />
          <Route path="data-supplier/create" element={<CreateSupplier />} />
          <Route path="data-supplier/update" element={<UpdateSupplier />} />

          <Route path="data-barang" element={<Barang />}/>
          <Route path="data-barang/create" element={<CreateBarang />}/>
          <Route path="data-barang/update" element={<UpdateBarang />}/>

          <Route path="transaksi-pengeluaran" element={<Pengeluaran />}/>
          <Route path="transaksi-pengeluaran/create" element={<CreatePengeluaran />}/>

          <Route path="transaksi-pembelian" element={<Pembelian />}/>
          <Route path="transaksi-pembelian/create" element={<CreatePembelian />}/>

          <Route path="transaksi-penjualan" element={<Penjualan />}/>
          <Route path="transaksi-penjualan/create" element={<CreatePenjualan />}/>
        </Route>
        {/* Jika ada rute yang tidak ditemukan, bisa ditambahkan halaman 404 di sini */}
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </Router>
  );
}

export default App;