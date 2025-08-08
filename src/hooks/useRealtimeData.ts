import { useEffect, useRef } from 'react';

export const useRealtimeData = (fetchFunction: () => void, dependencies: any[] = []) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchFunction();

    // Listen for socket events
    const handleUpdate = () => {
      console.log('🔄 Realtime data update triggered');
      fetchFunction();
    };

    window.addEventListener('payment-update', handleUpdate);
    window.addEventListener('post-update', handleUpdate);
    window.addEventListener('aduan-update', handleUpdate);
    window.addEventListener('data-update', handleUpdate);

    // Remove auto refresh - use socket only

    return () => {
      window.removeEventListener('payment-update', handleUpdate);
      window.removeEventListener('post-update', handleUpdate);
      window.removeEventListener('aduan-update', handleUpdate);
      window.removeEventListener('data-update', handleUpdate);
    };
  }, dependencies);

  const forceRefresh = () => {
    fetchFunction();
  };

  return { forceRefresh };
};