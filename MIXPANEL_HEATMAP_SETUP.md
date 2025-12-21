# Mixpanel Native Heatmap Setup Guide

## Prerequisites

⚠️ **Important**: Mixpanel's native heatmap feature requires a **paid plan** (Growth or Enterprise). Check your current plan at: https://mixpanel.com/pricing

## Your Setup Status

✅ **Already Configured**:
- Mixpanel is installed and initialized
- Project token: `d04b9120d4c0d50d1ca920e0a0608964`
- Automatic page tracking is enabled
- All code requirements are met

## Setting Up Heatmaps in Mixpanel Dashboard

### Step 1: Log in to Mixpanel
1. Go to: https://mixpanel.com/
2. Log in with your account credentials
3. Select your project

### Step 2: Check Your Plan
1. Click on your profile/settings (top right)
2. Go to **Billing & Plan**
3. Verify you have a **Growth** or **Enterprise** plan
4. If not, upgrade your plan to access heatmaps

### Step 3: Enable Heatmaps
1. From the main dashboard, go to **Applications** → **Session Replay**
2. Or navigate directly to: **Reports** → **Heatmaps**
3. Click **"Create New Heatmap"** or **"Set Up Heatmaps"**

### Step 4: Configure Your Website
1. **Enter your website URL**: `https://madaravet.com`
2. **Select pages to track**:
   - Homepage: `https://madaravet.com/`
   - About: `https://madaravet.com/about/`
   - Services: `https://madaravet.com/services/`
   - Contact: `https://madaravet.com/contact/`
   - Blog: `https://madaravet.com/blog/`

### Step 5: Install Heatmap Script (if required)
Mixpanel may ask you to add an additional script. If so:

1. You'll be given a script snippet
2. Add it to your `src/app/layout.tsx` in the `<head>` section
3. It will look something like:
```javascript
<script>
  (function(c,a){if(!a.__SV){/* Mixpanel heatmap code */}})(document, window.mixpanel||[]);
</script>
```

**Note**: With our current setup, this may not be necessary as we already have Mixpanel initialized.

### Step 6: Wait for Data Collection
- Heatmaps need time to collect data
- Typically 24-48 hours for meaningful insights
- More traffic = faster insights

### Step 7: View Your Heatmaps
1. Go to **Reports** → **Heatmaps** in Mixpanel dashboard
2. Select the page you want to analyze
3. Choose heatmap type:
   - **Click heatmap**: Where users click
   - **Move heatmap**: Where users hover
   - **Scroll heatmap**: How far users scroll

## Heatmap Types Available

### Click Heatmap
- Shows where users click most
- Red = high clicks, Blue = low clicks
- Helps identify popular elements

### Move/Hover Heatmap
- Tracks mouse movement patterns
- Shows areas of interest
- Indicates user attention

### Scroll Heatmap
- Shows how far users scroll
- Identifies content visibility
- Helps with page layout decisions

## Troubleshooting

### Error: "We couldn't find an eligible replay backdrop"

This error means you need to enable **Session Replay** first. Heatmaps are built on top of Session Replay.

**Solution**:

1. **Enable Session Replay**:
   - Go to **Applications** → **Session Replay** in Mixpanel
   - Click **"Enable Session Replay"**
   - Or go to **Project Settings** → **Session Replay** → Toggle ON

2. **Add Session Replay Code** (Required):
   You need to update your Mixpanel initialization to enable session replay.

   **Update `src/lib/mixpanel.ts`** to include:
   ```typescript
   mixpanel.init('d04b9120d4c0d50d1ca920e0a0608964', {
     debug: process.env.NODE_ENV === 'development',
     track_pageview: true,
     persistence: 'localStorage',
     record_sessions_percent: 100,  // Record 100% of sessions
     record_block_selector: '.sensitive-data',  // Optional: block sensitive elements
   });
   ```

3. **Visit Your Website**:
   - After enabling, visit your live site: `https://madaravet.com/`
   - Click around for a minute
   - Wait 5-10 minutes for data to process

4. **Try Creating Heatmap Again**:
   - Go back to Mixpanel → Heatmaps
   - Try creating a heatmap again
   - You should now see session replays available

### If heatmaps don't appear:
1. **Check your plan**: Heatmaps require Growth/Enterprise
2. **Verify tracking**: Go to **Events** and confirm page views are being tracked
3. **Wait longer**: Data needs 24-48 hours to accumulate
4. **Check URL**: Ensure the URL in Mixpanel matches your live site exactly

### If you see "Additional setup required":
1. Mixpanel will provide specific instructions
2. May need to add additional tracking code
3. Contact Mixpanel support if needed

## URL Configuration in Mixpanel

When setting up heatmaps, use these exact URLs:

| Page | URL |
|------|-----|
| Homepage (Bulgarian) | `https://madaravet.com/` |
| Homepage (English) | `https://madaravet.com/en/` |
| About (Bulgarian) | `https://madaravet.com/za-nas/` |
| About (English) | `https://madaravet.com/en/about/` |
| Services (Bulgarian) | `https://madaravet.com/uslugi/` |
| Services (English) | `https://madaravet.com/en/services/` |
| Contact (Bulgarian) | `https://madaravet.com/kontakti/` |
| Contact (English) | `https://madaravet.com/en/contact/` |
| Blog | `https://madaravet.com/blog/` |

**Tip**: Use wildcards for dynamic routes:
- All blog posts: `https://madaravet.com/blog/*`
- All English pages: `https://madaravet.com/en/*`

## Custom Heatmap vs Mixpanel Heatmap

You now have **both** options:

### Custom Heatmap (Free)
- Already working on your site
- Toggle with `Ctrl+Shift+H`
- Stores data locally
- Sends raw data to Mixpanel

### Mixpanel Native Heatmap (Paid)
- Requires Growth/Enterprise plan
- Visual heatmaps in dashboard
- Advanced filtering and segmentation
- Historical data analysis
- Team collaboration features

## Next Steps

1. **Check your Mixpanel plan** - Upgrade if necessary
2. **Log in to Mixpanel dashboard** - Navigate to Heatmaps
3. **Configure your pages** - Add the URLs listed above
4. **Wait for data** - Give it 24-48 hours
5. **Analyze insights** - Review heatmaps and optimize

## Support

If you need help:
- Mixpanel Documentation: https://docs.mixpanel.com/docs/session-replay/heatmaps
- Mixpanel Support: https://mixpanel.com/get-support
- Your Project Token: `d04b9120d4c0d50d1ca920e0a0608964`

## Additional Resources

- [Mixpanel Pricing](https://mixpanel.com/pricing)
- [Heatmap Best Practices](https://mixpanel.com/blog/heatmap-best-practices)
- [Understanding User Behavior](https://mixpanel.com/topics/what-is-a-heatmap)
