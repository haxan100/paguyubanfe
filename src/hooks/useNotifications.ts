import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import Swal from 'sweetalert2';

interface NotificationData {
  posts: number;
  aduan: number;
  payments: number;
}

export const useNotifications = (userRole: string) => {
  const [lastCounts, setLastCounts] = useState<NotificationData>({ posts: 0, aduan: 0, payments: 0 });
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.play().catch(() => {});
  };

  const checkNotifications = async () => {
    if (userRole !== 'ketua') return;

    try {
      const [postsRes, aduanRes, paymentsRes] = await Promise.all([
        apiRequest('/api/posts'),
        apiRequest('/api/aduan'),
        apiRequest('/api/admin/payments')
      ]);

      const [postsData, aduanData, paymentsData] = await Promise.all([
        postsRes.json(),
        aduanRes.json(),
        paymentsRes.json()
      ]);

      const currentCounts = {
        posts: postsData.status === 'success' ? postsData.data.length : 0,
        aduan: aduanData.status === 'success' ? aduanData.data.length : 0,
        payments: paymentsData.status === 'success' ? paymentsData.data.filter((p: any) => p.status === 'menunggu_konfirmasi').length : 0
      };

      console.log('Current counts:', currentCounts);
      console.log('Last counts:', lastCounts);
      console.log('Is first load:', isFirstLoad);

      if (!isFirstLoad) {
        let notifications = [];
        
        if (currentCounts.posts > lastCounts.posts) {
          notifications.push(`${currentCounts.posts - lastCounts.posts} postingan baru`);
        }
        if (currentCounts.aduan > lastCounts.aduan) {
          notifications.push(`${currentCounts.aduan - lastCounts.aduan} aduan baru`);
        }
        if (currentCounts.payments > lastCounts.payments) {
          notifications.push(`${currentCounts.payments - lastCounts.payments} pembayaran menunggu konfirmasi`);
        }

        console.log('Notifications:', notifications);

        if (notifications.length > 0) {
          playNotificationSound();
          Swal.fire({
            icon: 'info',
            title: 'Notifikasi Baru!',
            html: notifications.join('<br>'),
            timer: 5000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
          });
        }
      }

      setLastCounts(currentCounts);
      setIsFirstLoad(false);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  useEffect(() => {
    if (userRole === 'ketua') {
      checkNotifications();
      const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [userRole]); // Remove dependencies that cause infinite loop

  return { checkNotifications };
};