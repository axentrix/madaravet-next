import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with Session Replay for Heatmaps
mixpanel.init('d04b9120d4c0d50d1ca920e0a0608964', {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
  persistence: 'localStorage',
  // Session Replay settings (required for Mixpanel heatmaps)
  record_sessions_percent: 100,  // Record 100% of sessions
  record_block_selector: '.sensitive-data, [data-private]',  // Block sensitive elements
  record_collect_fonts: true,  // Capture fonts for better replay quality
});

export default mixpanel;
