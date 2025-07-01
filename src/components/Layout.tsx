import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  MessageCircle, 
  CreditCard, 
  Users, 
  Settings, 
  LogOut,
  CheckCircle,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [{ id: 'dashboard', label: 'Dashboard', icon: Home }];
    
    switch (user?.role) {
      case 'warga':
        return [
          ...baseItems,
          { id: 'complaints', label: 'Aduan', icon: MessageCircle },
          { id: 'payments', label: 'Pembayaran', icon: CreditCard },
        ];
      case 'koordinator':
        return [
          ...baseItems,
          { id: 'verify-payments', label: 'Verifikasi Bayar', icon: CheckCircle },
          { id: 'residents', label: 'Data Warga', icon: Users },
        ];
      case 'admin':
        return [
          ...baseItems,
          { id: 'complaints', label: 'Kelola Aduan', icon: MessageCircle },
          { id: 'payments-admin', label: 'Data Pembayaran', icon: CreditCard },
          { id: 'users', label: 'Kelola User', icon: Users },
        ];
      case 'ketua':
        return [
          ...baseItems,
          { id: 'reports', label: 'Laporan', icon: MessageCircle },
          { id: 'finance', label: 'Keuangan', icon: CreditCard },
          { id: 'management', label: 'Manajemen', icon: Settings },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-xl font-bold text-white">Sistem Komunitas</h1>
          </div>
          
          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                {user?.blok && (
                  <p className="text-xs text-blue-600">Blok {user.blok}</p>
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
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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