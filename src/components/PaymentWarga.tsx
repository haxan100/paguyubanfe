import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Calendar, CreditCard, AlertTriangle, Download, Filter, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';

interface Payment {
  id: number;
  tahun: number;
  bulan: number;
  jumlah: number;
  bukti_transfer: string;
  status: string;
  tanggal_upload: string;
  tanggal_konfirmasi: string | null;
  catatan: string | null;
}

export default function PaymentWarga() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [formData, setFormData] = useState({
    tahun: currentYear,
    bulan: currentMonth
  });
  const [buktiTransfer, setBuktiTransfer] = useState<File | null>(null);

  const bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
                     'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // Pilih endpoint berdasarkan jenis user
      const endpoint = user?.jenis === 'warga' ? `/api/warga/payments/${user.id}` : `/api/user/payments/${user?.id}`;
      const response = await apiRequest(endpoint);
      const result = await response.json();
      if (result.status === 'success') {
        setPayments(result.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const getPaymentStatus = (tahun: number, bulan: number) => {
    const payment = payments.find(p => p.tahun === tahun && p.bulan === bulan);
    return payment?.status || 'belum_bayar';
  };

  const getRecentMonths = () => {
    const months = [];
    for (let i = 2; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        tahun: date.getFullYear(),
        bulan: date.getMonth() + 1,
        nama: bulanNames[date.getMonth()]
      });
    }
    return months;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buktiTransfer) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Bukti transfer harus diupload'
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('tahun', formData.tahun.toString());
      formDataToSend.append('bulan', formData.bulan.toString());
      formDataToSend.append('bukti_transfer', buktiTransfer);

      // Pilih endpoint berdasarkan jenis user
      const endpoint = user?.jenis === 'warga' ? '/api/warga/payments' : '/api/user/payments';
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();
      if (result.status === 'success') {
        setShowModal(false);
        setFormData({ tahun: currentYear, bulan: currentMonth });
        setBuktiTransfer(null);
        fetchPayments();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pembayaran berhasil diupload',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal mengupload pembayaran'
      });
    }
  };

  const handleDelete = async (id: number, status: string) => {
    if (status === 'dikonfirmasi') {
      Swal.fire({
        icon: 'error',
        title: 'Tidak dapat dihapus!',
        text: 'Pembayaran yang sudah dikonfirmasi tidak dapat dihapus'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Hapus Pembayaran?',
      text: 'Data pembayaran akan dihapus permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        // Pilih endpoint berdasarkan jenis user
        const endpoint = user?.jenis === 'warga' ? `/api/warga/payments/${id}` : `/api/user/payments/${id}`;
        const response = await apiRequest(endpoint, {
          method: 'DELETE'
        });

        const data = await response.json();
        if (data.status === 'success') {
          fetchPayments();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Pembayaran berhasil dihapus',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus pembayaran'
        });
      }
    }
  };

  const exportPayments = async () => {
    try {
      // Pilih endpoint berdasarkan jenis user
      const endpoint = user?.jenis === 'warga' ? `/api/warga/payments/export/${currentYear}` : `/api/user/payments/export/${currentYear}`;
      const response = await apiRequest(endpoint);
      const result = await response.json();
      if (result.status === 'success') {
        const csvContent = [
          ['No', 'Bulan', 'Status', 'Bukti'].join(','),
          ...result.data.map((item: any) => [
            item.no,
            item.bulan,
            item.status,
            item.bukti ? `${window.location.origin}${item.bukti}` : ''
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pembayaran-${currentYear}.csv`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting payments:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dikonfirmasi': return 'bg-green-100 text-green-800';
      case 'menunggu_konfirmasi': return 'bg-yellow-100 text-yellow-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'dikonfirmasi': return 'Lunas';
      case 'menunggu_konfirmasi': return 'Menunggu Konfirmasi';
      case 'ditolak': return 'Ditolak';
      default: return 'Belum Bayar';
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus === 'semua') return true;
    return payment.status === filterStatus;
  });

  const recentMonths = getRecentMonths();
  const hasUnpaidLastMonth = getPaymentStatus(recentMonths[1].tahun, recentMonths[1].bulan) === 'belum_bayar';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`${isMobile ? 'space-y-4' : 'max-w-4xl mx-auto p-6 space-y-6'}`}>
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>Pembayaran</h2>
      
      {/* Recent Months Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-4'}`}>
        {recentMonths.map((month, index) => {
          const status = getPaymentStatus(month.tahun, month.bulan);
          const isCurrentMonth = index === 2;
          return (
            <div key={`${month.tahun}-${month.bulan}`} 
                 className={`p-4 rounded-lg border ${
                   status === 'dikonfirmasi' ? 'bg-green-50 border-green-200' :
                   status === 'menunggu_konfirmasi' ? 'bg-yellow-50 border-yellow-200' :
                   'bg-red-50 border-red-200'
                 }`}>
              <h3 className="font-semibold text-gray-900">{month.nama} {month.tahun}</h3>
              <p className={`text-sm ${
                status === 'dikonfirmasi' ? 'text-green-600' :
                status === 'menunggu_konfirmasi' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {getStatusText(status)}
              </p>
              {isCurrentMonth && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Bulan Ini</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning for unpaid last month */}
      {hasUnpaidLastMonth && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="text-red-500 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-red-800">Peringatan Pembayaran</h3>
            <p className="text-red-700">
              Pembayaran bulan lalu belum dilakukan. Mohon segera melakukan pembayaran atau konfirmasi ke admin.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between items-center'}`}>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${isMobile ? 'w-full' : ''}`}
        >
          <Plus size={20} />
          <span>Tambah Pembayaran</span>
        </button>
        
        <button
          onClick={exportPayments}
          className={`flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ${isMobile ? 'w-full' : ''}`}
        >
          <Download size={20} />
          <span>Export {currentYear}</span>
        </button>
      </div>

      {/* Filter */}
      <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
        <Filter size={20} className="text-gray-600" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-3 py-2 border border-gray-300 rounded-lg ${isMobile ? 'flex-1' : ''}`}
        >
          <option value="semua">Semua Status</option>
          <option value="belum_bayar">Belum Bayar</option>
          <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
          <option value="dikonfirmasi">Lunas</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      {/* Payment List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-lg p-4 shadow border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {bulanNames[payment.bulan - 1]} {payment.tahun}
                </h3>
                <p className="text-gray-600">Rp {payment.jumlah.toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.status)}`}>
                {getStatusText(payment.status)}
              </span>
            </div>
            
            <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
              <img
                src={`/assets/uploads/${payment.bukti_transfer}`}
                alt="Bukti Transfer"
                className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} object-cover rounded cursor-pointer`}
                onClick={() => window.open(`/assets/uploads/${payment.bukti_transfer}`, '_blank')}
              />
              <div className="flex-1">
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                  Upload: {new Date(payment.tanggal_upload).toLocaleDateString('id-ID')}
                </p>
                {payment.tanggal_konfirmasi && (
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                    Konfirmasi: {new Date(payment.tanggal_konfirmasi).toLocaleDateString('id-ID')}
                  </p>
                )}
                {payment.catatan && (
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 mt-1`}>
                    Catatan: {payment.catatan}
                  </p>
                )}
              </div>
              {payment.status !== 'dikonfirmasi' && (
                <button
                  onClick={() => handleDelete(payment.id, payment.status)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  title="Hapus pembayaran"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg p-6 w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
            <h3 className="text-lg font-semibold mb-4">Tambah Pembayaran</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                  <select
                    value={formData.tahun}
                    onChange={(e) => setFormData({...formData, tahun: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                  <select
                    value={formData.bulan}
                    onChange={(e) => setFormData({...formData, bulan: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    {bulanNames.map((nama, index) => (
                      <option key={index + 1} value={index + 1}>{nama}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  Rp 100.000
                </div>
                <p className="text-xs text-gray-500 mt-1">Jumlah pembayaran tetap</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Transfer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBuktiTransfer(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                {buktiTransfer && (
                  <img
                    src={URL.createObjectURL(buktiTransfer)}
                    alt="Preview"
                    className="mt-2 w-32 h-24 object-cover rounded"
                  />
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ tahun: currentYear, bulan: currentMonth });
                    setBuktiTransfer(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}