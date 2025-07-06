import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, CreditCard, Newspaper } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  id: number;
  jenis: string;
  blok: string;
}

interface PaymentData {
  id: number;
  status: string;
  blok: string;
}

interface PostData {
  id: number;
  blok: string;
}

interface AduanData {
  id: number;
  status: string;
  blok: string;
}

export default function KoordinatorDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [aduan, setAduan] = useState<AduanData[]>([]);

  const userBlok = user?.blok?.charAt(0); // Ambil huruf pertama blok

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users
      const usersResponse = await apiRequest('/api/users');
      const usersResult = await usersResponse.json();
      if (usersResult.status === 'success') {
        const filteredUsers = usersResult.data.filter((u: UserData) => 
          u.blok?.charAt(0) === userBlok && u.jenis === 'warga'
        );
        setUsers(filteredUsers);
      }

      // Fetch payments
      const paymentsResponse = await apiRequest('/api/admin/payments');
      const paymentsResult = await paymentsResponse.json();
      if (paymentsResult.status === 'success') {
        const filteredPayments = paymentsResult.data.filter((p: PaymentData) => 
          p.blok?.charAt(0) === userBlok
        );
        setPayments(filteredPayments);
      }

      // Fetch posts
      const postsResponse = await apiRequest('/api/posts');
      const postsResult = await postsResponse.json();
      if (postsResult.status === 'success') {
        const filteredPosts = postsResult.data.filter((p: PostData) => 
          p.blok?.charAt(0) === userBlok
        );
        setPosts(filteredPosts);
      }

      // Fetch aduan
      const aduanResponse = await apiRequest('/api/aduan');
      const aduanResult = await aduanResponse.json();
      if (aduanResult.status === 'success') {
        const filteredAduan = aduanResult.data.filter((a: AduanData) => 
          a.blok?.charAt(0) === userBlok
        );
        setAduan(filteredAduan);
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
      <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
        Dashboard Koordinator Blok {userBlok}
      </h1>
      
      {/* Statistics Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 md:grid-cols-4 gap-6'}`}>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="text-blue-500" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Warga Blok {userBlok}</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
                {users.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CreditCard className="text-green-500" size={isMobile ? 20 : 24} />
            <div className="ml-4">
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Pembayaran Lunas</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
                {payments.filter(p => p.status === 'dikonfirmasi').length}
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
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4`}>
            Info Warga Blok {userBlok}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Newspaper className="text-blue-500" size={20} />
              <span className="ml-2 text-gray-600">Total Posts</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{posts.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4`}>
            Status Aduan Blok {userBlok}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600">Selesai</span>
              <span className="font-semibold">{aduan.filter(a => a.status === 'selesai').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Proses</span>
              <span className="font-semibold">{aduan.filter(a => a.status === 'proses').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">Pending</span>
              <span className="font-semibold">{aduan.filter(a => a.status === 'pending').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}