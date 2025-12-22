'use client';

import { useEffect } from 'react';
import mixpanel, { initMixpanel } from '../lib/mixpanel';
import { usePathname } from 'next/navigation';

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure Mixpanel is initialized
    initMixpanel();
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (typeof window !== 'undefined') {
      mixpanel.track('Page View', {
        'page': pathname,
        'url': window.location.href,
        'referrer': document.referrer,
      });
      console.log('Tracked page view:', pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}
