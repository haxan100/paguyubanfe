import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSocket } from './hooks/useSocket';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';
import MobileLayout from './components/MobileLayout';
import Dashboard from './components/Dashboard';
import ComplaintList from './components/ComplaintList';
import PaymentList from './components/PaymentList';
import PaymentVerification from './components/PaymentVerification';
import UserManagement from './components/UserManagement';
import ResidentManagement from './components/ResidentManagement';
import Reports from './components/Reports';
import Settings from './components/Settings';
import DocumentList from './components/DocumentList';
import DocumentManagement from './components/DocumentManagement';
import AduanSaya from './components/AduanSaya';
import InfoWarga from './components/InfoWarga';
import PaymentWarga from './components/PaymentWarga';
import KetuaDashboard from './components/KetuaDashboard';
import KelolaWarga from './components/KelolaWarga';
import AduanWarga from './components/AduanWarga';
import PembayaranWarga from './components/PembayaranWarga';
import KoordinatorDashboard from './components/KoordinatorDashboard';
import KelolaWargaBlok from './components/KelolaWargaBlok';
import Pengeluaran from './components/Pengeluaran';
import BukuKas from './components/BukuKas';
import Profile from './components/Profile';
import About from './components/About';
import Dokumen from './components/Dokumen';
import KelolaWargaAdmin from './components/KelolaWargaAdmin';
import ProfileWarga from './components/ProfileWarga';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleDataUpdate = (type: string) => {
    console.log('🔄 Refreshing data for:', type);
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Initialize Socket.IO
  useSocket(user?.id || '', user?.jenis || '', handleDataUpdate);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (user?.jenis === 'ketua') return <KetuaDashboard />;
        if (user?.jenis === 'koordinator_perblok') return <KoordinatorDashboard />;
        return <Dashboard />;
      case 'info-warga':
        return <InfoWarga />;
      case 'aduan-saya':
        return <AduanSaya />;
      case 'complaints':
        return <ComplaintList />;
      case 'payments':
        return <PaymentWarga />;
      case 'verify-payments':
        return <PaymentVerification />;
      case 'payments-admin':
        return <PaymentList />;
      case 'users':
        return <UserManagement />;
      case 'residents':
        return <ResidentManagement />;
      case 'reports':
        return <Reports />;
      case 'finance':
        return <Reports />;
      case 'documents':
        return <DocumentList />;
      case 'document-management':
        return <DocumentManagement />;
      case 'management':
        return <Settings />;
      case 'kelola-warga':
        return <KelolaWarga />;
      case 'aduan-warga':
        return <AduanWarga />;
      case 'pembayaran-warga':
        return <PembayaranWarga />;
      case 'kelola-warga-blok':
        return <KelolaWargaBlok />;
      case 'pengeluaran':
        return <Pengeluaran />;
      case 'buku-kas':
        return <BukuKas />;
      case 'profile':
        return <Profile />;
      case 'about':
        return <About />;
      case 'dokumen':
        return <Dokumen />;
      case 'kelola-warga-admin':
        return <KelolaWargaAdmin />;
      case 'profile-warga':
        return <ProfileWarga />;
      default:
        if (user?.jenis === 'ketua') return <KetuaDashboard />;
        if (user?.jenis === 'koordinator_perblok') return <KoordinatorDashboard />;
        return <Dashboard />;
    }
  };

  const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </LayoutComponent>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;