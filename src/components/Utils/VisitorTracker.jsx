import { useEffect } from 'react';
import { useAPI } from '../../contexts/ApiContext';

// Posts a visitor record to /visitors once per browser (persists fingerprint)
export default function VisitorTracker() {
  const api = useAPI();

  useEffect(() => {
    let mounted = true;

    const alreadyTracked = () => {
      try {
        return !!localStorage.getItem('visitor_tracked');
      } catch (e) {
        return false;
      }
    };

    const markTracked = (fingerprint) => {
      try {
        if (fingerprint) localStorage.setItem('visitor_fingerprint', fingerprint);
        localStorage.setItem('visitor_tracked', '1');
      } catch (e) { /* ignore */ }
    };

    const track = async () => {
      if (!mounted) return;
      if (alreadyTracked()) return;

      try {
        // Dynamically import to avoid loading fingerprint library in initial bundle
        const FingerprintJS = await import('@fingerprintjs/fingerprintjs');
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result?.visitorId;
        if (!visitorId) return;

        const metadata = {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          url: typeof window !== 'undefined' ? window.location.href : null,
          referrer: typeof document !== 'undefined' ? document.referrer : null,
          ts: new Date().toISOString()
        };

        // Post to /visitors with required fingerprint
        try {
          await api.post('/visitors', { fingerprint: visitorId, metadata });
          markTracked(visitorId);
          console.debug('Visitor tracked:', visitorId);
        } catch (err) {
          console.warn('Failed to post visitor:', err);
          // still mark so we don't spam the API repeatedly
          markTracked(visitorId);
        }
      } catch (err) {
        console.warn('VisitorTracker: could not generate fingerprint', err);
      }
    };

    track();

    return () => { mounted = false; };
  }, [api]);

  return null;
}
