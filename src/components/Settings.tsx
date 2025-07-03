import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Settings as SettingsIcon, MessageCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { settings, updateSettings } = useData();

  const handleToggleComplaintMenu = () => {
    updateSettings({ complaintMenuEnabled: !settings.complaintMenuEnabled });
  };

  if (user?.role !== 'ketua') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
        <SettingsIcon size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Akses Ditolak</h3>
        <p className="text-gray-600">
          Hanya ketua yang dapat mengakses pengaturan sistem.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <p className="text-gray-600 mt-2">
          Kelola pengaturan dan konfigurasi sistem komunitas
        </p>
      </div>

      <div className="space-y-6">
        {/* Menu Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pengaturan Menu</h3>
              <p className="text-sm text-gray-600">Kontrol visibilitas menu untuk pengguna</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageCircle size={20} className="text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Menu Aduan</h4>
                  <p className="text-sm text-gray-600">
                    Mengaktifkan atau menonaktifkan menu aduan untuk warga dan admin
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleComplaintMenu}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  settings.complaintMenuEnabled
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {settings.complaintMenuEnabled ? (
                  <>
                    <ToggleRight size={20} />
                    <span className="font-medium">Aktif</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={20} />
                    <span className="font-medium">Nonaktif</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <SettingsIcon size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Informasi Sistem</h3>
              <p className="text-sm text-gray-600">Detail konfigurasi sistem saat ini</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Status Menu Aduan</h4>
              <p className={`text-sm font-medium ${
                settings.complaintMenuEnabled ? 'text-green-600' : 'text-red-600'
              }`}>
                {settings.complaintMenuEnabled ? 'Aktif' : 'Nonaktif'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Jumlah Iuran Bulanan</h4>
              <p className="text-sm font-medium text-blue-600">Rp 100.000</p>
            </div>
          </div>
        </div>

        {/* Save Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <SettingsIcon size={16} className="text-blue-600" />
            <p className="text-sm text-blue-800">
              <span className="font-medium">Catatan:</span> Perubahan pengaturan akan langsung diterapkan ke seluruh sistem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}