import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';

interface WargaData {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  blok: string;
  created_at: string;
}

export default function KelolaWargaAdmin() {
  const [warga, setWarga] = useState<WargaData[]>([]);
  const [blokList, setBlokList] = useState<string[]>([]);
  const [selectedBlok, setSelectedBlok] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWarga, setEditingWarga] = useState<WargaData | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    blok: '',
    password: ''
  });

  useEffect(() => {
    fetchWarga();
    fetchBlokList();
  }, []);

  useEffect(() => {
    fetchWarga();
  }, [selectedBlok]);

  const fetchWarga = async () => {
    try {
      const url = selectedBlok ? `/api/warga?blok=${selectedBlok}` : '/api/warga';
      const response = await apiRequest(url);
      const result = await response.json();
      if (result.status === 'success') {
        setWarga(result.data);
      }
    } catch (error) {
      console.error('Error fetching warga:', error);
    }
  };

  const fetchBlokList = async () => {
    try {
      const response = await apiRequest('/api/warga/blok');
      const result = await response.json();
      if (result.status === 'success') {
        setBlokList(result.data);
      }
    } catch (error) {
      console.error('Error fetching blok list:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingWarga ? `/api/warga/${editingWarga.id}` : '/api/warga';
      const method = editingWarga ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (result.status === 'success') {
        setShowModal(false);
        setEditingWarga(null);
        setFormData({ nama: '', email: '', no_hp: '', blok: '', password: '' });
        fetchWarga();
        fetchBlokList();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: result.message,
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
        text: error instanceof Error ? error.message : 'Terjadi kesalahan'
      });
    }
  };

  const handleEdit = (wargaItem: WargaData) => {
    setEditingWarga(wargaItem);
    setFormData({
      nama: wargaItem.nama,
      email: wargaItem.email,
      no_hp: wargaItem.no_hp,
      blok: wargaItem.blok,
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, nama: string) => {
    const result = await Swal.fire({
      title: 'Hapus Warga?',
      text: `Apakah Anda yakin ingin menghapus ${nama}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiRequest(`/api/warga/${id}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        if (data.status === 'success') {
          fetchWarga();
          fetchBlokList();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: data.message,
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus data warga'
        });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Users size={32} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Warga</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Tambah Warga</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Filter size={20} className="text-gray-600" />
        <select
          value={selectedBlok}
          onChange={(e) => setSelectedBlok(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Semua Blok</option>
          {blokList.map((blok) => (
            <option key={blok} value={blok}>Blok {blok}</option>
          ))}
        </select>
        <span className="text-sm text-gray-600">
          Total: {warga.length} warga
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No HP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terdaftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warga.map((wargaItem) => (
                <tr key={wargaItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{wargaItem.nama}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {wargaItem.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {wargaItem.no_hp || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Blok {wargaItem.blok}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(wargaItem.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(wargaItem)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(wargaItem.id, wargaItem.nama)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
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
            <h3 className="text-lg font-semibold mb-4">
              {editingWarga ? 'Edit Warga' : 'Tambah Warga'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
                <input
                  type="text"
                  value={formData.no_hp}
                  onChange={(e) => setFormData({...formData, no_hp: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blok</label>
                <input
                  type="text"
                  value={formData.blok}
                  onChange={(e) => setFormData({...formData, blok: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Contoh: A1, B2, C3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser && '(Kosongkan jika tidak ingin mengubah)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required={!editingWarga}
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingWarga ? 'Update' : 'Tambah'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingWarga(null);
                    setFormData({ nama: '', email: '', no_hp: '', blok: '', password: '' });
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