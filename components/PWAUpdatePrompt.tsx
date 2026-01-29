'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Workbox } from 'workbox-window';

export default function PWAUpdatePrompt() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [worker, setWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      // Add event listeners to handle any of PWA lifecycle event
      wb.addEventListener('installed', (event) => {
        console.log(`Event ${event.type} is triggered.`);
        if (event.isUpdate) {
          // A new service worker has been installed.
          setIsUpdateAvailable(true);
        }
      });

      wb.addEventListener('controlling', (event) => {
        console.log(`Event ${event.type} is triggered.`);
        // Page is being controlled by a service worker.
      });

      wb.addEventListener('activated', (event) => {
        console.log(`Event ${event.type} is triggered.`);
        // Service worker is active.
      });

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting for activation.
      wb.addEventListener('waiting', (event) => {
        console.log(`Event ${event.type} is triggered.`);
        setIsUpdateAvailable(true);
        if (event.sw) {
          setWorker(event.sw);
        }
      });

      // Register the service worker
      wb.register();
    }
  }, []);

  const handleUpdate = () => {
    if (worker) {
      worker.postMessage({ type: 'SKIP_WAITING' });
    }
    // Force reload to pick up new version
    window.location.reload();
  };

  const handleDismiss = () => {
    setIsUpdateAvailable(false);
  };

  if (!isUpdateAvailable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-premium border border-slate-700 flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">
            Aggiornamento disponibile
          </h3>
          <p className="text-xs text-slate-300">
            È disponibile una nuova versione dell&apos;app. Aggiorna per vedere
            le modifiche.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            aria-label="Chiudi"
          >
            <X size={18} />
          </button>
          <button
            onClick={handleUpdate}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
          >
            <RefreshCw size={16} />
            <span>Aggiorna</span>
          </button>
        </div>
      </div>
    </div>
  );
}
