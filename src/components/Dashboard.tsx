import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
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
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pembayaran</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sudah Bayar</p>
                <p className="text-2xl font-bold text-green-600">{stats.paidPayments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menunggu Verifikasi</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Aduan</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pembayaran Terbaru</h3>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(0, payment.month - 1).toLocaleString('id-ID', { month: 'long' })} {payment.year}
                    </p>
                    <p className="text-sm text-gray-600">Rp {payment.amount.toLocaleString('id-ID')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'verified' 
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'pending'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status === 'verified' ? 'Terverifikasi' : 
                     payment.status === 'pending' ? 'Pending' : 'Belum Bayar'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aduan Terbaru</h3>
            <div className="space-y-3">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'resolved' 
                        ? 'bg-green-100 text-green-800'
                        : complaint.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {complaint.status === 'resolved' ? 'Selesai' : 
                       complaint.status === 'in-progress' ? 'Proses' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{complaint.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKoordinatorDashboard = () => {
    const stats = getKoordinatorStats();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Warga</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalResidents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menunggu Verifikasi</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terverifikasi</p>
                <p className="text-2xl font-bold text-green-600">{stats.verifiedPayments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
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
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Aduan</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aduan Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aduan Selesai</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pembayaran</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard size={24} className="text-blue-600" />
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-600">Rp 3.0M</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tingkat Pembayaran</p>
              <p className="text-2xl font-bold text-blue-600">85%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Warga</p>
              <p className="text-2xl font-bold text-gray-900">120</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aduan Bulan Ini</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Selamat datang, {user?.name}! Berikut adalah ringkasan aktivitas Anda.
        </p>
      </div>

      {user?.role === 'warga' && renderWargaDashboard()}
      {user?.role === 'koordinator' && renderKoordinatorDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'ketua' && renderKetuaDashboard()}
    </div>
  );
}