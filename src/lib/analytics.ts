'use client';

import mixpanel from './mixpanel';

// Helper functions for tracking common events
export const analytics = {
  // Track page views (automatically done by MixpanelProvider)
  trackPageView: (pageName: string) => {
    mixpanel.track('Page View', { page: pageName });
  },

  // Track button clicks
  trackClick: (buttonName: string, properties?: Record<string, any>) => {
    mixpanel.track('Button Click', { button: buttonName, ...properties });
  },

  // Track form submissions
  trackFormSubmit: (formName: string, properties?: Record<string, any>) => {
    mixpanel.track('Form Submit', { form: formName, ...properties });
  },

  // Track navigation
  trackNavigation: (destination: string, properties?: Record<string, any>) => {
    mixpanel.track('Navigation', { destination, ...properties });
  },

  // Identify user (when you have user information)
  identifyUser: (userId: string, properties?: Record<string, any>) => {
    mixpanel.identify(userId);
    if (properties) {
      mixpanel.people.set(properties);
    }
  },

  // Track custom events
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    mixpanel.track(eventName, properties);
  },

  // Reset user identity (on logout)
  reset: () => {
    mixpanel.reset();
  },
};

export default analytics;
