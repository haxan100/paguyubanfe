import React, { useState, useEffect } from 'react';
import { Download, CreditCard, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeData } from '../hooks/useRealtimeData';

interface Payment {
  id: number;
  nama: string;
  blok: string;
  no_hp: string;
  jumlah: number;
  status: string;
  bukti_transfer: string;
  tanggal_upload: string;
}

export default function PembayaranWarga() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filterForm, setFilterForm] = useState({
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1
  });
  const [filterBlok, setFilterBlok] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const userBlok = user?.blok?.charAt(0); // Ambil huruf pertama blok koordinator

  const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  useEffect(() => {
    fetchPayments();
  }, [filterForm.tahun, filterForm.bulan]);

  // Listen for payment updates
  useEffect(() => {
    const handlePaymentUpdate = (event: any) => {
      console.log('🔄 Auto-refreshing payments data:', event.detail);
      fetchPayments();
    };

    window.addEventListener('payment-update', handlePaymentUpdate);
    
    return () => {
      window.removeEventListener('payment-update', handlePaymentUpdate);
    };
  }, []);

  const fetchPayments = async () => {
    try {
      setIsRefreshing(true);
      const response = await apiRequest(`/api/admin/payments/${filterForm.tahun}/${filterForm.bulan}`);
      const result = await response.json();
      if (result.status === 'success') {
        setPayments(result.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Use realtime data hook
  const { forceRefresh } = useRealtimeData(fetchPayments, [filterForm.tahun, filterForm.bulan]);

  const getUniqueBloks = () => {
    const bloks = payments.map(p => p.blok?.charAt(0)).filter(Boolean);
    const uniqueBloks = [...new Set(bloks)].sort();
    
    // Jika koordinator, hanya tampilkan bloknya
    if (user?.jenis === 'koordinator_perblok' && userBlok) {
      return uniqueBloks.filter(blok => blok === userBlok);
    }
    
    return uniqueBloks;
  };

  const filteredPayments = payments.filter(payment => {
    // Jika koordinator, filter otomatis berdasarkan bloknya
    if (user?.jenis === 'koordinator_perblok' && userBlok) {
      const paymentBlok = payment.blok?.charAt(0);
      if (paymentBlok !== userBlok) return false;
    }
    
    // Filter berdasarkan blok
    if (filterBlok !== 'semua' && payment.blok?.charAt(0) !== filterBlok) return false;
    
    // Filter berdasarkan status
    if (filterStatus !== 'semua' && payment.status !== filterStatus) return false;
    
    return true;
  });

  const handleConfirmPayment = async (id: number, status: string) => {
    const { value: catatan } = await Swal.fire({
      title: `${status === 'dikonfirmasi' ? 'Konfirmasi' : 'Tolak'} Pembayaran`,
      input: 'textarea',
      inputLabel: 'Catatan (opsional)',
      inputPlaceholder: 'Masukkan catatan...',
      showCancelButton: true,
      confirmButtonText: status === 'dikonfirmasi' ? 'Konfirmasi' : 'Tolak',
      cancelButtonText: 'Batal'
    });

    if (catatan !== undefined) {
      try {
        const response = await apiRequest(`/api/admin/payments/${id}/confirm`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, catatan })
        });

        const result = await response.json();
        if (result.status === 'success') {
          fetchPayments();
          
          // Emit socket event for realtime update
          const io = (window as any).io;
          if (io) {
            io.emit('payment-status-changed', {
              paymentId: id,
              status,
              catatan
            });
          }
          
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Status pembayaran berhasil diupdate',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal mengupdate status pembayaran'
        });
      }
    }
  };

  const handleExportPayments = async () => {
    try {
      const response = await apiRequest(`/api/admin/payments/export/${filterForm.tahun}/${filterForm.bulan}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        const csvContent = [
          [result.title],
          [''],
          ['Nama', 'Blok', 'No HP', 'Status', 'Bukti', 'Tanggal Upload'].join(','),
          ...result.data.map((item: any) => [
            item.nama,
            item.blok,
            item.no_hp,
            item.status,
            item.bukti ? `${window.location.origin}${item.bukti}` : '',
            item.tanggal_upload ? new Date(item.tanggal_upload).toLocaleDateString('id-ID') : ''
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pembayaran-${bulanNames[filterForm.bulan - 1]}-${filterForm.tahun}.csv`;
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
      case 'menunggu_konfirmasi': return 'Menunggu';
      case 'ditolak': return 'Ditolak';
      default: return 'Belum Bayar';
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'}`}>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
          Kelola Pembayaran Warga{user?.jenis === 'koordinator_perblok' && userBlok ? ` Blok ${userBlok}` : ''}
        </h1>
        
        <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'space-x-3'}`}>
          {(user?.jenis !== 'koordinator_perblok' || getUniqueBloks().length > 1) && (
            <select
              value={filterBlok}
              onChange={(e) => setFilterBlok(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${isMobile ? 'w-full' : ''}`}
            >
              <option value="semua">{user?.jenis === 'koordinator_perblok' ? `Blok ${userBlok}` : 'Semua Blok'}</option>
              {getUniqueBloks().map(blok => (
                <option key={blok} value={blok}>Blok {blok}</option>
              ))}
            </select>
          )}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 border rounded-lg ${isMobile ? 'w-full' : ''}`}
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu_konfirmasi">Menunggu</option>
            <option value="dikonfirmasi">Lunas</option>
            <option value="ditolak">Ditolak</option>
          </select>
          <select
            value={filterForm.tahun}
            onChange={(e) => setFilterForm({...filterForm, tahun: parseInt(e.target.value)})}
            className={`px-3 py-2 border rounded-lg ${isMobile ? 'w-full' : ''}`}
          >
            {[2023, 2024, 2025,2026,2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={filterForm.bulan}
            onChange={(e) => setFilterForm({...filterForm, bulan: parseInt(e.target.value)})}
            className={`px-3 py-2 border rounded-lg ${isMobile ? 'w-full' : ''}`}
          >
            {bulanNames.map((nama, index) => (
              <option key={index + 1} value={index + 1}>{nama}</option>
            ))}
          </select>
          <button
            onClick={forceRefresh}
            disabled={isRefreshing}
            className={`flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 ${isMobile ? 'w-full' : ''}`}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportPayments}
            className={`flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ${isMobile ? 'w-full' : ''}`}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-lg p-5 shadow border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{payment.nama}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Blok:</span>
                    <span className="font-semibold text-gray-700">{payment.blok}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">HP:</span>
                    <span className="text-gray-700">{payment.no_hp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Periode:</span>
                    <span className="font-semibold text-purple-600">{bulanNames[payment.bulan - 1]} {payment.tahun}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      Rp {payment.jumlah?.toLocaleString('id-ID') || '0'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Upload: {new Date(payment.tanggal_upload).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <img
                      src={`/assets/uploads/${payment.bukti_transfer}`}
                      alt="Bukti Transfer"
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-colors"
                      onClick={() => window.open(`/assets/uploads/${payment.bukti_transfer}`, '_blank')}
                    />
                    
                    {payment.status === 'menunggu_konfirmasi' && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleConfirmPayment(payment.id, 'dikonfirmasi')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Konfirmasi
                        </button>
                        <button
                          onClick={() => handleConfirmPayment(payment.id, 'ditolak')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tidak ada data pembayaran</h3>
            <p className="text-gray-500">Belum ada pembayaran untuk {bulanNames[filterForm.bulan - 1]} {filterForm.tahun}</p>
          </div>
        )}
      </div>
    </div>
  );
}