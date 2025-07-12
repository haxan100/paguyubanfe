import React, { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from './PasswordInput';

export default function ProfileWarga() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    no_hp: user?.no_hp || '',
    blok: user?.blok || ''
  });
  
  console.log('User data:', user); // Debug log
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest('/api/warga/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      const result = await response.json();
      if (result.status === 'success') {
        const updatedUser = { ...user, ...profileData };
        updateUser(updatedUser);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Profile berhasil diupdate',
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
        text: 'Gagal mengupdate profile'
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Password baru tidak cocok'
      });
      return;
    }

    try {
      const response = await apiRequest('/api/warga/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Password berhasil diubah',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal mengubah password'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Saya</h1>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <User size={16} className="inline mr-2" />
          Data Diri
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'password'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Lock size={16} className="inline mr-2" />
          Ubah Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Update Data Diri</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                value={profileData.nama}
                onChange={(e) => setProfileData({...profileData, nama: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
              <input
                type="text"
                value={profileData.no_hp}
                onChange={(e) => setProfileData({...profileData, no_hp: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blok</label>
              <input
                type="text"
                value={profileData.blok}
                onChange={(e) => setProfileData({...profileData, blok: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save size={16} />
              <span>Simpan Perubahan</span>
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Ubah Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
              <PasswordInput
                value={passwordData.currentPassword}
                onChange={(value) => setPasswordData({...passwordData, currentPassword: value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Masukkan password lama"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
              <PasswordInput
                value={passwordData.newPassword}
                onChange={(value) => setPasswordData({...passwordData, newPassword: value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Masukkan password baru (min 6 karakter)"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
              <PasswordInput
                value={passwordData.confirmPassword}
                onChange={(value) => setPasswordData({...passwordData, confirmPassword: value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Konfirmasi password baru"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Lock size={16} />
              <span>Ubah Password</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}