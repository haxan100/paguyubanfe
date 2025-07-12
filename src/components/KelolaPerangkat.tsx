import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';

interface Perangkat {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  blok: string;
  jenis: 'admin' | 'koordinator_perblok' | 'ketua';
}

export default function KelolaPerangkat() {
  const [perangkat, setPerangkat] = useState<Perangkat[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    blok: '',
    jenis: 'admin' as 'admin' | 'koordinator_perblok' | 'ketua',
    password: ''
  });

  useEffect(() => {
    fetchPerangkat();
  }, []);

  const fetchPerangkat = async () => {
    try {
      const response = await apiRequest('/api/users/perangkat');
      const result = await response.json();
      if (result.status === 'success') {
        setPerangkat(result.data);
      }
    } catch (error) {
      console.error('Error fetching perangkat:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (result.status === 'success') {
        fetchPerangkat();
        resetForm();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: editingId ? 'Perangkat berhasil diupdate' : 'Perangkat berhasil ditambahkan',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan'
      });
    }
  };

  const handleEdit = (item: Perangkat) => {
    setFormData({
      nama: item.nama,
      email: item.email,
      no_hp: item.no_hp,
      blok: item.blok,
      jenis: item.jenis,
      password: ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Perangkat?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiRequest(`/api/users/${id}`, {
          method: 'DELETE'
        });

        const deleteResult = await response.json();
        if (deleteResult.status === 'success') {
          fetchPerangkat();
          Swal.fire('Terhapus!', 'Perangkat berhasil dihapus.', 'success');
        }
      } catch (error) {
        Swal.fire('Error!', 'Gagal menghapus perangkat.', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      email: '',
      no_hp: '',
      blok: '',
      jenis: 'admin',
      password: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Perangkat Komunitas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Tambah Perangkat</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Perangkat' : 'Tambah Perangkat'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
              <select
                value={formData.jenis}
                onChange={(e) => setFormData({...formData, jenis: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="admin">Admin</option>
                <option value="koordinator_perblok">Koordinator Per Blok</option>
                <option value="ketua">Ketua</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {editingId && '(kosongkan jika tidak diubah)'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required={!editingId}
              />
            </div>
            
            <div className="col-span-2 flex space-x-2">
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No HP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {perangkat.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no_hp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.blok}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.jenis === 'ketua' ? 'bg-purple-100 text-purple-800' :
                    item.jenis === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.jenis === 'koordinator_perblok' ? 'Koordinator' : item.jenis}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}