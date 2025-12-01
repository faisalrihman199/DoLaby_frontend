import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Try to scroll the app content container first (for layouts that have internal scroll)
    try {
      const el = document.getElementById('app-content');
      if (el) {
        // If element has its own scroll, set it to top smoothly
        if (typeof el.scrollTo === 'function') {
          el.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } else {
          el.scrollTop = 0;
        }
      }
    } catch (e) {
      // ignore
    }

    // Also ensure window is at top for pages that use window scrolling
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } catch (e) {}

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  return null;
}
