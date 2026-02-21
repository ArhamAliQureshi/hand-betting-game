import React, { Suspense, useEffect, useState } from 'react';
import './BackgroundLayer.css';

// Lazy load the heavy Three.js component
const CasinoBackground3D = React.lazy(() => import('./CasinoBackground3D'));

export const BackgroundLayer: React.FC = () => {
  const [shouldRender3D, setShouldRender3D] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check feature flag
    if (import.meta.env.VITE_ENABLE_3D_BG === 'false') {
      setShouldRender3D(false);
      return;
    }

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Simple WebGL availability check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, falling back to CSS background.');
        setShouldRender3D(false);
      }
    } catch (e) {
      console.warn('Error checking WebGL, falling back to CSS background.', e);
      setShouldRender3D(false);
    }

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  return (
    <div className="casino-background-wrapper" data-testid="casino-bg-wrapper">
      {shouldRender3D && !reducedMotion ? (
        <Suspense fallback={<FallbackBackground animated={true} />}>
          <CasinoBackground3D />
        </Suspense>
      ) : (
        <FallbackBackground animated={!reducedMotion} />
      )}
      <div className="casino-vignette-overlay" />
    </div>
  );
};

const FallbackBackground: React.FC<{ animated: boolean }> = ({ animated }) => (
  <div 
    className={`casino-fallback-bg ${animated ? 'casino-fallback-animated' : ''}`} 
    data-testid="casino-fallback-bg"
  />
);

export default BackgroundLayer;
