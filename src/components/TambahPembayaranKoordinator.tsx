import React, { useState, useEffect } from 'react';
import { Plus, Upload, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Warga {
  id: number;
  nama: string;
  email: string;
  blok: string;
}

export default function TambahPembayaranKoordinator() {
  const { user } = useAuth();
  const [wargaList, setWargaList] = useState<Warga[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    warga_id: '',
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1,
    jumlah: '',
    keterangan: '',
    bukti_transfer: null as File | null
  });

  const bulanNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  useEffect(() => {
    fetchWargaBlok();
  }, []);

  const fetchWargaBlok = async () => {
    try {
      const response = await apiRequest('/api/warga');
      const result = await response.json();
      if (result.status === 'success') {
        // Filter warga sesuai blok koordinator
        const userBlok = user?.blok?.charAt(0);
        const filteredWarga = result.data.filter((w: Warga) => 
          w.blok?.charAt(0) === userBlok
        );
        setWargaList(filteredWarga);
      }
    } catch (error) {
      console.error('Error fetching warga:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({...formData, bukti_transfer: e.target.files[0]});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bukti_transfer) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Bukti transfer harus diupload'
      });
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('user_id', formData.warga_id);
      submitData.append('tahun', formData.tahun.toString());
      submitData.append('bulan', formData.bulan.toString());
      submitData.append('jumlah', formData.jumlah);
      submitData.append('keterangan', formData.keterangan);
      submitData.append('bukti_transfer', formData.bukti_transfer);
      submitData.append('status', 'confirmed'); // Koordinator langsung confirm

      const response = await apiRequest('/api/payments', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();
      if (result.status === 'success') {
        setShowForm(false);
        setFormData({
          warga_id: '',
          tahun: new Date().getFullYear(),
          bulan: new Date().getMonth() + 1,
          jumlah: '',
          keterangan: '',
          bukti_transfer: null
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pembayaran berhasil ditambahkan',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menambahkan pembayaran'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      warga_id: '',
      tahun: new Date().getFullYear(),
      bulan: new Date().getMonth() + 1,
      jumlah: '',
      keterangan: '',
      bukti_transfer: null
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Pembayaran Warga</h1>
          <p className="text-gray-600">Blok {user?.blok}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Tambah Pembayaran</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Form Pembayaran</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Warga</label>
                <select
                  value={formData.warga_id}
                  onChange={(e) => setFormData({...formData, warga_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Pilih Warga</option>
                  {wargaList.map((warga) => (
                    <option key={warga.id} value={warga.id}>
                      {warga.nama} - {warga.blok}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                <input
                  type="number"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Contoh: 150000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <select
                  value={formData.tahun}
                  onChange={(e) => setFormData({...formData, tahun: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  {[2024, 2025, 2026].map(year => (
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
                  {bulanNames.map((bulan, index) => (
                    <option key={index + 1} value={index + 1}>{bulan}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <textarea
                value={formData.keterangan}
                onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Keterangan pembayaran (opsional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Transfer</label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="bukti-transfer"
                  required
                />
                <label
                  htmlFor="bukti-transfer"
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer"
                >
                  <Upload size={16} />
                  <span>Upload Bukti</span>
                </label>
                {formData.bukti_transfer && (
                  <span className="text-sm text-green-600">
                    {formData.bukti_transfer.name}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save size={16} />
                <span>Simpan</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <X size={16} />
                <span>Batal</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Informasi</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Anda dapat menambahkan pembayaran untuk warga di blok {user?.blok}</li>
          <li>• Pembayaran yang ditambahkan akan langsung terkonfirmasi</li>
          <li>• Pastikan bukti transfer sudah benar sebelum menyimpan</li>
        </ul>
      </div>
    </div>
  );
}