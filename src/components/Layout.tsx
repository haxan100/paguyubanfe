import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  MessageCircle, 
  CreditCard, 
  Users, 
  Settings, 
  LogOut,
  CheckCircle,
  User,
  Sun,
  Moon,
  FileText,
  Newspaper
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const { isDarkMode, toggleTheme } = useTheme();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'info-warga', label: 'Info Warga', icon: Newspaper }
    ];
    
    switch (user?.role) {
      case 'warga':
        return [
          ...baseItems,
          { id: 'aduan-saya', label: 'Aduan Saya', icon: MessageCircle },
          { id: 'payments', label: 'Pembayaran', icon: CreditCard },
          { id: 'documents', label: 'Dokumen', icon: FileText }
        ];
      case 'koordinator_perblok':
        return [
          ...baseItems,
          { id: 'kelola-warga-blok', label: 'Kelola Warga', icon: Users },
          { id: 'aduan-warga', label: 'Aduan Warga', icon: MessageCircle },
          { id: 'pembayaran-warga', label: 'Pembayaran Warga', icon: CreditCard }
        ];
      case 'admin':
        const adminItems = [...baseItems];
        if (settings.complaintMenuEnabled) {
          adminItems.push({ id: 'complaints', label: 'Kelola Aduan', icon: MessageCircle });
        }
        adminItems.push(
          { id: 'payments-admin', label: 'Data Pembayaran', icon: CreditCard },
          { id: 'users', label: 'Kelola User', icon: Users },
          { id: 'document-management', label: 'Kelola Dokumen', icon: FileText }
        );
        return adminItems;
      case 'ketua':
        return [
          ...baseItems,
          { id: 'kelola-warga', label: 'Kelola Warga', icon: Users },
          { id: 'aduan-warga', label: 'Aduan Warga', icon: MessageCircle },
          { id: 'pembayaran-warga', label: 'Pembayaran Warga', icon: CreditCard }
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transition-colors duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
            <h1 className="text-xl font-bold text-white">Sistem Komunitas</h1>
          </div>
          
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user?.nama}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.jenis}</p>
                {user?.blok && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">Blok {user.blok}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Theme Toggle & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}