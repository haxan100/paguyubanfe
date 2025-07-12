import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { apiRequest } from '../utils/api';
import { 
  MessageCircle, 
  CreditCard, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { complaints, payments, getPaymentsByUser, getPaymentsByBlok } = useData();
  const [totalIncome, setTotalIncome] = useState(0);
  const [koordinatorStats, setKoordinatorStats] = useState({
    totalWarga: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0
  });

  useEffect(() => {
    console.log("usernya!!!!", user);
    if (user?.jenis === 'koordinator_perblok') {
      fetchKoordinatorStats();
    } else {
      fetchTotalIncome();
    }
  }, [user]);

  const fetchTotalIncome = async () => {
    try {
      const response = await apiRequest('/api/total-income');
      const result = await response.json();
      if (result.status === 'success') {
        setTotalIncome(result.data.totalIncome);
      }
    } catch (error) {
      console.error('Error fetching total income:', error);
    }
  };

  const fetchKoordinatorStats = async () => {
    try {
      const response = await apiRequest('/api/dashboard/koordinator');
      
      // Check if response is HTML (server error)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Server returned HTML instead of JSON');
        return;
      }
      
      const result = await response.json();
      console.log('Koordinator stats:', result);
      if (result.status === 'success') {
        setKoordinatorStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching koordinator stats:', error);
    }
  };

  const getWargaStats = () => {
    if (!user) return { totalPayments: 0, paidPayments: 0, pendingPayments: 0, totalComplaints: 0 };
    
    const userPayments = getPaymentsByUser(user.id);
    const userComplaints = complaints.filter(c => c.userId === user.id);
    
    return {
      totalPayments: userPayments.length,
      paidPayments: userPayments.filter(p => p.status === 'verified').length,
      pendingPayments: userPayments.filter(p => p.status === 'pending').length,
      totalComplaints: userComplaints.length,
    };
  };

  const getKoordinatorStats = () => {
    if (!user || !user.blok) return { totalResidents: 0, pendingPayments: 0, verifiedPayments: 0 };
    
    const blokPayments = getPaymentsByBlok(user.blok);
    
    return {
      totalResidents: [...new Set(blokPayments.map(p => p.userId))].length,
      pendingPayments: blokPayments.filter(p => p.status === 'pending').length,
      verifiedPayments: blokPayments.filter(p => p.status === 'verified').length,
    };
  };

  const getAdminStats = () => {
    return {
      totalComplaints: complaints.length,
      pendingComplaints: complaints.filter(c => c.status === 'pending').length,
      resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
      totalPayments: payments.length,
    };
  };

  const renderWargaDashboard = () => {
    const stats = getWargaStats();
    const recentPayments = getPaymentsByUser(user!.id).slice(0, 3);
    const recentComplaints = complaints.filter(c => c.userId === user!.id).slice(0, 3);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Rp {totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pembayaran</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPayments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <CreditCard size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sudah Bayar</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.paidPayments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Menunggu Verifikasi</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Aduan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <MessageCircle size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pembayaran Terbaru</h3>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(0, payment.month - 1).toLocaleString('id-ID', { month: 'long' })} {payment.year}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rp {payment.amount.toLocaleString('id-ID')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'verified' 
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400'
                      : payment.status === 'pending'
                      ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-400'
                      : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400'
                  }`}>
                    {payment.status === 'verified' ? 'Terverifikasi' : 
                     payment.status === 'pending' ? 'Pending' : 'Belum Bayar'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aduan Terbaru</h3>
            <div className="space-y-3">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{complaint.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'resolved' 
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400'
                        : complaint.status === 'in-progress'
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400'
                        : 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-400'
                    }`}>
                      {complaint.status === 'resolved' ? 'Selesai' : 
                       complaint.status === 'in-progress' ? 'Proses' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{complaint.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKoordinatorDashboard = () => {
    const userBlok = user?.blok?.charAt(0);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Warga Blok {userBlok}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{koordinatorStats.totalWarga}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Rp {koordinatorStats.totalPemasukan.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Rp {koordinatorStats.totalPengeluaran.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-red-600 dark:text-red-400 transform rotate-180" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo Saat Ini</p>
                <p className={`text-2xl font-bold ${koordinatorStats.saldo >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  Rp {koordinatorStats.saldo.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                koordinatorStats.saldo >= 0 
                  ? 'bg-blue-100 dark:bg-blue-900/50' 
                  : 'bg-red-100 dark:bg-red-900/50'
              }`}>
                <DollarSign size={24} className={koordinatorStats.saldo >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    const stats = getAdminStats();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Aduan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <MessageCircle size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aduan Pending</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pendingComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <AlertCircle size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aduan Selesai</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolvedComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pembayaran</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPayments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <CreditCard size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKetuaDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                Rp {totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tingkat Pembayaran</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">85%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Warga</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">120</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aduan Bulan Ini</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selamat datang, {user?.nama}! Berikut adalah ringkasan aktivitas Anda.
        </p>
      </div>

      {user?.jenis === 'warga' && renderWargaDashboard()}
      {user?.jenis === 'koordinator_perblok' && renderKoordinatorDashboard()}
      {user?.jenis === 'admin' && renderAdminDashboard()}
      {user?.jenis === 'ketua' && renderKetuaDashboard()}
    </div>
  );
}