import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import UseFetch from "../util/UseFetch";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { API_LINK } from '../util/Constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [transactionDay, setTransactionDay] = useState("");
  const [transactionMonth, setTransactionMonth] = useState([]);
  const [lineTransaction, setLineTransaction] = useState([]);
  const [lineIncome, setLineIncome] = useState([]);
  const [incomeDay, setIncomeDay] = useState("");
  const [incomeMonth, setIncomeMonth] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactionDay = async () => {
    setIsError(false);
    try {
      const data = await UseFetch(API_LINK + "Dashboard/transactionDay.php", {}, "GET");
      if (data === "ERROR") {
        setIsError(true);
      } else if (data.length === 0) {
        setTransactionDay(0);
      } else {
        setTransactionDay(data.total_transaksi);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactionMonth = async () => {
    setIsError(false);
    try {
      const data = await UseFetch(API_LINK + "Dashboard/transactionMonth.php", {}, "GET");
      if (data === "ERROR") {
        setIsError(true);
      } else if (data.length === 0) {
        setTransactionMonth(0);
      } else {
        const currentMonth = new Date().getMonth(); // Mendapatkan bulan saat ini (0-11)
        const currentData = data.find(item => new Date(Date.parse(item.bulan + " 1, 2025")).getMonth() === currentMonth);
        setLineTransaction(data);
        if (currentData) {
          setTransactionMonth(currentData.total_transaksi);
        } else {
          setTransactionMonth(0);
        }
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIncomeDay = async () => {
    setIsError(false);
    try {
      const data = await UseFetch(API_LINK + "Dashboard/incomeDay.php", {}, "GET");
      if (data === "ERROR") {
        setIsError(true);
      } else if (data.length === 0) {
        setIncomeDay(0);
      } else {
        setIncomeDay(data.total_pemasukan);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIncomeMonth = async () => {
    setIsError(false);
    try {
      const data = await UseFetch(API_LINK + "Dashboard/incomeMonth.php", {}, "GET");
      if (data === "ERROR") {
        setIsError(true);
      } else if (data.length === 0) {
        setIncomeMonth(0);
      } else {
        const currentMonth = new Date().getMonth(); // Mendapatkan bulan saat ini (0-11)
        const currentData = data.find(item => new Date(Date.parse(item.bulan + " 1, 2025")).getMonth() === currentMonth);
        setLineIncome(data);
        if (currentData) {
          setIncomeMonth(currentData.total_pemasukan);
        } else {
          setIncomeMonth(0);
        }
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Format incomeDay as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    fetchTransactionDay();
    fetchTransactionMonth();
    fetchIncomeDay();
    fetchIncomeMonth();
  }, []);

  const dataLine = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: 'Value',
        data:  lineTransaction.map(item => item.total_transaksi),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };
  
  const dataBar = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: 'UV',
        data: lineIncome.map(item => item.total_pemasukan),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  function Card({ title, value, color }) {
    return (
      <div className={`p-6 ${color} text-white rounded-lg shadow-md text-center`}>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
    );
  }
  
  function ChartCard({ title, children }) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-medium text-gray-700 mb-4">{title}</h3>
        <div style={{ height: '300px' }}>{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-10">
      <h2 className="text-4xl font-semibold text-center text-blue-900 mb-8">Dashboard MJL</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card title="Pemasukan Hari Ini" value={formatCurrency(incomeDay)} color="bg-green-500" />
        <Card title="Pelanggan Hari Ini" value={transactionDay} color="bg-blue-500" />
        <Card title="Total Servis Bulan Ini" value={transactionMonth} color="bg-yellow-500" />
        <Card title="Total Pendapatan Bulan Ini" value={formatCurrency(incomeMonth)} color="bg-purple-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ChartCard title="Servis Per Bulan">
          <Line data={dataLine} />
        </ChartCard>
        <ChartCard title="Pemasukan Per Bulan">
          <Bar data={dataBar} />
        </ChartCard>
      </div>
    </div>
  );
}