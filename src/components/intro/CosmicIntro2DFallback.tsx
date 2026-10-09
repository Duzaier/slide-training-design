import React, { useEffect, useRef } from 'react';
import { CosmicIntroConfig, DEFAULT_INTRO_CONFIG, getTotalIntroDuration } from './cosmicIntroConfig';

interface CosmicIntro2DFallbackProps {
  config?: CosmicIntroConfig;
  onProgress?: (progress: number, stageName: string) => void;
  onComplete?: () => void;
}

export const CosmicIntro2DFallback: React.FC<CosmicIntro2DFallbackProps> = ({
  config = DEFAULT_INTRO_CONFIG,
  onProgress,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const totalDuration = getTotalIntroDuration(config);
    const startTime = performance.now();

    // Create background stars
    const numStars = 300;
    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      r: Math.random() * 2 + 0.5,
      color: ['#ffffff', '#38b6ff', '#a855f7', '#ffb03a'][Math.floor(Math.random() * 4)]
    }));

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / totalDuration, 1.0);

      ctx.fillStyle = '#020307';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);

      let stageName = 'ENTER THE VOID';
      const tVoid = config.durationVoid;
      const tBH = tVoid + config.durationBlackHole;
      const tAbs = tBH + config.durationAbsorption;
      const tCol = tAbs + config.durationCollapse;
      const tBB = tCol + config.durationBigBang;

      if (elapsed < tVoid) {
        stageName = 'ENTER THE VOID';
      } else if (elapsed < tBH) {
        stageName = 'BLACK HOLE FORMATION';
      } else if (elapsed < tAbs) {
        stageName = 'GRAVITATIONAL ABSORPTION';
      } else if (elapsed < tCol) {
        stageName = 'ENERGY COLLAPSE';
      } else if (elapsed < tBB) {
        stageName = 'BIG BANG EXPLOSION';
      } else {
        stageName = 'GALAXY REVEAL';
      }

      if (onProgressRef.current) onProgressRef.current(progress, stageName);

      // Render 2D Cosmic Stars
      stars.forEach(s => {
        let x = s.x;
        let y = s.y;

        if (elapsed >= tVoid && elapsed < tCol) {
          const bhProgress = (elapsed - tVoid) / (tCol - tVoid);
          x *= (1.0 - bhProgress * 0.85);
          y *= (1.0 - bhProgress * 0.85);
        }

        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render 2D Black Hole & Accretion Disk
      if (elapsed >= tVoid && elapsed < tCol) {
        const pBH = Math.min((elapsed - tVoid) / config.durationBlackHole, 1.0);
        const radius = 60 * pBH;

        // Glowing Accretion Disk
        const grad = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius * 2.2);
        grad.addColorStop(0, 'rgba(56, 182, 255, 0.9)');
        grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.6)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Event Horizon (Black Center)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render 2D Big Bang Explosion Flash
      if (elapsed >= tCol && elapsed < tBB) {
        const pExp = (elapsed - tCol) / config.durationBigBang;
        const expRadius = pExp * Math.max(width, height);

        const expGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, expRadius);
        expGrad.addColorStop(0, `rgba(255, 255, 255, ${1 - pExp})`);
        expGrad.addColorStop(0.4, `rgba(56, 182, 255, ${0.8 * (1 - pExp)})`);
        expGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = expGrad;
        ctx.beginPath();
        ctx.arc(0, 0, expRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      if (progress >= 1.0) {
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};
