import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from './PasswordInput';

interface WargaData {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  blok: string;
  created_at: string;
}

export default function KelolaWargaBlok() {
  const { user } = useAuth();
  const [warga, setWarga] = useState<WargaData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWarga, setEditingWarga] = useState<WargaData | null>(null);
  const [wargaForm, setWargaForm] = useState({
    nama: '',
    email: '',
    no_hp: '',
    blok: '',
    password: ''
  });

  const userBlok = user?.blok?.charAt(0); // Ambil huruf pertama blok

  useEffect(() => {
    fetchWarga();
  }, []);

  const fetchWarga = async () => {
    try {
      const response = await apiRequest('/api/warga');
      const result = await response.json();
      if (result.status === 'success') {
        // Filter hanya warga di blok yang sama
        const filteredWarga = result.data.filter((w: WargaData) => 
          w.blok?.charAt(0) === userBlok
        );
        setWarga(filteredWarga);
      }
    } catch (error) {
      console.error('Error fetching warga:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi blok di frontend
    const targetBlok = wargaForm.blok?.charAt(0);
    if (targetBlok !== userBlok) {
      Swal.fire({
        icon: 'error',
        title: 'Blok Tidak Valid!',
        text: `Anda hanya bisa mengelola warga di Blok ${userBlok}`
      });
      return;
    }
    
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
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Gagal menyimpan data warga'
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Warga?',
      text: 'Data warga akan dihapus permanen',
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
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
          Kelola Warga Blok {userBlok}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${isMobile ? 'text-sm' : ''}`}
        >
          <Plus size={16} />
          <span>Tambah Warga</span>
        </button>
      </div>
      
      {isMobile ? (
        // Mobile Card Layout
        <div className="space-y-4">
          {warga.map((wargaItem) => (
            <div key={wargaItem.id} className="bg-white rounded-lg p-4 shadow border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{wargaItem.nama}</h3>
                  <p className="text-sm text-gray-600">{wargaItem.email}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Warga
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>HP: {wargaItem.no_hp}</p>
                <p>Blok: {wargaItem.blok}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingWarga(wargaItem);
                    setWargaForm({
                      nama: wargaItem.nama,
                      email: wargaItem.email,
                      no_hp: wargaItem.no_hp,
                      blok: wargaItem.blok,
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
                  onClick={() => handleDelete(wargaItem.id)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warga.map((wargaItem) => (
                <tr key={wargaItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{wargaItem.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wargaItem.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wargaItem.no_hp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wargaItem.blok}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setEditingWarga(wargaItem);
                        setWargaForm({
                          nama: wargaItem.nama,
                          email: wargaItem.email,
                          no_hp: wargaItem.no_hp,
                          blok: wargaItem.blok,
                          password: ''
                        });
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(wargaItem.id)}
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
      )}

      {warga.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada warga di Blok {userBlok}</p>
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
                placeholder={`Blok (contoh: ${userBlok}1-1, ${userBlok}2-5)`}
                value={wargaForm.blok}
                onChange={(e) => setWargaForm({...wargaForm, blok: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <PasswordInput
                value={wargaForm.password}
                onChange={(value) => setWargaForm({...wargaForm, password: value})}
                placeholder={editingWarga ? "Password (kosongkan jika tidak diubah)" : "Password"}
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