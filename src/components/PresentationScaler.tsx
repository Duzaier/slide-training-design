import React, { useRef, useState, useEffect, useCallback } from 'react';

interface PresentationScalerProps {
  children: React.ReactNode;
  baseWidth?: number;
  baseHeight?: number;
  onScaleChange?: (scale: number) => void;
}

/**
 * PresentationScaler: Universal Responsive Presentation Viewport Engine
 * 
 * Auto-scales slide canvas to fit ANY screen or projector resolution (1024x768, 1280x800,
 * 1366x768, 1080p, 4K, 4:3, 16:10, 16:9, Ultrawide, or windowed mode) while preserving
 * exact typographic proportions, layout geometry, 3D studios, and zero element clipping.
 */
export const PresentationScaler: React.FC<PresentationScalerProps> = ({
  children,
  baseWidth = 1920,
  baseHeight = 1080,
  onScaleChange
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  const calculateScale = useCallback(() => {
    if (!viewportRef.current) return;
    const { clientWidth, clientHeight } = viewportRef.current;
    if (clientWidth <= 0 || clientHeight <= 0) return;

    // Calculate maximum uniform scale factor to fit inside viewport
    const scaleX = clientWidth / baseWidth;
    const scaleY = clientHeight / baseHeight;
    const targetScale = Math.min(scaleX, scaleY);

    setScale(targetScale);
    setIsCalculated(true);

    if (onScaleChange) {
      onScaleChange(targetScale);
    }
  }, [baseWidth, baseHeight, onScaleChange]);

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      calculateScale();
    });
  }, [calculateScale]);

  useEffect(() => {
    calculateScale();

    // ResizeObserver tracks dynamic changes (sidebar collapse, window resize, extended monitor move)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && viewportRef.current) {
      ro = new ResizeObserver(() => {
        scheduleUpdate();
      });
      ro.observe(viewportRef.current);
    }

    const handleWindowResize = () => scheduleUpdate();

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('orientationchange', handleWindowResize);
    document.addEventListener('fullscreenchange', handleWindowResize);

    return () => {
      if (ro) ro.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleWindowResize);
      document.removeEventListener('fullscreenchange', handleWindowResize);
    };
  }, [calculateScale, scheduleUpdate]);

  return (
    <div ref={viewportRef} className="presentation-scaler-viewport">
      <div
        className="presentation-scaler-canvas"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale}) translateZ(0)`,
          opacity: isCalculated ? 1 : 0.01,
          transition: isCalculated ? 'transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};
