import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Maximize,
  Minimize,
  Layout,
  MonitorPlay,
  Grid,
  HelpCircle
} from 'lucide-react';

interface SlideNavigationProps {
  currentSlideIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onFirst: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onToggleThumbnails?: () => void;
  onToggleNotes?: () => void;
  isNotesOpen?: boolean;
  isAutoPlay?: boolean;
  onToggleAutoPlay?: () => void;
  isCleanPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
  onToggleHelp?: () => void;
  isControlsVisible?: boolean;
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlideIndex,
  totalSlides,
  onNext,
  onPrev,
  onFirst,
  isFullscreen = false,
  onToggleFullscreen,
  onToggleThumbnails,
  isCleanPresentationMode = false,
  onTogglePresentationMode,
  onToggleHelp,
  isControlsVisible = true
}) => {
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1;

  // Determine visibility in clean presentation mode
  const cleanModeClass = isCleanPresentationMode 
    ? (isControlsVisible ? 'clean-mode-floating visible' : 'clean-mode-floating hidden')
    : '';

  return (
    <nav className={`presentation-bottom-nav ${cleanModeClass}`}>
      {/* Left Info: Clean First Slide button & Thumbnails */}
      <div className="nav-left-info">
        <button
          onClick={onFirst}
          title="Về slide đầu tiên (Home)"
          className="nav-home-btn"
          aria-label="Về slide đầu tiên"
        >
          <span className="nav-home-icon-wrap">
            <RotateCcw size={14} className="nav-home-icon" />
          </span>
          <span className="nav-home-label">Đầu trang</span>
        </button>

        {onToggleThumbnails && (
          <button
            onClick={onToggleThumbnails}
            title="Xem danh sách tất cả slide (G)"
            className="nav-action-pill-btn"
            aria-label="Danh sách slide"
          >
            <Grid size={14} />
            <span className="nav-btn-text">Tổng quan</span>
          </button>
        )}
      </div>

      {/* Center Controls: Prev Arrow, Slide Counter, Next Arrow */}
      <div className="nav-center-controls">
        <button 
          className="nav-arrow-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          disabled={isFirstSlide}
          aria-label="Slide trước (ArrowLeft)"
          title="Slide trước (ArrowLeft)"
          style={{ minWidth: '40px', minHeight: '40px', cursor: isFirstSlide ? 'not-allowed' : 'pointer' }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="nav-counter-display" aria-live="polite">
          <span className="nav-counter-current">
            {String(currentSlideIndex + 1).padStart(2, '0')}
          </span>
          <span className="nav-counter-total">/</span>
          <span className="nav-counter-total">
            {String(totalSlides).padStart(2, '0')}
          </span>
        </div>

        <button 
          className="nav-arrow-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          disabled={isLastSlide}
          aria-label="Slide kế tiếp (ArrowRight hoặc Space)"
          title="Slide kế tiếp (ArrowRight hoặc Space)"
          style={{ minWidth: '40px', minHeight: '40px', cursor: isLastSlide ? 'not-allowed' : 'pointer' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Right Action Tools: Fullscreen, Mode, Help */}
      <div className="nav-right-actions">
        {onTogglePresentationMode && (
          <button
            onClick={onTogglePresentationMode}
            title={isCleanPresentationMode ? "Chuyển sang Chế độ Website (P)" : "Chuyển sang Chế độ Trình chiếu (P)"}
            className="nav-action-pill-btn"
            aria-label="Chuyển chế độ xem"
          >
            {isCleanPresentationMode ? <Layout size={14} /> : <MonitorPlay size={14} />}
            <span className="nav-btn-text">{isCleanPresentationMode ? 'Website' : 'Slide'}</span>
          </button>
        )}

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Thoát toàn màn hình (F / Esc)" : "Chiếu toàn màn hình (F)"}
            className="nav-action-pill-btn highlight-btn"
            aria-label="Toàn màn hình máy chiếu"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            <span className="nav-btn-text">{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        )}

        {onToggleHelp && (
          <button
            onClick={onToggleHelp}
            title="Trợ giúp phím tắt máy chiếu (?)"
            className="nav-action-pill-btn icon-only"
            aria-label="Trợ giúp phím tắt"
          >
            <HelpCircle size={14} />
          </button>
        )}
      </div>
    </nav>
  );
};
