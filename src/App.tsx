import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
        return user?.jenis === 'ketua' ? <KetuaDashboard /> : <Dashboard />;
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
      default:
        return user?.jenis === 'ketua' ? <KetuaDashboard /> : <Dashboard />;
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