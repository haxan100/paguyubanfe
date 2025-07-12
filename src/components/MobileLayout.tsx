import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Home, MessageCircle, CreditCard, Newspaper, User, Users, TrendingDown, BookOpen, Info } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function MobileLayout({ children, currentPage, onPageChange }: MobileLayoutProps) {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    if (user?.jenis === 'ketua') {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'info-warga', label: 'Info', icon: Newspaper },
        { id: 'kelola-warga', label: 'Kelola', icon: Users },
        { id: 'aduan-warga', label: 'Aduan', icon: MessageCircle },
        { id: 'pembayaran-warga', label: 'Bayar', icon: CreditCard },
        { id: 'pengeluaran', label: 'Keluar', icon: TrendingDown },
        { id: 'buku-kas', label: 'Kas', icon: BookOpen }
      ];
    }
    if (user?.jenis === 'koordinator_perblok') {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'info-warga', label: 'Info', icon: Newspaper },
        { id: 'kelola-warga-blok', label: 'Kelola', icon: Users },
        { id: 'aduan-warga', label: 'Aduan', icon: MessageCircle },
        { id: 'pembayaran-warga', label: 'Bayar', icon: CreditCard },
        { id: 'pengeluaran', label: 'Keluar', icon: TrendingDown },
        { id: 'buku-kas', label: 'Kas', icon: BookOpen }
      ];
    }
    return [
      { id: 'dashboard', label: 'Home', icon: Home },
      { id: 'info-warga', label: 'Info', icon: Newspaper },
      { id: 'aduan-saya', label: 'Aduan', icon: MessageCircle },
      { id: 'payments', label: 'Bayar', icon: CreditCard },
      { id: 'pengeluaran', label: 'Keluar', icon: TrendingDown },
      { id: 'buku-kas', label: 'Kas', icon: BookOpen },
      { id: 'about', label: 'About', icon: Info },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Paguyuban</h1>
          <div className="text-sm">
            <p>{user?.nama}</p>
            <p className="text-blue-200 text-xs">Blok {user?.blok}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-8 overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center py-2 px-1 ${
                currentPage === item.id
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}