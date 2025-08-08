import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  // Show notification toast
  const showNotification = (data: any) => {
    playNotificationSound();
    
    Swal.fire({
      icon: 'info',
      title: data.title || 'Notifikasi Baru',
      text: data.message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      background: '#f0f9ff',
      color: '#1e40af'
    });
  };

  useEffect(() => {
    if (user && !socketRef.current) {
      console.log('🔌 Connecting to socket with user:', user);
      // Connect to socket server
      socketRef.current = io('http://localhost:5170', {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        forceNew: true
      });

      socketRef.current.on('connect', () => {
        console.log('🔌 Connected to socket server with ID:', socketRef.current?.id);
        // Join user room and role-based rooms
        const roomData = {
          userId: user.id,
          role: user.jenis,
          blok: user.blok
        };
        console.log('📡 Joining rooms with data:', roomData);
        socketRef.current?.emit('join-room', roomData);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
      });

      // Listen for payment notifications
      socketRef.current.on('payment-notification', (data) => {
        console.log('💰 Payment notification received:', data);
        showNotification({
          title: '💰 Pembayaran Baru',
          message: `${data.nama} dari Blok ${data.blok} telah melakukan pembayaran ${data.jenis_pembayaran}`
        });
        
        // Trigger realtime refresh
        window.dispatchEvent(new CustomEvent('payment-update', { detail: data }));
      });

      // Listen for payment status updates
      socketRef.current.on('payment-status-update', (data) => {
        console.log('🔄 Payment status update:', data);
        window.dispatchEvent(new CustomEvent('payment-update', { detail: data }));
      });

      // Listen for general notifications
      socketRef.current.on('notification', (data) => {
        console.log('🔔 Notification received:', data);
        showNotification(data);
      });

      // Listen for complaint notifications
      socketRef.current.on('complaint-notification', (data) => {
        console.log('📝 Complaint notification:', data);
        showNotification({
          title: '📝 Aduan Baru',
          message: `${data.nama} dari Blok ${data.blok} mengajukan aduan: ${data.judul}`
        });
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Disconnected from socket server');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  const emitEvent = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket: socketRef.current,
    emitEvent
  };
};