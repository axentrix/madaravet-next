'use client';

import { useEffect } from 'react';
import mixpanel, { initMixpanel } from '../lib/mixpanel';
import { usePathname } from 'next/navigation';

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure Mixpanel is initialized
    initMixpanel();
    
    // Generate or retrieve user ID and identify user
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('mixpanel_user_id');
      
      if (!userId) {
        // Generate a unique user ID
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('mixpanel_user_id', userId);
        console.log('🆔 Created new user ID:', userId);
      } else {
        console.log('🆔 Retrieved existing user ID:', userId);
      }
      
      // Identify the user in Mixpanel - This is CRITICAL for user tracking
      mixpanel.identify(userId);
      console.log('✅ User identified in Mixpanel:', userId);
      
      // Register user properties that will be sent with every event
      mixpanel.register({
        'User ID': userId,
        'User Agent': navigator.userAgent,
        'Language': navigator.language,
        'Platform': navigator.platform,
      });
      
      // Track a session start event (Mixpanel uses this for Active Users)
      mixpanel.track('Session Start', {
        'timestamp': new Date().toISOString(),
        'First Visit': !localStorage.getItem('mixpanel_returning_user'),
      });
      
      // Mark user as returning for future visits
      localStorage.setItem('mixpanel_returning_user', 'true');
      console.log('📊 Tracked Session Start');
      
      // Also set user profile properties (requires People add-on in Mixpanel)
      try {
        mixpanel.people.set({
          '$name': userId,
          'First Seen': new Date().toISOString(),
          'Last Seen': new Date().toISOString(),
        });
        console.log('👤 User profile updated');
      } catch (e) {
        console.log('ℹ️ People tracking not available (requires Mixpanel People add-on)');
      }
    }
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('mixpanel_user_id');
      
      mixpanel.track('Page View', {
        'distinct_id': userId,
        'page': pathname,
        'url': window.location.href,
        'referrer': document.referrer,
        'timestamp': new Date().toISOString(),
      });
      console.log('📊 Tracked Page View:', pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}
