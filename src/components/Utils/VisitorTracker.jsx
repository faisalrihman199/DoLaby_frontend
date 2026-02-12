import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAPI } from '../../contexts/ApiContext';

// Tracks:
// 1) Unique visitor (backend)
// 2) Page views (Google Tag Manager / GA4)
export default function VisitorTracker() {
  const api = useAPI();
  const location = useLocation();

  /* =========================
     1️⃣ Backend Visitor Tracking
     ========================= */
  useEffect(() => {
    let mounted = true;

    const alreadyTracked = () => {
      try {
        return !!localStorage.getItem('visitor_tracked');
      } catch {
        return false;
      }
    };

    const markTracked = (fingerprint) => {
      try {
        if (fingerprint) localStorage.setItem('visitor_fingerprint', fingerprint);
        localStorage.setItem('visitor_tracked', '1');
      } catch {}
    };

    const trackVisitor = async () => {
      if (!mounted || alreadyTracked()) return;

      try {
        const FingerprintJS = await import('@fingerprintjs/fingerprintjs');
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result?.visitorId;
        if (!visitorId) return;

        const metadata = {
          userAgent: navigator?.userAgent ?? null,
          url: window?.location?.href ?? null,
          referrer: document?.referrer ?? null,
          ts: new Date().toISOString()
        };

        try {
          await api.post('/visitors', { fingerprint: visitorId, metadata });
          markTracked(visitorId);
        } catch {
          markTracked(visitorId);
        }
      } catch (err) {
        console.warn('VisitorTracker fingerprint error', err);
      }
    };

    trackVisitor();
    return () => { mounted = false; };
  }, [api]);

  /* =========================
     2️⃣ Google Analytics Page Views
     ========================= */
  useEffect(() => {
    if (!window.dataLayer) return;

    window.dataLayer.push({
      event: 'page_view',
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href
    });
  }, [location]);

  return null;
}
