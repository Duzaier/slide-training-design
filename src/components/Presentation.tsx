import React, { useState, useEffect, useRef, useCallback } from 'react';
import { presentationSlides } from '../data/presentationData';
import { SlideRenderer } from './SlideRenderer';
import { SlideNavigation } from './SlideNavigation';
import { ThumbnailsDrawer } from './ThumbnailsDrawer';
import { PresenterNotes } from './PresenterNotes';
import { 
  HelpCircle, 
  MonitorPlay, 
  Layout, 
  FolderKanban,
  Layers
} from 'lucide-react';
import gsap from 'gsap';

export const Presentation: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isCleanPresentationMode, setIsCleanPresentationMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideStageRef = useRef<HTMLDivElement>(null);
  const activeSlideItemRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const totalSlides = presentationSlides.length;
  const currentSlide = presentationSlides[currentSlideIndex];

  // Auto scroll active slide into view in sidebar menu
  useEffect(() => {
    if (activeSlideItemRef.current) {
      activeSlideItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentSlideIndex]);

  // Smooth slide change with GSAP animation
  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= totalSlides || newIndex === currentSlideIndex) return;

    const direction = newIndex > currentSlideIndex ? 1 : -1;

    if (slideStageRef.current) {
      gsap.fromTo(
        slideStageRef.current,
        {
          opacity: 0,
          x: direction * 35,
          scale: 0.985
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.38,
          ease: "power2.out"
        }
      );
    }

    setCurrentSlideIndex(newIndex);
  }, [currentSlideIndex, totalSlides]);

  const handleNext = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, totalSlides, goToSlide]);

  const handlePrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }, [currentSlideIndex, goToSlide]);

  const handleFirst = useCallback(() => {
    goToSlide(0);
  }, [goToSlide]);

  const handleLast = useCallback(() => {
    goToSlide(totalSlides - 1);
  }, [totalSlides, goToSlide]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsCleanPresentationMode(true);
      }).catch(err => {
        console.warn("Fullscreen error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      if (active) {
        setIsCleanPresentationMode(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement;
      const isInputFocused = activeEl && ['INPUT', 'TEXTAREA'].includes(activeEl.tagName);

      if (e.key === 'Escape') {
        if (isInputFocused) activeEl.blur();
        if (isThumbnailsOpen) { setIsThumbnailsOpen(false); return; }
        if (isNotesOpen) { setIsNotesOpen(false); return; }
        if (showKeyboardHelp) { setShowKeyboardHelp(false); return; }
        if (isCleanPresentationMode) { setIsCleanPresentationMode(false); return; }
        return;
      }

      if (isInputFocused) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ': // Space
        case 'PageDown':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          handlePrev();
          break;
        case 'Home':
          e.preventDefault();
          handleFirst();
          break;
        case 'End':
          e.preventDefault();
          handleLast();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setIsCleanPresentationMode(prev => !prev);
          break;
        case 's':
        case 'S':
          e.preventDefault();
          setIsSidebarOpen(prev => !prev);
          break;
        case 't':
        case 'T':
          e.preventDefault();
          setIsThumbnailsOpen(prev => !prev);
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setIsNotesOpen(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFirst, handleLast, isThumbnailsOpen, isNotesOpen, showKeyboardHelp, isCleanPresentationMode]);

  // Touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };



  const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;

  return (
    <div 
      ref={containerRef}
      className={`website-shell-root galaxy-family-${(currentSlideIndex % 6) + 1}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Progress Track */}
      <div className="presentation-progress-track">
        <div 
          className="presentation-progress-fill" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Dynamic Multi-layered Cosmic Galaxy Background System (Ref A, Ref B, Ref C) */}
      <div className="galaxy-stage-canvas" aria-hidden="true">
        <div className="cosmic-layer cosmic-deep-void" />
        <div className="cosmic-layer cosmic-flowing-band band-primary" />
        <div className="cosmic-layer cosmic-flowing-band band-secondary" />
        <div className="cosmic-layer cosmic-flowing-band band-focal-core" />
        <div className="cosmic-layer cosmic-starfield" />
        <div className="cosmic-layer cosmic-starlight-flares" />
        <div className="cosmic-layer cosmic-text-safe-vignette" />
      </div>

      {/* Presentation Website Shell Header */}
      <header className={`shell-header ${isCleanPresentationMode ? 'clean-mode' : ''}`}>
        <div className="shell-header-left" />

        <div className="shell-header-center">
          <div className="shell-section-badge">
            <Layers size={13} />
            <span>MỤC: {currentSlide.categoryLabel}</span>
          </div>
        </div>

        <div className="shell-header-actions">
          {/* Mode Switcher: Website View vs Clean Presentation Mode */}
          <button
            onClick={() => setIsCleanPresentationMode(prev => !prev)}
            className={`shell-btn ${isCleanPresentationMode ? 'active' : ''}`}
            title="Chuyển đổi giữa Chế độ Website và Chế độ Trình Chiếu (P)"
          >
            {isCleanPresentationMode ? <Layout size={14} /> : <MonitorPlay size={14} />}
            <span>{isCleanPresentationMode ? 'Website View' : 'Presentation Mode'}</span>
          </button>

          <button 
            className="shell-btn"
            onClick={() => setShowKeyboardHelp(true)}
            title="Trợ giúp phím tắt"
          >
            <HelpCircle size={14} />
            <span>Phím tắt</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body: Sidebar + Stage */}
      <div className={`shell-body ${isCleanPresentationMode ? 'clean-mode' : ''}`}>
        {/* Left Section Navigation Sidebar (Shown in Website View Mode) */}
        {!isCleanPresentationMode && isSidebarOpen && (
          <aside className="shell-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title">DANH SÁCH BÀI GIẢNG ({totalSlides} SLIDES)</span>
              <FolderKanban size={15} color="#94a3b8" />
            </div>

            <div className="sidebar-scroll-list">
              {presentationSlides.map((s, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <div
                    key={s.id}
                    ref={isActive ? activeSlideItemRef : null}
                    className={`sidebar-slide-item ${isActive ? 'active' : ''}`}
                    onClick={() => goToSlide(idx)}
                  >
                    <span className="sidebar-slide-num">{s.slideNumber}</span>
                    <div className="sidebar-slide-text">
                      <div className="sidebar-slide-name">{s.title.replace(/\n/g, ' ')}</div>
                      <div className="sidebar-slide-cat">{s.categoryLabel}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center Presentation Stage */}
        <main className={`shell-stage ${isCleanPresentationMode ? 'clean-mode' : ''}`}>
          <div ref={slideStageRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlideRenderer key={currentSlide.id} slide={currentSlide} />
          </div>
        </main>
      </div>

      {/* Discreet Floating Exit FAB when in Presentation Mode */}
      {isCleanPresentationMode && (
        <button
          onClick={() => setIsCleanPresentationMode(false)}
          className="exit-presentation-fab"
          title="Thoát chế độ trình chiếu (P hoặc Esc)"
        >
          <Layout size={14} />
          <span>Thoát Trình Chiếu (Esc)</span>
        </button>
      )}

      {/* Bottom Floating Navigation Bar */}
      <SlideNavigation
        currentSlideIndex={currentSlideIndex}
        totalSlides={totalSlides}
        onNext={handleNext}
        onPrev={handlePrev}
        onFirst={handleFirst}
        isCleanPresentationMode={isCleanPresentationMode}
      />

      {/* Full Overview Thumbnails Drawer Modal */}
      <ThumbnailsDrawer
        slides={presentationSlides}
        currentSlideIndex={currentSlideIndex}
        isOpen={isThumbnailsOpen}
        onClose={() => setIsThumbnailsOpen(false)}
        onSelectSlide={(idx) => goToSlide(idx)}
      />

      {/* Presenter Speaker Notes Drawer */}
      <PresenterNotes
        slide={currentSlide}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />

      {/* Keyboard Shortcuts Help Modal */}
      {showKeyboardHelp && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setShowKeyboardHelp(false)}
        >
          <div 
            className="glass-panel"
            style={{
              maxWidth: '540px',
              width: '100%',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>HƯỚNG DẪN ĐIỀU KHIỂN & PHÍM TẮT</h3>
              <button onClick={() => setShowKeyboardHelp(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Chuyển Slide tiếp theo:</span>
                <div><kbd className="kbd-key">→</kbd> hoặc <kbd className="kbd-key">Space</kbd> / <kbd className="kbd-key">PageDown</kbd></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quay lại Slide trước:</span>
                <div><kbd className="kbd-key">←</kbd> hoặc <kbd className="kbd-key">PageUp</kbd></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Chế độ Trình Chiếu Sạch (Presentation Mode):</span>
                <div><kbd className="kbd-key">P</kbd></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Ẩn / Hiện Mục Lục Sidebar:</span>
                <div><kbd className="kbd-key">S</kbd></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Toàn màn hình Trình Chiếu:</span>
                <div><kbd className="kbd-key">F</kbd> hoặc nút ⛶</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mở danh sách tất cả Slides:</span>
                <div><kbd className="kbd-key">T</kbd></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mở ghi chú Diễn giả:</span>
                <div><kbd className="kbd-key">N</kbd></div>
              </div>
            </div>

            <button
              onClick={() => setShowKeyboardHelp(false)}
              style={{
                marginTop: '10px',
                background: '#38b6ff',
                color: '#07090e',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Đã hiểu & Tiếp tục
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
