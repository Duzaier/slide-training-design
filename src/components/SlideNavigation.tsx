import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw
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
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlideIndex,
  totalSlides,
  onNext,
  onPrev,
  onFirst,
  isCleanPresentationMode
}) => {
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1;

  return (
    <nav className={`presentation-bottom-nav ${isCleanPresentationMode ? 'clean-mode' : ''}`}>
      {/* Left Info: Clean First Slide button */}
      <div className="nav-left-info">
        <button
          onClick={onFirst}
          title="Về slide đầu tiên (Home)"
          className="nav-home-btn"
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

      {/* Right placeholder to keep center controls perfectly balanced */}
      <div className="nav-right-spacer" />
    </nav>
  );
};
