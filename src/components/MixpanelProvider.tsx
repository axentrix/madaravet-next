'use client';

import { useEffect } from 'react';
import mixpanel from '../lib/mixpanel';
import { usePathname } from 'next/navigation';

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views on route change
    mixpanel.track_pageview({
      'Page': pathname,
    });
  }, [pathname]);

  return <>{children}</>;
}
