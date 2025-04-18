import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
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

const dataLine = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Okt','Nov','Des'],
  datasets: [
    {
      label: 'Value',
      data: [4000, 3000, 2000, 2780, 1890, 2390, 4000, 3000, 2000, 2780, 1890, 2390],
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
    },
  ],
};

const dataBar = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Okt','Nov','Des'],
  datasets: [
    {
      label: 'UV',
      data: [4000, 3000, 2000, 2780, 1890, 2390, 4000, 3000, 2000, 2780, 1890, 2390],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white p-10">
      <h2 className="text-4xl font-semibold text-center text-blue-900 mb-8">Dashboard MJL</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card title="Pemasukan Hari Ini" value="Rp 5.000.000" color="bg-green-500" />
        <Card title="Pelanggan Hari Ini" value="120" color="bg-blue-500" />
        <Card title="Total Servis Bulan Ini" value="320" color="bg-yellow-500" />
        <Card title="Total Pendapatan Bulan Ini" value="Rp 75.000.000" color="bg-purple-500" />
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
