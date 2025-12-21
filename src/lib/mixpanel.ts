import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
mixpanel.init('d04b9120d4c0d50d1ca920e0a0608964', {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
  persistence: 'localStorage',
});

export default mixpanel;
