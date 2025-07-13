import React, { useState, useEffect } from 'react';
import { Download, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

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
  const [exportForm, setExportForm] = useState({
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1
  });
  const [filterBlok, setFilterBlok] = useState('semua');
  
  const userBlok = user?.blok?.charAt(0); // Ambil huruf pertama blok koordinator

  const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await apiRequest('/api/admin/payments');
      const result = await response.json();
      if (result.status === 'success') {
        setPayments(result.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

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
    
    // Filter berdasarkan dropdown
    if (filterBlok === 'semua') return true;
    return payment.blok?.charAt(0) === filterBlok;
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
      const response = await apiRequest(`/api/admin/payments/export/${exportForm.tahun}/${exportForm.bulan}`);
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
        a.download = `pembayaran-${bulanNames[exportForm.bulan - 1]}-${exportForm.tahun}.csv`;
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
        
        <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'space-x-4'}`}>
          {/* Hanya tampilkan filter blok jika bukan koordinator atau ada lebih dari 1 blok */}
          {(user?.jenis !== 'koordinator_perblok' || getUniqueBloks().length > 1) && (
            <select
              value={filterBlok}
              onChange={(e) => setFilterBlok(e.target.value)}
              className={`px-3 py-2 border border-gray-300 rounded-lg ${isMobile ? 'w-full' : ''}`}
            >
              <option value="semua">{user?.jenis === 'koordinator_perblok' ? `Blok ${userBlok}` : 'Semua Blok'}</option>
              {getUniqueBloks().map(blok => (
                <option key={blok} value={blok}>Blok {blok}</option>
              ))}
            </select>
          )}
          <select
            value={exportForm.tahun}
            onChange={(e) => setExportForm({...exportForm, tahun: parseInt(e.target.value)})}
            className={`px-3 py-2 border border-gray-300 rounded-lg ${isMobile ? 'w-full' : ''}`}
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={exportForm.bulan}
            onChange={(e) => setExportForm({...exportForm, bulan: parseInt(e.target.value)})}
            className={`px-3 py-2 border border-gray-300 rounded-lg ${isMobile ? 'w-full' : ''}`}
          >
            {bulanNames.map((nama, index) => (
              <option key={index + 1} value={index + 1}>{nama}</option>
            ))}
          </select>
          <button
            onClick={handleExportPayments}
            className={`flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ${isMobile ? 'w-full' : ''}`}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-lg p-4 shadow border">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>{payment.nama}</h3>
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Blok {payment.blok} • {payment.no_hp}
                </p>
                <p className={`font-semibold text-blue-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Rp {payment.jumlah?.toLocaleString('id-ID') || '0'}
                </p>
                <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {new Date(payment.tanggal_upload).toLocaleDateString('id-ID')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.status)}`}>
                {getStatusText(payment.status)}
              </span>
            </div>
            
            <div className={`flex items-center ${isMobile ? 'justify-between' : 'space-x-4'}`}>
              <img
                src={`/assets/uploads/${payment.bukti_transfer}`}
                alt="Bukti Transfer"
                className={`object-cover rounded cursor-pointer ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}
                onClick={() => window.open(`/assets/uploads/${payment.bukti_transfer}`, '_blank')}
              />
              
              {payment.status === 'menunggu_konfirmasi' && (
                <div className={`${isMobile ? 'flex flex-col space-y-1' : 'space-x-2'}`}>
                  <button
                    onClick={() => handleConfirmPayment(payment.id, 'dikonfirmasi')}
                    className={`bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 ${isMobile ? 'w-20' : ''}`}
                  >
                    Konfirmasi
                  </button>
                  <button
                    onClick={() => handleConfirmPayment(payment.id, 'ditolak')}
                    className={`bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ${isMobile ? 'w-20' : ''}`}
                  >
                    Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Belum ada pembayaran</p>
          </div>
        )}
      </div>
    </div>
  );
}