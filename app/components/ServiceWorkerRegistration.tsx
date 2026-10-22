'use client';

import { useEffect } from 'react';

export const ServiceWorkerRegistration: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  return null;
};
