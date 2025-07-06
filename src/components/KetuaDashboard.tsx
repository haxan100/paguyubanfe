import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, CreditCard, Newspaper } from 'lucide-react';
import { apiRequest } from '../utils/api';

interface UserData {
  id: number;
  jenis: string;
}

interface PaymentData {
  id: number;
  status: string;
}

interface PostData {
  id: number;
}

interface AduanData {
  id: number;
  status: string;
}

export default function KetuaDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [aduan, setAduan] = useState<AduanData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users
      const usersResponse = await apiRequest('/api/users');
      const usersResult = await usersResponse.json();
      if (usersResult.status === 'success') {
        setUsers(usersResult.data);
      }

      // Fetch payments
      const paymentsResponse = await apiRequest('/api/admin/payments');
      const paymentsResult = await paymentsResponse.json();
      if (paymentsResult.status === 'success') {
        setPayments(paymentsResult.data);
      }

      // Fetch posts
      const postsResponse = await apiRequest('/api/posts');
      const postsResult = await postsResponse.json();
      if (postsResult.status === 'success') {
        setPosts(postsResult.data);
      }

      // Fetch aduan
      const aduanResponse = await apiRequest('/api/aduan');
      const aduanResult = await aduanResponse.json();
      if (aduanResult.status === 'success') {
        setAduan(aduanResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
      <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>Dashboard Ketua</h1>
      
      {/* Statistics Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 md:grid-cols-4 gap-6'}`}>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="text-blue-500" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Total Admin</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
                {users.filter(u => u.jenis === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="text-green-500" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Total Koordinator</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
                {users.filter(u => u.jenis === 'koordinator_perblok').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CreditCard className="text-yellow-500" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Pembayaran Pending</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
                {payments.filter(p => p.status === 'menunggu_konfirmasi').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MessageCircle className="text-purple-500" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Aduan Pending</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
                {aduan.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4`}>Info Warga Terbaru</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Newspaper className="text-blue-500" size={20} />
              <span className="ml-2 text-gray-600">Total Posts</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{posts.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4`}>Status Pembayaran</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600">Lunas</span>
              <span className="font-semibold">{payments.filter(p => p.status === 'dikonfirmasi').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">Menunggu</span>
              <span className="font-semibold">{payments.filter(p => p.status === 'menunggu_konfirmasi').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Ditolak</span>
              <span className="font-semibold">{payments.filter(p => p.status === 'ditolak').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}