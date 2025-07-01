import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { CreditCard, Upload, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import PaymentUploadForm from './PaymentUploadForm';

export default function PaymentList() {
  const { user } = useAuth();
  const { getPaymentsByUser } = useData();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const userPayments = user ? getPaymentsByUser(user.id) : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-orange-600" />;
      default:
        return <AlertCircle size={16} className="text-red-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Terverifikasi';
      case 'pending':
        return 'Menunggu Verifikasi';
      default:
        return 'Belum Bayar';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getMonthName = (month: number) => {
    return new Date(0, month - 1).toLocaleString('id-ID', { month: 'long' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Riwayat Pembayaran</h1>
          <p className="text-gray-600 mt-2">
            Kelola pembayaran iuran bulanan Anda
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload size={20} />
          <span>Upload Bukti</span>
        </button>
      </div>

      {userPayments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <CreditCard size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Data Pembayaran</h3>
          <p className="text-gray-600 mb-6">
            Data pembayaran Anda akan muncul di sini setelah admin menambahkan tagihan.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Periode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jumlah</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal Upload</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {getMonthName(payment.month)} {payment.year}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        Rp {payment.amount.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm">
                        {payment.uploadedAt 
                          ? payment.uploadedAt.toLocaleDateString('id-ID')
                          : '-'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {payment.proofPhoto && (
                          <button
                            onClick={() => window.open(payment.proofPhoto, '_blank')}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Eye size={14} />
                            <span>Lihat Bukti</span>
                          </button>
                        )}
                        {payment.status === 'unpaid' && (
                          <button
                            onClick={() => setShowUploadForm(true)}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Upload size={14} />
                            <span>Upload</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showUploadForm && (
        <PaymentUploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </div>
  );
}