import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, MessageCircle, CreditCard, Newspaper, Plus, Edit, Trash2, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';

interface User {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  blok: string;
  jenis: string;
  created_at: string;
}

interface Payment {
  id: number;
  nama: string;
  blok: string;
  no_hp: string;
  status: string;
  bukti_transfer: string;
  tanggal_upload: string;
}

export default function KetuaDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    nama: '',
    email: '',
    no_hp: '',
    blok: '',
    jenis: 'admin',
    password: ''
  });
  const [exportForm, setExportForm] = useState({
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1
  });

  const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await apiRequest('/api/users');
      const result = await response.json();
      if (result.status === 'success') {
        setUsers(result.data.filter((u: User) => ['admin', 'koordinator_perblok'].includes(u.jenis)));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await apiRequest('/api/admin/payments');
      const result = await response.json();
      if (result.status === 'success') {
        setPayments(result.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
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
        setShowUserModal(false);
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

  const handleDeleteUser = async (id: number) => {
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

  const handleConfirmPayment = async (id: number, status: string) => {
    const { value: catatan } = await Swal.fire({
      title: `${status === 'dikonfirmasi' ? 'Konfirmasi' : 'Tolak'} Pembayaran`,
      input: 'textarea',
      inputLabel: 'Catatan (opsional)',
      inputPlaceholder: 'Masukkan catatan...',
      showCancelButton: true,
      confirmButtonText: status === 'dikonfirmasi' ? 'Konfirmasi' : 'Tolak',
      cancelButtonText: 'Batal'
    });

    if (catatan !== undefined) {
      try {
        const response = await apiRequest(`/api/admin/payments/${id}/confirm`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, catatan })
        });

        const result = await response.json();
        if (result.status === 'success') {
          fetchPayments();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Status pembayaran berhasil diupdate',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal mengupdate status pembayaran'
        });
      }
    }
  };

  const handleExportPayments = async () => {
    try {
      const response = await apiRequest(`/api/admin/payments/export/${exportForm.tahun}/${exportForm.bulan}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        const csvContent = [
          ['Nama', 'Blok', 'No HP', 'Status', 'Bukti', 'Tanggal Upload'].join(','),
          ...result.data.map((item: any) => [
            item.nama,
            item.blok,
            item.no_hp,
            item.status,
            item.bukti ? `${window.location.origin}${item.bukti}` : '',
            item.tanggal_upload ? new Date(item.tanggal_upload).toLocaleDateString('id-ID') : ''
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pembayaran-${bulanNames[exportForm.bulan - 1]}-${exportForm.tahun}.csv`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting payments:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dikonfirmasi': return 'bg-green-100 text-green-800';
      case 'menunggu_konfirmasi': return 'bg-yellow-100 text-yellow-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Ketua</h1>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'users', label: 'Kelola User', icon: Users },
            { id: 'payments', label: 'Pembayaran', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="text-blue-500" size={24} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Admin</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.jenis === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="text-green-500" size={24} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Koordinator</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.jenis === 'koordinator_perblok').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CreditCard className="text-yellow-500" size={24} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pembayaran Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {payments.filter(p => p.status === 'menunggu_konfirmasi').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Kelola Admin & Koordinator</h2>
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>Tambah User</span>
            </button>
          </div>
          
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
                          setShowUserModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Kelola Pembayaran</h2>
            <div className="flex items-center space-x-4">
              <select
                value={exportForm.tahun}
                onChange={(e) => setExportForm({...exportForm, tahun: parseInt(e.target.value)})}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                {[2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                value={exportForm.bulan}
                onChange={(e) => setExportForm({...exportForm, bulan: parseInt(e.target.value)})}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                {bulanNames.map((nama, index) => (
                  <option key={index + 1} value={index + 1}>{nama}</option>
                ))}
              </select>
              <button
                onClick={handleExportPayments}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-lg p-4 shadow border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{payment.nama}</h3>
                    <p className="text-gray-600">Blok {payment.blok} • {payment.no_hp}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.status)}`}>
                    {payment.status === 'dikonfirmasi' ? 'Lunas' : 
                     payment.status === 'menunggu_konfirmasi' ? 'Menunggu' : 'Ditolak'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <img
                    src={`/assets/uploads/${payment.bukti_transfer}`}
                    alt="Bukti Transfer"
                    className="w-16 h-16 object-cover rounded cursor-pointer"
                    onClick={() => window.open(`/assets/uploads/${payment.bukti_transfer}`, '_blank')}
                  />
                  
                  {payment.status === 'menunggu_konfirmasi' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleConfirmPayment(payment.id, 'dikonfirmasi')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Konfirmasi
                      </button>
                      <button
                        onClick={() => handleConfirmPayment(payment.id, 'ditolak')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Tambah User'}
            </h3>
            <form onSubmit={handleUserSubmit} className="space-y-4">
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
              <input
                type="password"
                placeholder={editingUser ? "Password (kosongkan jika tidak diubah)" : "Password"}
                value={userForm.password}
                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
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
                    setShowUserModal(false);
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