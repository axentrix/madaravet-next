# Heatmap Feature

A **custom click heatmap** has been implemented on the homepage to visualize user interactions and behavior patterns.

## Important Note

This is a **custom-built heatmap**, not Mixpanel's built-in heatmap feature. It works independently and requires no additional configuration in Mixpanel. The heatmap is already active and ready to use!

## No URL Configuration Needed

Unlike Mixpanel's paid heatmap feature, this custom heatmap:
- ✅ Works immediately on your website
- ✅ Is completely free
- ✅ Requires no dashboard configuration
- ✅ Tracks clicks automatically on the homepage
- ✅ Sends data to Mixpanel for analytics

## Features

### Automatic Click Tracking
- **Records every click** on the homepage
- **Stores data locally** in browser's localStorage (last 500 clicks)
- **Integrates with Mixpanel** to send click data for analytics

### Visual Heatmap Overlay
- **Toggle with keyboard shortcut**: Press `Ctrl+Shift+H` to show/hide the heatmap
- **Color-coded visualization**:
  - Red center = high click intensity
  - Yellow fade = medium intensity
  - Transparent = low intensity

### Real-time Statistics
When the heatmap is visible, you'll see:
- Total number of clicks recorded
- Clear data button to reset the heatmap
- Keyboard shortcut reminder

## How to Use

### Quick Start
1. **Visit your homepage**: `https://madaravet.com/`
2. **Click around** on various elements (buttons, images, links, etc.)
3. **Press `Ctrl+Shift+H`** to toggle the heatmap visualization
4. **View red/yellow spots** showing where clicks occurred
5. **Clear data** by clicking the "Clear Data" button in the info panel

### Where It Works
- Currently enabled only on the **homepage** (`/` route)
- Automatically tracks all clicks
- Data persists between page visits

## Data Storage

- Click data is stored in **localStorage** under the key `heatmap-clicks`
- Maximum of **500 clicks** are retained (older clicks are automatically removed)
- Data persists between page refreshes
- Each click includes X/Y coordinates and page URL

## Mixpanel Integration

Every click is automatically tracked in Mixpanel with:
- **Event name**: "Heatmap Click"
- **Properties**:
  - `x`: X coordinate
  - `y`: Y coordinate
  - `page`: Current page path

### Viewing Data in Mixpanel
1. Log in to your Mixpanel dashboard: https://mixpanel.com
2. Go to **Events** and search for "Heatmap Click"
3. View click coordinates and patterns
4. Create custom reports based on click data

**Note**: This is separate from Mixpanel's native heatmap feature (which requires a paid plan). Our custom heatmap sends raw click data to Mixpanel for you to analyze.

## Configuration

The heatmap is currently enabled only on the homepage. To enable it on other pages:

```typescript
import Heatmap from '@/components/Heatmap';

export default function YourPage() {
  return (
    <div>
      {/* Your content */}
      <Heatmap enabled={true} />
    </div>
  );
}
```

To disable the heatmap:
```typescript
<Heatmap enabled={false} />
```

## Files

- **Component**: `src/components/Heatmap.tsx`
- **Integration**: `src/app/page.tsx`

## Privacy Note

All heatmap data is stored locally in the user's browser. Click coordinates are also sent to Mixpanel for aggregate analysis. No personally identifiable information is collected.

## Tips

- Use the heatmap to identify:
  - Most clicked UI elements
  - Dead zones (areas with no clicks)
  - Unexpected interaction patterns
  - Popular navigation paths
  
- Combine with Mixpanel analytics for deeper insights
- Clear data periodically to track fresh user behavior
