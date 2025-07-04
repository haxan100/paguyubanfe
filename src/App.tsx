import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';
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

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'complaints':
        return <ComplaintList />;
      case 'payments':
        return <PaymentList />;
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
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
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