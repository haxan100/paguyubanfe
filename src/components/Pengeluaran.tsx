import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Calendar, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface PengeluaranData {
  id: number;
  tahun: number;
  bulan: number;
  jumlah: number;
  judul: string;
  deskripsi: string;
  foto: string;
  admin_nama: string;
  tanggal_dibuat: string;
  tanggal_digunakan?: string;
}

export default function Pengeluaran() {
  const { user } = useAuth();
  const [pengeluaran, setPengeluaran] = useState<PengeluaranData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    tahun: currentYear,
    bulan: new Date().getMonth() + 1,
    jumlah: '',
    judul: '',
    deskripsi: '',
    tanggal_digunakan: new Date().toISOString().split('T')[0]
  });
  const [foto, setFoto] = useState<File | null>(null);

  const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  useEffect(() => {
    fetchPengeluaran();
  }, []);

  const fetchPengeluaran = async () => {
    try {
      const response = await apiRequest('/api/pengeluaran');
      const result = await response.json();
      if (result.status === 'success') {
        setPengeluaran(result.data);
      }
    } catch (error) {
      console.error('Error fetching pengeluaran:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foto) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Foto bukti wajib diupload'
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('tahun', formData.tahun.toString());
      formDataToSend.append('bulan', formData.bulan.toString());
      formDataToSend.append('jumlah', formData.jumlah);
      formDataToSend.append('judul', formData.judul);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('tanggal_digunakan', formData.tanggal_digunakan);
      formDataToSend.append('foto', foto);

      const response = await apiRequest('/api/pengeluaran', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();
      if (result.status === 'success') {
        setShowModal(false);
        setFormData({
          tahun: currentYear,
          bulan: new Date().getMonth() + 1,
          jumlah: '',
          judul: '',
          deskripsi: '',
          tanggal_digunakan: new Date().toISOString().split('T')[0]
        });
        setFoto(null);
        fetchPengeluaran();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pengeluaran berhasil ditambahkan',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menambahkan pengeluaran'
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Pengeluaran?',
      text: 'Data pengeluaran akan dihapus permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiRequest(`/api/pengeluaran/${id}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        if (data.status === 'success') {
          fetchPengeluaran();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Pengeluaran berhasil dihapus',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus pengeluaran'
        });
      }
    }
  };

  const exportPengeluaran = async () => {
    try {
      const response = await apiRequest(`/api/pengeluaran/export/${currentYear}`);
      const result = await response.json();
      if (result.status === 'success') {
        const csvContent = [
          ['Tanggal Dibuat', 'Tanggal Digunakan', 'Bulan', 'Judul', 'Jumlah', 'Deskripsi', 'Admin', 'Foto'].join(','),
          ...result.data.map((item: any) => [
            item.tanggal_dibuat,
            item.tanggal_digunakan,
            item.bulan,
            item.judul,
            item.jumlah,
            item.deskripsi,
            item.admin,
            item.foto
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pengeluaran-${currentYear}.csv`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting pengeluaran:', error);
    }
  };

  const canManage = user && ['ketua', 'admin'].includes(user.jenis);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pengeluaran</h2>
        <div className="flex space-x-2">
          <button
            onClick={exportPengeluaran}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download size={20} />
            <span>Export {currentYear}</span>
          </button>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              <span>Tambah Pengeluaran</span>
            </button>
          )}
        </div>
      </div>

      {/* Pengeluaran Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Digunakan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bukti
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pengeluaran.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.tanggal_digunakan ? new Date(item.tanggal_digunakan).toLocaleDateString('id-ID') : '-'}
                    <div className="text-xs text-gray-500">
                      Dibuat: {new Date(item.tanggal_dibuat).toLocaleDateString('id-ID')}
                    </div>
                    <div className="text-xs text-blue-600">
                      {bulanNames[item.bulan - 1]} {item.tahun}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.judul}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                    Rp {item.jumlah.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {item.deskripsi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.admin_nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <img
                      src={`/assets/uploads/${item.foto}`}
                      alt="Bukti"
                      className="w-16 h-12 object-cover rounded cursor-pointer"
                      onClick={() => window.open(`/assets/uploads/${item.foto}`, '_blank')}
                    />
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus pengeluaran"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Tambah Pengeluaran</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                  <select
                    value={formData.tahun}
                    onChange={(e) => setFormData({...formData, tahun: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                  <select
                    value={formData.bulan}
                    onChange={(e) => setFormData({...formData, bulan: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    {bulanNames.map((nama, index) => (
                      <option key={index + 1} value={index + 1}>{nama}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                <input
                  type="number"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Digunakan</label>
                <input
                  type="date"
                  value={formData.tanggal_digunakan}
                  onChange={(e) => setFormData({...formData, tanggal_digunakan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                {foto && (
                  <img
                    src={URL.createObjectURL(foto)}
                    alt="Preview"
                    className="mt-2 w-32 h-24 object-cover rounded"
                  />
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      tahun: currentYear,
                      bulan: new Date().getMonth() + 1,
                      jumlah: '',
                      judul: '',
                      deskripsi: '',
                      tanggal_digunakan: new Date().toISOString().split('T')[0]
                    });
                    setFoto(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}