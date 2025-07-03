import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MessageCircle,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  const { payments, complaints } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedReport, setSelectedReport] = useState('financial');

  const getCurrentDate = () => new Date();
  const currentMonth = getCurrentDate().getMonth() + 1;
  const currentYear = getCurrentDate().getFullYear();

  const getFinancialStats = () => {
    const thisMonthPayments = payments.filter(p => 
      p.month === currentMonth && p.year === currentYear && p.status === 'verified'
    );
    
    const totalIncome = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const paymentRate = (thisMonthPayments.length / payments.filter(p => p.month === currentMonth && p.year === currentYear).length) * 100;
    
    return {
      totalIncome,
      paymentRate: paymentRate || 0,
      totalPayments: thisMonthPayments.length,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
    };
  };

  const getComplaintStats = () => {
    const thisMonthComplaints = complaints.filter(c => 
      c.createdAt.getMonth() === currentMonth - 1 && c.createdAt.getFullYear() === currentYear
    );
    
    return {
      total: thisMonthComplaints.length,
      resolved: thisMonthComplaints.filter(c => c.status === 'resolved').length,
      pending: thisMonthComplaints.filter(c => c.status === 'pending').length,
      inProgress: thisMonthComplaints.filter(c => c.status === 'in-progress').length,
    };
  };

  const financialStats = getFinancialStats();
  const complaintStats = getComplaintStats();

  const renderFinancialReport = () => (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {financialStats.totalIncome.toLocaleString('id-ID')}
              </p>
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
              <p className="text-2xl font-bold text-blue-600">
                {financialStats.paymentRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bayar</p>
              <p className="text-2xl font-bold text-gray-900">{financialStats.totalPayments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{financialStats.pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Laporan Bulanan</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bulan</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Target</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Terkumpul</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Persentase</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const monthPayments = payments.filter(p => 
                  p.month === month && p.year === currentYear && p.status === 'verified'
                );
                const target = 100000 * 120; // 100k per unit, 120 units
                const collected = monthPayments.reduce((sum, p) => sum + p.amount, 0);
                const percentage = (collected / target) * 100;
                
                return (
                  <tr key={month} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {new Date(0, i).toLocaleString('id-ID', { month: 'long' })} {currentYear}
                      </div>
                    </td>
                    <td className="px-6 py-4">Rp {target.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">Rp {collected.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">{percentage.toFixed(1)}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        percentage >= 90 ? 'bg-green-100 text-green-800' :
                        percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {percentage >= 90 ? 'Baik' : percentage >= 70 ? 'Cukup' : 'Kurang'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderComplaintReport = () => (
    <div className="space-y-6">
      {/* Complaint Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Aduan</p>
              <p className="text-2xl font-bold text-gray-900">{complaintStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-2xl font-bold text-green-600">{complaintStats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dalam Proses</p>
              <p className="text-2xl font-bold text-blue-600">{complaintStats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{complaintStats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aduan Terbaru</h3>
        <div className="space-y-3">
          {complaints.slice(0, 5).map((complaint) => (
            <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                <p className="text-sm text-gray-600">
                  {complaint.userName} • {complaint.createdAt.toLocaleDateString('id-ID')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {complaint.status === 'resolved' ? 'Selesai' :
                 complaint.status === 'in-progress' ? 'Proses' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'ketua' ? 'Laporan Eksekutif' : 'Laporan Keuangan'}
          </h1>
          <p className="text-gray-600 mt-2">
            Analisis dan ringkasan data komunitas
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedReport('financial')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedReport === 'financial'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Laporan Keuangan
          </button>
          <button
            onClick={() => setSelectedReport('complaints')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedReport === 'complaints'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Laporan Aduan
          </button>
        </div>
      </div>

      {selectedReport === 'financial' ? renderFinancialReport() : renderComplaintReport()}
    </div>
  );
}