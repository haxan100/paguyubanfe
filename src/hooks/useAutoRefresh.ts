import { useEffect } from 'react';

export const useAutoRefresh = (fetchFunction: () => void) => {
  useEffect(() => {
    const handleRefresh = () => {
      fetchFunction();
    };

    window.addEventListener('data-refresh', handleRefresh);
    return () => window.removeEventListener('data-refresh', handleRefresh);
  }, [fetchFunction]);
};

export const triggerDataRefresh = () => {
  window.dispatchEvent(new CustomEvent('data-refresh'));
};