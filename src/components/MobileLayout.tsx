import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Home, MessageCircle, CreditCard, Newspaper, User, Users, TrendingDown, BookOpen, Info, Sun, Moon } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function MobileLayout({ children, currentPage, onPageChange }: MobileLayoutProps) {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Home', icon: Home },
      { id: 'info-warga', label: 'Info', icon: Newspaper }
    ];
    
    switch (user?.jenis) {
      case 'ketua':
        return [
          ...baseItems,
          { id: 'kelola-warga', label: 'Warga', icon: Users },
          { id: 'kelola-perangkat', label: 'Admin', icon: User },
          { id: 'aduan-warga', label: 'Aduan', icon: MessageCircle },
          { id: 'pembayaran-warga', label: 'Bayar', icon: CreditCard },
          { id: 'pengeluaran', label: 'Keluar', icon: TrendingDown },
          { id: 'buku-kas', label: 'Kas', icon: BookOpen },
          { id: 'dokumen', label: 'Dokumen', icon: Info }
        ];
      case 'koordinator_perblok':
        return [
          ...baseItems,
          { id: 'kelola-warga-blok', label: 'Warga', icon: Users },
          { id: 'tambah-pembayaran', label: 'Tambah', icon: CreditCard },
          { id: 'aduan-warga', label: 'Aduan', icon: MessageCircle },
          { id: 'pembayaran-warga', label: 'Bayar', icon: CreditCard },
          { id: 'pengeluaran', label: 'Keluar', icon: TrendingDown },
          { id: 'buku-kas', label: 'Kas', icon: BookOpen },
          { id: 'dokumen', label: 'Dokumen', icon: Info }
        ];
      case 'admin':
        return [
          ...baseItems,
          { id: 'kelola-warga', label: 'Warga', icon: Users },
          { id: 'complaints', label: 'Aduan', icon: MessageCircle },
          { id: 'payments-admin', label: 'Bayar', icon: CreditCard },
          { id: 'pengeluaran', label: 'Keluar', icon: TrendingDown },
          { id: 'buku-kas', label: 'Kas', icon: BookOpen },
          { id: 'dokumen', label: 'Dokumen', icon: Info }
        ];
      default:
        return [
          ...baseItems,
          { id: 'aduan-saya', label: 'Aduan', icon: MessageCircle },
          { id: 'payments', label: 'Bayar', icon: CreditCard },
          { id: 'pengeluaran', label: 'Keluar', icon: TrendingDown },
          { id: 'buku-kas', label: 'Kas', icon: BookOpen },
          { id: 'dokumen', label: 'Dokumen', icon: Info }
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 transition-colors duration-300">
      {/* Header */}
      <div className="bg-blue-600 dark:bg-gray-800 text-white p-4 sticky top-0 z-40 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Graha Padjajaran</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-blue-500 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-blue-200" />}
            </button>
            <div className="text-sm text-right">
              <p>{user?.nama}</p>
              <p className="text-blue-200 dark:text-gray-400 text-xs">Blok {user?.blok}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors duration-300">
        <div className="flex overflow-x-auto scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center py-2 px-3 min-w-0 flex-shrink-0 transition-colors ${
                currentPage === item.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <item.icon size={18} />
              <span className="text-xs mt-1 truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}