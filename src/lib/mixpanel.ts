'use client';

import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel only on client side
let isInitialized = false;

const initMixpanel = () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    mixpanel.init('d04b9120d4c0d50d1ca920e0a0608964', {
      debug: true,  // Enable debug mode to see events in console
      track_pageview: false,  // We'll track manually for more control
      persistence: 'localStorage',
      // Session Replay settings (required for Mixpanel heatmaps)
      record_sessions_percent: 100,  // Record 100% of sessions
      record_block_selector: '.sensitive-data, [data-private]',  // Block sensitive elements
      record_collect_fonts: true,  // Capture fonts for better replay quality
    });
    isInitialized = true;
    console.log('✅ Mixpanel initialized successfully');
  }
};

// Initialize on import if in browser
if (typeof window !== 'undefined') {
  initMixpanel();
}

export { initMixpanel };
export default mixpanel;
