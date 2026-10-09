import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FastForward, Sparkles, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';
import { CosmicIntroCanvas } from './CosmicIntroCanvas';
import { CosmicIntro2DFallback } from './CosmicIntro2DFallback';
import { CosmicIntroConfig, DEFAULT_INTRO_CONFIG, getTotalIntroDuration } from './cosmicIntroConfig';

interface CosmicIntroOverlayProps {
  config?: CosmicIntroConfig;
  onComplete: () => void;
  forceReplay?: boolean;
}

export const CosmicIntroOverlay: React.FC<CosmicIntroOverlayProps> = ({
  config = DEFAULT_INTRO_CONFIG,
  onComplete,
  forceReplay = false
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const rootOverlayRef = useRef<HTMLDivElement>(null);
  const stageTextRef = useRef<HTMLSpanElement>(null);
  const progressPercentRef = useRef<HTMLSpanElement>(null);
  const isEndingRef = useRef<boolean>(false);

  useEffect(() => {
    if (forceReplay) {
      resetCosmicIntroSeen(config.sessionStorageKey);
    }
  }, [forceReplay, config.sessionStorageKey]);

  // Smooth completion handler with cinematic cross-fade
  const finishIntroWithFade = useCallback(() => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    try {
      sessionStorage.setItem(config.sessionStorageKey, 'true');
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }

    if (rootOverlayRef.current) {
      rootOverlayRef.current.style.pointerEvents = 'none';
      gsap.to(rootOverlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          onComplete();
        }
      });
    } else {
      onComplete();
    }
  }, [config.sessionStorageKey, onComplete]);

  // Skip handler
  const handleSkip = useCallback(() => {
    finishIntroWithFade();
  }, [finishIntroWithFade]);

  // Global Watchdog Safety Timer (Prevents any stuck percentage or infinite freeze)
  useEffect(() => {
    const maxDurationMs = (getTotalIntroDuration(config) + 2.5) * 1000;
    const watchdogTimer = setTimeout(() => {
      console.warn('Cosmic Intro Watchdog Triggered: Auto completing intro to prevent freeze.');
      handleSkip();
    }, maxDurationMs);

    return () => clearTimeout(watchdogTimer);
  }, [config, handleSkip]);

  // Keyboard controls listener (Esc to skip, with 1.2s guard to prevent accidental skip from Start button)
  useEffect(() => {
    const mountTimestamp = Date.now();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (Date.now() - mountTimestamp < 1200) return;
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Progress update callback - zero React re-renders for max 60 FPS fluidity
  const handleProgress = useCallback((progress: number, stageName: string) => {
    if (stageTextRef.current && stageTextRef.current.textContent !== stageName) {
      stageTextRef.current.textContent = stageName;
    }
    if (progressPercentRef.current) {
      progressPercentRef.current.textContent = `${Math.round(progress * 100)}%`;
    }
  }, []);

  // Completion callback
  const handleCanvasComplete = useCallback(() => {
    finishIntroWithFade();
  }, [finishIntroWithFade]);

  // Error fallback callback
  const handleError = useCallback((err: any) => {
    console.warn('Cosmic Intro WebGL Error -> Switching to 2D Fallback:', err);
    setHasError(true);
  }, []);

  return (
    <div
      ref={rootOverlayRef}
      className="cosmic-intro-overlay-root"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: '#020307',
        pointerEvents: 'auto'
      }}
    >
      {/* 1. Fullscreen Background Canvas Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        {!hasError ? (
          <CosmicIntroCanvas
            config={config}
            onProgress={handleProgress}
            onComplete={handleCanvasComplete}
            onError={handleError}
          />
        ) : (
          <CosmicIntro2DFallback
            config={config}
            onProgress={handleProgress}
            onComplete={handleCanvasComplete}
          />
        )}
      </div>

      {/* 2. Foreground UI Controls Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px 40px',
          boxSizing: 'border-box',
          pointerEvents: 'none'
        }}
      >
        {/* Top Header Controls: Stage Badge & Audio Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            pointerEvents: 'auto'
          }}
        >
        {/* Stage Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(8, 14, 28, 0.75)',
            border: '1px solid rgba(56, 182, 255, 0.3)',
            padding: '8px 20px',
            borderRadius: '999px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
            letterSpacing: '0.12em',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#38b6ff',
            textTransform: 'uppercase'
          }}
        >
          <Sparkles size={14} color="#ffb03a" />
          <span ref={stageTextRef}>INITIALIZING COSMOS...</span>
          <span ref={progressPercentRef} style={{ color: 'rgba(255,255,255,0.4)', paddingLeft: '6px' }}>
            0%
          </span>
        </div>

        {/* Audio Mute Toggle */}
        {config.enableAudio && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(12px)'
            }}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}
      </div>

      {/* Bottom Footer Action: Skip Intro Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={handleSkip}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(12, 18, 36, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '999px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.88rem',
            letterSpacing: '0.05em',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 35px rgba(0, 0, 0, 0.75), 0 0 20px rgba(56, 182, 255, 0.25)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(56, 182, 255, 0.6)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
            (e.currentTarget as HTMLElement).style.transform = 'none';
          }}
          title="Bỏ qua phim giới thiệu Vũ Trụ Big Bang (Esc hoặc Space)"
        >
          <span>Bỏ qua Intro</span>
          <FastForward size={16} color="#38b6ff" />
          <span style={{ opacity: 0.5, fontSize: '0.75rem', fontFamily: 'monospace' }}>(Esc)</span>
        </button>
      </div>
    </div>
  </div>
);
};

// Helper functions for Session Replay Management
export const hasSeenCosmicIntro = (key: string = DEFAULT_INTRO_CONFIG.sessionStorageKey): boolean => {
  try {
    return sessionStorage.getItem(key) === 'true';
  } catch (e) {
    return false;
  }
};

export const resetCosmicIntroSeen = (key: string = DEFAULT_INTRO_CONFIG.sessionStorageKey): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.warn('SessionStorage error:', e);
  }
};
