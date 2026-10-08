import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Grid, 
  FileText, 
  Play, 
  Pause,
  RotateCcw
} from 'lucide-react';

interface SlideNavigationProps {
  currentSlideIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onFirst: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleThumbnails: () => void;
  onToggleNotes: () => void;
  isNotesOpen: boolean;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlideIndex,
  totalSlides,
  onNext,
  onPrev,
  onFirst,
  isFullscreen,
  onToggleFullscreen,
  onToggleThumbnails,
  onToggleNotes,
  isNotesOpen,
  isAutoPlay,
  onToggleAutoPlay
}) => {
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1;

  return (
    <nav className="presentation-bottom-nav">
      {/* Left Info & Keyboard hint */}
      <div className="nav-left-info">
        <div className="keyboard-hints-pill">
          <kbd className="kbd-key">←</kbd>
          <kbd className="kbd-key">→</kbd>
          <span>Điều khiển Slide</span>
        </div>

        <button
          onClick={onFirst}
          title="Về slide đầu tiên (Home)"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
            padding: '6px 10px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RotateCcw size={13} /> Đầu trang
        </button>
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

      {/* Right Action Tools: Autoplay, Thumbnails Drawer, Presenter Notes, Fullscreen */}
      <div className="nav-right-actions">
        <button
          onClick={onToggleAutoPlay}
          className={`top-control-btn ${isAutoPlay ? 'active' : ''}`}
          title={isAutoPlay ? "Tạm dừng tự động chạy" : "Bật tự động chuyển slide (5s)"}
        >
          {isAutoPlay ? <Pause size={14} /> : <Play size={14} />}
          <span>{isAutoPlay ? 'Auto ON' : 'Auto'}</span>
        </button>

        <button
          onClick={onToggleNotes}
          className={`top-control-btn ${isNotesOpen ? 'active' : ''}`}
          title="Mở ghi chú người trình bày (Notes)"
        >
          <FileText size={14} />
          <span>Ghi chú</span>
        </button>

        <button
          onClick={onToggleThumbnails}
          className="top-control-btn"
          title="Danh sách tất cả slide (T)"
        >
          <Grid size={14} />
          <span>Slides</span>
        </button>

        <button
          onClick={onToggleFullscreen}
          className="top-control-btn"
          title={isFullscreen ? "Thoát toàn màn hình (Esc)" : "Toàn màn hình trình chiếu (F)"}
          style={{ background: isFullscreen ? 'rgba(56,182,255,0.2)' : undefined }}
        >
          {isFullscreen ? <Minimize2 size={14} color="#38b6ff" /> : <Maximize2 size={14} />}
          <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
        </button>
      </div>
    </nav>
  );
};
