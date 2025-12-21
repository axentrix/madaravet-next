# Heatmap Feature

A click heatmap has been implemented on the homepage to visualize user interactions and behavior patterns.

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

1. **Navigate to the homepage** and start clicking around
2. **Press `Ctrl+Shift+H`** to toggle the heatmap visualization
3. **View the heatmap** to see where users are clicking most
4. **Clear data** by clicking the "Clear Data" button in the info panel

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
