'use client';

import { useEffect, useRef, useState } from 'react';
import { analytics } from '@/lib/analytics';

interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

interface HeatmapProps {
  enabled?: boolean;
}

export default function Heatmap({ enabled = true }: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clicks, setClicks] = useState<HeatmapPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Load saved clicks from localStorage
    const savedClicks = localStorage.getItem('heatmap-clicks');
    if (savedClicks) {
      try {
        setClicks(JSON.parse(savedClicks));
      } catch (e) {
        console.error('Failed to load heatmap data', e);
      }
    }

    // Track clicks
    const handleClick = (e: MouseEvent) => {
      const point: HeatmapPoint = {
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
        value: 1,
      };

      setClicks((prev) => {
        const newClicks = [...prev, point];
        // Keep only last 500 clicks to avoid memory issues
        const limitedClicks = newClicks.slice(-500);
        localStorage.setItem('heatmap-clicks', JSON.stringify(limitedClicks));
        return limitedClicks;
      });

      // Track click in Mixpanel
      analytics.trackEvent('Heatmap Click', {
        x: point.x,
        y: point.y,
        page: window.location.pathname,
      });
    };

    document.addEventListener('click', handleClick);

    // Keyboard shortcut to toggle heatmap visibility (Ctrl+Shift+H)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        setIsVisible((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [enabled]);

  useEffect(() => {
    if (!isVisible || !canvasRef.current || clicks.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match document
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw heatmap points
    clicks.forEach((point) => {
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 30);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(point.x - 30, point.y - 30, 60, 60);
    });
  }, [clicks, isVisible]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          zIndex: 10000,
          fontSize: '14px',
          fontFamily: 'monospace',
        }}
      >
        <div>🔥 Heatmap Active</div>
        <div style={{ fontSize: '12px', marginTop: '5px' }}>
          Clicks: {clicks.length}
        </div>
        <div style={{ fontSize: '11px', marginTop: '5px', opacity: 0.7 }}>
          Press Ctrl+Shift+H to toggle
        </div>
        <button
          onClick={() => {
            setClicks([]);
            localStorage.removeItem('heatmap-clicks');
          }}
          style={{
            marginTop: '8px',
            padding: '4px 8px',
            background: '#ff4444',
            border: 'none',
            borderRadius: '3px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          Clear Data
        </button>
      </div>
    </>
  );
}
