import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import PasswordInput from './PasswordInput';

interface UserData {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  blok: string;
  jenis: string;
  created_at: string;
}

export default function KelolaWarga() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [userForm, setUserForm] = useState({
    nama: '',
    email: '',
    no_hp: '',
    blok: '',
    jenis: 'admin',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiRequest('/api/users');
      const result = await response.json();
      if (result.status === 'success') {
        setUsers(result.data.filter((u: UserData) => ['admin', 'koordinator_perblok'].includes(u.jenis)));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });

      const result = await response.json();
      if (result.status === 'success') {
        setShowModal(false);
        setEditingUser(null);
        setUserForm({ nama: '', email: '', no_hp: '', blok: '', jenis: 'admin', password: '' });
        fetchUsers();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: editingUser ? 'User berhasil diupdate' : 'User berhasil dibuat',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menyimpan user'
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus User?',
      text: 'User akan dihapus permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiRequest(`/api/users/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.status === 'success') {
          fetchUsers();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'User berhasil dihapus',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus user'
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
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>Kelola Admin & Koordinator</h1>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${isMobile ? 'text-sm' : ''}`}
        >
          <Plus size={16} />
          <span>Tambah User</span>
        </button>
      </div>
      
      {isMobile ? (
        // Mobile Card Layout
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg p-4 shadow border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{user.nama}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.jenis === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.jenis === 'admin' ? 'Admin' : 'Koordinator'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>HP: {user.no_hp}</p>
                <p>Blok: {user.blok}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setUserForm({
                      nama: user.nama,
                      email: user.email,
                      no_hp: user.no_hp,
                      blok: user.blok,
                      jenis: user.jenis,
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
                  onClick={() => handleDelete(user.id)}
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.no_hp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.blok}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.jenis === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.jenis === 'admin' ? 'Admin' : 'Koordinator'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setUserForm({
                          nama: user.nama,
                          email: user.email,
                          no_hp: user.no_hp,
                          blok: user.blok,
                          jenis: user.jenis,
                          password: ''
                        });
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg p-6 w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Tambah User'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama"
                value={userForm.nama}
                onChange={(e) => setUserForm({...userForm, nama: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="No HP"
                value={userForm.no_hp}
                onChange={(e) => setUserForm({...userForm, no_hp: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Blok"
                value={userForm.blok}
                onChange={(e) => setUserForm({...userForm, blok: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <select
                value={userForm.jenis}
                onChange={(e) => setUserForm({...userForm, jenis: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="admin">Admin</option>
                <option value="koordinator_perblok">Koordinator</option>
              </select>
              <PasswordInput
                value={userForm.password}
                onChange={(value) => setUserForm({...userForm, password: value})}
                placeholder={editingUser ? "Password (kosongkan jika tidak diubah)" : "Password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required={!editingUser}
              />
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingUser ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    setUserForm({ nama: '', email: '', no_hp: '', blok: '', jenis: 'admin', password: '' });
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