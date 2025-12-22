# Mixpanel Tracking Fix

## Problem
Mixpanel dashboard was showing "We couldn't find any data for your query" with no users appearing in the dashboard, even though session replays were working.

## Root Causes
1. The Mixpanel library (`mixpanel-browser`) was being initialized on the server-side in Next.js, but it only works in the browser environment. This caused the initialization to fail silently, resulting in no events being tracked.
2. Users were not being properly identified with `mixpanel.identify()`, so Mixpanel couldn't distinguish between different users and track them in the Users section.

## Solution Applied

### 1. Updated `src/lib/mixpanel.ts`
- Added `'use client'` directive to ensure client-side execution
- Implemented browser environment check (`typeof window !== 'undefined'`)
- Created `initMixpanel()` function with proper initialization guards
- Enabled debug mode for development visibility
- Changed `track_pageview: false` to manually control page view tracking

### 2. Updated `src/components/MixpanelProvider.tsx`
- **Added user identification system**: Generate unique user IDs stored in localStorage
- **Call `mixpanel.identify(userId)`**: Critical for tracking individual users in Mixpanel
- **Register user properties**: User Agent, Language, Platform sent with every event
- **Track "Session Start" event**: Helps identify when users first visit the site
- **Set user profile properties**: Updates Mixpanel People profiles (if available)
- Improved page view tracking with additional metadata including distinct_id
- Added comprehensive console logs for debugging

### 3. Updated `src/lib/analytics.ts`
- Added `'use client'` directive for client-side execution

## Verification

### Check Browser Console
When you run the app, you should see in the browser console:
```
✅ Mixpanel initialized successfully
🆔 Created new user ID: user_1766401034632_rz2mkfg2c
✅ User identified in Mixpanel: user_1766401034632_rz2mkfg2c
📊 Tracked Session Start
👤 User profile updated
📊 Tracked Page View: /
```

### Check Mixpanel Dashboard
1. Go to your Mixpanel dashboard
2. Navigate to **Users** section - You should now see active users with their IDs
3. Navigate to **Events** section
4. You should now see:
   - **Session Start** events (tracked when users first visit)
   - **Page View** events with properties (page, url, referrer, distinct_id)
   - Real-time user activity with distinct user IDs
   - Session replay data for heatmaps
5. In the **Active Users** widgets, you should see user counts populate

### Debug Mode
Debug mode is currently enabled (`debug: true`) which shows all Mixpanel requests in the console. This helps verify events are being sent.

## Next Steps

1. **Wait 5-10 minutes** for data to appear in Mixpanel (there can be a slight delay)
2. **Test different pages** to ensure page view tracking works across routes
3. **Use analytics helpers** to track custom events:
   ```typescript
   import { analytics } from '@/lib/analytics';
   
   // Track button click
   analytics.trackClick('Contact Button');
   
   // Track form submission
   analytics.trackFormSubmit('Contact Form', { success: true });
   
   // Track custom event
   analytics.trackEvent('Service Selected', { service: 'Vaccination' });
   ```

## Important Notes

- **Session Replay** is enabled at 100% for heatmaps
- Events are sent in real-time but may take a few minutes to appear in dashboard
- For production, consider changing `debug: false` in `src/lib/mixpanel.ts`
- The Mixpanel token is: `d04b9120d4c0d50d1ca920e0a0608964`

## Troubleshooting

If events still don't appear:
1. Check browser console for errors
2. Verify network tab shows requests to `api.mixpanel.com`
3. Ensure localStorage is enabled in the browser
4. Check Mixpanel project settings for any filtering rules
