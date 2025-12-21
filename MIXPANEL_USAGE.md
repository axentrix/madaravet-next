# Mixpanel Integration

Mixpanel has been successfully installed and configured in this project.

## Configuration

- **Project Token**: `d04b9120d4c0d50d1ca920e0a0608964`
- **Location**: `src/lib/mixpanel.ts`

## Features

### Automatic Page View Tracking
Page views are automatically tracked when users navigate between pages, thanks to the `MixpanelProvider` component.

### Manual Event Tracking

You can import and use the analytics helper functions in any component:

```typescript
import { analytics } from '@/lib/analytics';

// Track a button click
analytics.trackClick('Book Appointment Button');

// Track a form submission
analytics.trackFormSubmit('Contact Form', { 
  location: 'Contact Page' 
});

// Track navigation
analytics.trackNavigation('/services');

// Track custom events
analytics.trackEvent('Service Selected', { 
  service: 'Vaccination',
  category: 'Medical'
});

// Identify a user (when you have user info)
analytics.identifyUser('user123', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Usage Examples

### In a React Component

```typescript
'use client';

import { analytics } from '@/lib/analytics';

export default function ContactButton() {
  const handleClick = () => {
    analytics.trackClick('Contact Button', {
      location: 'Header'
    });
    // Your button logic here
  };

  return (
    <button onClick={handleClick}>
      Contact Us
    </button>
  );
}
```

### Tracking Form Submissions

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  analytics.trackFormSubmit('Appointment Form', {
    service: selectedService,
    date: appointmentDate
  });
  
  // Submit form logic
};
```

## Files Created

1. **src/lib/mixpanel.ts** - Mixpanel initialization
2. **src/components/MixpanelProvider.tsx** - Provider for automatic page tracking
3. **src/lib/analytics.ts** - Helper functions for easy event tracking
4. **src/app/layout.tsx** - Updated to include MixpanelProvider

## Debug Mode

When running in development mode (`NODE_ENV === 'development'`), Mixpanel will output debug information to the console.

## Next Steps

1. Start tracking important user interactions (button clicks, form submissions, etc.)
2. Monitor events in your Mixpanel dashboard
3. Set up funnels and custom reports as needed
