import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, TrendingUp, DollarSign } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';



export default function KoordinatorDashboard() {
  const { user } = useAuth();
  const [koordinatorStats, setKoordinatorStats] = useState({
    totalWarga: 0,
    totalAduan: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0
  });
  const [loading, setLoading] = useState(true);

  const userBlok = user?.blok?.charAt(0); // Ambil huruf pertama blok

  useEffect(() => {
    fetchKoordinatorStats();
  }, []);

  const fetchKoordinatorStats = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/dashboard/koordinator');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.status === 'success') {
        setKoordinatorStats(result.data);
      } else {
        console.error('API Error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching koordinator stats:', error);
    } finally {
      setLoading(false);
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
      <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
        Dashboard Koordinator Blok {userBlok}
      </h1>
      
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}
      
      {/* Statistics Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 md:grid-cols-5 gap-6'}`}>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="text-blue-500" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Warga Blok {userBlok}</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
                {koordinatorStats.totalWarga}
              </p>
            </div>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="text-green-500" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Total Pemasukan</p>
              <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
                Rp {koordinatorStats.totalPemasukan.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="text-red-500 transform rotate-180" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Total Pengeluaran</p>
              <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
                Rp {koordinatorStats.totalPengeluaran.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className={koordinatorStats.saldo >= 0 ? "text-blue-500" : "text-red-500"} size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Saldo Saat Ini</p>
              <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold ${koordinatorStats.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                Rp {koordinatorStats.saldo.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4`}>
          Ringkasan Blok {userBlok}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{koordinatorStats.totalWarga}</p>
            <p className="text-sm text-gray-600">Total Warga</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{koordinatorStats.totalAduan}</p>
            <p className="text-sm text-gray-600">Total Aduan</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">Rp {(koordinatorStats.totalPemasukan / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-600">Pemasukan</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-600">Rp {(koordinatorStats.totalPengeluaran / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-600">Pengeluaran</p>
          </div>
        </div>
      </div>
    </div>
  );
}