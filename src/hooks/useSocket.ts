import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Swal from 'sweetalert2';

export const useSocket = (userId: string, userRole: string, onDataUpdate?: (type: string) => void) => {
  const socketRef = useRef<Socket | null>(null);

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Fallback to beep sound if MP3 fails
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    });
  };

  useEffect(() => {
    if (!userId) return;

    console.log('Connecting to Socket.IO...', { userId, userRole });
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });
    
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
      socketRef.current?.emit('join-room', userId);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Listen for notifications based on role
    if (userRole === 'ketua') {
      socketRef.current.on('new-post', (data) => {
        console.log('Received new-post:', data);
        playNotificationSound();
        Swal.fire({
          icon: 'info',
          title: 'Postingan Baru!',
          text: `${data.user} membuat postingan baru`,
          timer: 5000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
        onDataUpdate?.('posts');
      });

      socketRef.current.on('new-payment', (data) => {
        console.log('Received new-payment:', data);
        playNotificationSound();
        Swal.fire({
          icon: 'info',
          title: 'Pembayaran Baru!',
          text: `${data.user} upload pembayaran baru`,
          timer: 5000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
        onDataUpdate?.('payments');
      });

      socketRef.current.on('new-aduan', (data) => {
        console.log('Received new-aduan:', data);
        playNotificationSound();
        Swal.fire({
          icon: 'warning',
          title: 'Aduan Baru!',
          text: `${data.user} membuat aduan baru`,
          timer: 5000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
        onDataUpdate?.('aduan');
      });
    }

    // Listen for payment confirmations (for all users)
    socketRef.current.on('payment-confirmed', (data) => {
      console.log('Received payment-confirmed:', data);
      playNotificationSound();
      Swal.fire({
        icon: data.status === 'dikonfirmasi' ? 'success' : 'error',
        title: data.status === 'dikonfirmasi' ? 'Pembayaran Dikonfirmasi!' : 'Pembayaran Ditolak',
        text: data.message,
        html: data.catatan ? `${data.message}<br><small>Catatan: ${data.catatan}</small>` : data.message,
        timer: 8000,
        showConfirmButton: true,
        position: 'center'
      });
      onDataUpdate?.('payments');
    });

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket...');
        socketRef.current.disconnect();
      }
    };
  }, [userId, userRole]);

  return socketRef.current;
};