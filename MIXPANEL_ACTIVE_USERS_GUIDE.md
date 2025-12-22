# Mixpanel Active Users Troubleshooting Guide

## Understanding Active Users in Mixpanel

Mixpanel counts "Active Users" based on **unique `distinct_id` values** associated with events. If you see events but no users, it means the events aren't properly linked to unique user identities.

## How Our Implementation Works

1. **User ID Generation**: Each visitor gets a unique ID stored in `localStorage`
2. **User Identification**: We call `mixpanel.identify(userId)` to link all events to that user
3. **Event Tracking**: Events like "Session Start" and "Page View" are tracked with user context
4. **User Registration**: We use `mixpanel.register()` to attach user properties to ALL events

## Why You Might Not See Active Users

### Issue 1: Time Delay
**Solution**: Wait 5-15 minutes after visiting the site. Mixpanel can take time to process data.

### Issue 2: Date Range in Dashboard
**Problem**: Your dashboard might be set to the wrong time range.

**Solution**:
1. Go to Mixpanel dashboard
2. Look for the date selector (usually top right)
3. Change to "Today" or "Last 24 hours"
4. Refresh the page

### Issue 3: Project/Property Mismatch
**Problem**: You might be looking at the wrong Mixpanel project.

**Solution**:
1. Verify you're in the correct project (check project name at top)
2. Confirm the project token matches: `d04b9120d4c0d50d1ca920e0a0608964`

### Issue 4: Active Users Widget Configuration
**Problem**: The "Active Users" widget needs to be configured to look at the right events.

**Solution**:
1. Click on the "Active Users" widget
2. Click "Edit" or the gear icon
3. Under "Measured by", ensure it's set to:
   - **"Total Events"** OR
   - **Specific events like "Session Start" or "Page View"**
4. Save and refresh

## Verifying Everything is Working

### Step 1: Check Browser Console
Visit your site and open DevTools Console. You should see:
```
✅ Mixpanel initialized successfully
🆔 Created new user ID: user_1766401034632_rz2mkfg2c
✅ User identified in Mixpanel: user_1766401034632_rz2mkfg2c
📊 Tracked Session Start
👤 User profile updated
📊 Tracked Page View: /
```

### Step 2: Check Mixpanel Events Section
1. Go to Mixpanel → **Events**
2. You should see:
   - "Session Start" events
   - "Page View" events
3. Click on an event to see its properties
4. Verify there's a **`$distinct_id`** or **`distinct_id`** property with your user ID

### Step 3: Check Network Tab
1. Open DevTools → Network tab
2. Filter by "mixpanel" or "api.mixpanel.com"
3. You should see requests being sent
4. Check request payload - it should contain your user ID

### Step 4: Check Users in Mixpanel
1. Go to Mixpanel → **Users** section (or **Profiles**)
2. Search for your user ID (e.g., `user_1766401034632_rz2mkfg2c`)
3. You should see the user profile with events

## Manual Testing

### Test 1: Clear Your Data and Start Fresh
```javascript
// Open browser console on your site and run:
localStorage.clear();
location.reload();
```
This creates a fresh user ID and tracks a new session.

### Test 2: Check Mixpanel Live View
1. Go to Mixpanel → **Live View** (if available)
2. Visit your website
3. You should see events appearing in real-time

### Test 3: Use Mixpanel Debugger
1. In Mixpanel, go to **Settings** → **Project Settings**
2. Enable "Debug Mode" if available
3. Visit your site
4. Check for any error messages in Mixpanel

## Common Solutions

### Solution A: Recreate "Active Users" Widget
1. Delete the existing "Active Users" widget
2. Click "+ Add Insight"
3. Select **"Users"** insight type
4. Configure:
   - Event: "Session Start" or "Page View"
   - Time range: "Last 24 hours"
5. Save to dashboard

### Solution B: Use Custom Query
Instead of the default widget, create a custom query:
1. Go to **Insights** → **Create New Insight**
2. Select **"Users"**
3. Configure:
   - Show: **Unique users who did**
   - Event: **Session Start**
   - Time range: **Today**
4. Click "View Results"
5. You should see a count of unique users

### Solution C: Check for Ad Blockers
Ad blockers might block Mixpanel. Test in:
- Incognito/Private browsing mode
- Different browser
- With ad blocker disabled

## What Active Users Should Show

Once working correctly, you should see:

### In Events Section:
- Events with `distinct_id` property
- Events grouped by user

### In Users Section:
- User profiles with their IDs
- Event count per user
- User properties (Language, Platform, etc.)

### In Active Users Widget:
- A number showing unique users
- A graph showing user activity over time

## Still Not Working?

### Double-Check Event Properties
In Mixpanel Events section, click on a "Session Start" event and verify it has:
- `distinct_id` or `$distinct_id` ✓
- `timestamp` ✓
- `User ID` (in super properties) ✓

### Verify the Implementation
Check browser console for any errors, and ensure you see all the expected log messages when the page loads.

### Wait Longer
Mixpanel can sometimes take up to 2 hours to fully process and display user data, especially for new projects or after major changes.

### Contact Support
If nothing works:
1. Take screenshots of:
   - Browser console logs
   - Network tab showing Mixpanel requests
   - Mixpanel Events section showing events with properties
2. Contact Mixpanel support with these details
