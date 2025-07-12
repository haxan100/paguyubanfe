import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, Filter, Calendar } from 'lucide-react';
import { apiRequest } from '../utils/api';

interface SaldoData {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
}

interface BukuKasItem {
  id: number;
  type: 'pemasukan' | 'pengeluaran';
  tanggal: string;
  jumlah: number;
  nama?: string;
  judul?: string;
  deskripsi?: string;
  bukti_transfer?: string;
  foto?: string;
}

export default function BukuKas() {
  const [saldo, setSaldo] = useState<SaldoData>({ totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 });
  const [bukuKas, setBukuKas] = useState<BukuKasItem[]>([]);
  const [filteredBukuKas, setFilteredBukuKas] = useState<BukuKasItem[]>([]);
  const [currentYear] = useState(new Date().getFullYear());
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchSaldo();
    fetchBukuKas();
  }, []);

  const fetchSaldo = async () => {
    try {
      const response = await apiRequest('/api/buku-kas/saldo');
      const result = await response.json();
      if (result.status === 'success') {
        setSaldo(result.data);
      }
    } catch (error) {
      console.error('Error fetching saldo:', error);
    }
  };

  const fetchBukuKas = async () => {
    try {
      const response = await apiRequest(`/api/buku-kas/${currentYear}`);
      const result = await response.json();
      if (result.status === 'success') {
        setBukuKas(result.data);
        setFilteredBukuKas(result.data);
      }
    } catch (error) {
      console.error('Error fetching buku kas:', error);
    }
  };

  const applyFilter = () => {
    if (!filterFrom && !filterTo) {
      setFilteredBukuKas(bukuKas);
      return;
    }

    const filtered = bukuKas.filter(item => {
      const itemDate = new Date(item.tanggal);
      const fromDate = filterFrom ? new Date(filterFrom) : null;
      const toDate = filterTo ? new Date(filterTo) : null;

      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    });

    setFilteredBukuKas(filtered);
  };

  const resetFilter = () => {
    setFilterFrom('');
    setFilterTo('');
    setFilteredBukuKas(bukuKas);
  };

  useEffect(() => {
    applyFilter();
  }, [filterFrom, filterTo, bukuKas]);

  const exportBukuKas = async () => {
    try {
      const response = await apiRequest(`/api/buku-kas/export/${currentYear}`);
      const result = await response.json();
      if (result.status === 'success') {
        const csvContent = [
          ['Tanggal', 'Bulan', 'Jenis', 'Keterangan', 'Pemasukan', 'Pengeluaran', 'Foto'].join(','),
          ...result.data.map((item: any) => [
            item.tanggal,
            item.bulan,
            item.jenis,
            item.keterangan,
            item.pemasukan,
            item.pengeluaran,
            item.foto
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `buku-kas-${currentYear}.csv`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting buku kas:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Buku Kas</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Filter size={20} />
            <span>Filter</span>
          </button>
          <button
            onClick={exportBukuKas}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Filter Tanggal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilter}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saldo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-green-500" size={24} />
            <div>
              <p className="text-sm font-medium text-green-600">Total Pemasukan</p>
              <p className="text-xl font-bold text-green-700">
                Rp {saldo.totalPemasukan.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <TrendingDown className="text-red-500" size={24} />
            <div>
              <p className="text-sm font-medium text-red-600">Total Pengeluaran</p>
              <p className="text-xl font-bold text-red-700">
                Rp {saldo.totalPengeluaran.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`${saldo.saldo >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
          <div className="flex items-center space-x-3">
            <DollarSign className={`${saldo.saldo >= 0 ? 'text-blue-500' : 'text-yellow-500'}`} size={24} />
            <div>
              <p className={`text-sm font-medium ${saldo.saldo >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>Saldo</p>
              <p className={`text-xl font-bold ${saldo.saldo >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>
                Rp {saldo.saldo.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rasio Pengeluaran</p>
              <p className="text-xl font-bold text-gray-700">
                {saldo.totalPemasukan > 0 ? Math.round((saldo.totalPengeluaran / saldo.totalPemasukan) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buku Kas Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Riwayat Transaksi {currentYear}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pemasukan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengeluaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bukti
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBukuKas.map((item, index) => (
                <tr key={`${item.type}-${item.id}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.type === 'pemasukan' ? (
                      <div>
                        <span className="font-medium">Pembayaran - {item.nama}</span>
                        <div className="text-xs text-gray-500">Pemasukan warga</div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium">{item.judul}</span>
                        <div className="text-xs text-gray-500">{item.deskripsi}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.type === 'pemasukan' ? (
                      <span className="text-green-600 font-semibold">
                        +Rp {item.jumlah.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.type === 'pengeluaran' ? (
                      <span className="text-red-600 font-semibold">
                        -Rp {item.jumlah.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(item.bukti_transfer || item.foto) && (
                      <img
                        src={`/assets/uploads/${item.bukti_transfer || item.foto}`}
                        alt="Bukti"
                        className="w-12 h-8 object-cover rounded cursor-pointer"
                        onClick={() => window.open(`/assets/uploads/${item.bukti_transfer || item.foto}`, '_blank')}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}