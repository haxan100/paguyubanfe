import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Sun, Moon, LogOut, MapPin, Mail, Phone } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
      
      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.nama}</h3>
            <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.jenis}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail size={16} className="text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={16} className="text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{user?.no_hp}</span>
          </div>
          {user?.blok && (
            <div className="flex items-center space-x-3">
              <MapPin size={16} className="text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Blok {user.blok}</span>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pengaturan</h3>
        
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
            <span className="text-gray-700 dark:text-gray-300">
              {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            </span>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
}