import { useState, useEffect } from 'react';
import './VersionChecker.css';

declare const __BUILD_TIMESTAMP__: string;

const VersionChecker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Only check versions in production
    if (import.meta.env.DEV) return;

    const checkVersion = async () => {
      try {
        const res = await fetch(`/version.json?_t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.version && data.version !== __BUILD_TIMESTAMP__) {
          setUpdateAvailable(true);
        }
      } catch {
        // Silent fail — not critical
      }
    };

    // First check after 3s, then every 2 minutes
    const timeout = setTimeout(checkVersion, 3000);
    const interval = setInterval(checkVersion, 120_000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const handleUpdate = async () => {
    try {
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(name => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
    } catch (e) {
      console.error('Cache clear error:', e);
    }
    // Hard reload from server
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="version-update-banner">
      <div className="version-update-content">
        <span className="version-update-icon">🔄</span>
        <p>A newer version of Talentron is available!</p>
        <button onClick={handleUpdate} className="version-update-btn">
          Update Now
        </button>
      </div>
    </div>
  );
};

export default VersionChecker;
