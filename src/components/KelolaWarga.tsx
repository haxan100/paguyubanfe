import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Warga {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  blok: string;
  created_at: string;
}

export default function KelolaWarga() {
  const { user } = useAuth();
  const [warga, setWarga] = useState<Warga[]>([]);
  const [filteredWarga, setFilteredWarga] = useState<Warga[]>([]);
  const [selectedBlok, setSelectedBlok] = useState<string>('semua');
  const [showModal, setShowModal] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  const [wargaForm, setWargaForm] = useState({
    nama: '',
    email: '',
    no_hp: '',
    blok: '',
    password: ''
  });

  useEffect(() => {
    fetchWarga();
  }, []);

  useEffect(() => {
    filterWarga();
  }, [warga, selectedBlok]);

  const filterWarga = () => {
    if (selectedBlok === 'semua') {
      setFilteredWarga(warga);
    } else {
      const filtered = warga.filter(w => w.blok?.charAt(0) === selectedBlok);
      setFilteredWarga(filtered);
    }
  };

  const blokOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

  const fetchWarga = async () => {
    try {
      const response = await apiRequest('/api/warga');
      const result = await response.json();
      if (result.status === 'success') {
        setWarga(result.data);
      }
    } catch (error) {
      console.error('Error fetching warga:', error);
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
        body: JSON.stringify(wargaForm)
      });

      const result = await response.json();
      if (result.status === 'success') {
        setShowModal(false);
        setEditingWarga(null);
        setWargaForm({ nama: '', email: '', no_hp: '', blok: '', password: '' });
        fetchWarga();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: editingWarga ? 'Warga berhasil diupdate' : 'Warga berhasil ditambahkan',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menyimpan warga'
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Warga?',
      text: 'Warga akan dihapus permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiRequest(`/api/warga/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.status === 'success') {
          fetchWarga();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Warga berhasil dihapus',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus warga'
        });
      }
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>Kelola Warga</h1>
        <div className="flex space-x-4">
          {(user?.jenis === 'ketua' || user?.jenis === 'admin') && (
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={selectedBlok}
                onChange={(e) => setSelectedBlok(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="semua">Semua Blok</option>
                {blokOptions.map(blok => (
                  <option key={blok} value={blok}>Blok {blok}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${isMobile ? 'text-sm' : ''}`}
          >
            <Plus size={16} />
            <span>Tambah Warga</span>
          </button>
        </div>
      </div>
      
      {isMobile ? (
        // Mobile Card Layout
        <div className="space-y-4">
          {filteredWarga.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.nama}</h3>
                  <p className="text-sm text-gray-600">{item.email}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Warga
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>HP: {item.no_hp}</p>
                <p>Blok: {item.blok}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingWarga(item);
                    setWargaForm({
                      nama: item.nama,
                      email: item.email,
                      no_hp: item.no_hp,
                      blok: item.blok,
                      password: ''
                    });
                    setShowModal(true);
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop Table Layout
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No HP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWarga.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.no_hp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.blok}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Warga
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setEditingWarga(item);
                        setWargaForm({
                          nama: item.nama,
                          email: item.email,
                          no_hp: item.no_hp,
                          blok: item.blok,
                          password: ''
                        });
                        setShowModal(true);
                      }}
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
              {filteredWarga.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {selectedBlok === 'semua' ? 'Tidak ada data warga' : `Tidak ada warga di Blok ${selectedBlok}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg p-6 w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
            <h3 className="text-lg font-semibold mb-4">
              {editingWarga ? 'Edit Warga' : 'Tambah Warga'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama"
                value={wargaForm.nama}
                onChange={(e) => setWargaForm({...wargaForm, nama: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={wargaForm.email}
                onChange={(e) => setWargaForm({...wargaForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="No HP"
                value={wargaForm.no_hp}
                onChange={(e) => setWargaForm({...wargaForm, no_hp: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Blok"
                value={wargaForm.blok}
                onChange={(e) => setWargaForm({...wargaForm, blok: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder={editingWarga ? "Password (kosongkan jika tidak diubah)" : "Password"}
                value={wargaForm.password}
                onChange={(e) => setWargaForm({...wargaForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required={!editingWarga}
              />
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingWarga ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingWarga(null);
                    setWargaForm({ nama: '', email: '', no_hp: '', blok: '', password: '' });
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