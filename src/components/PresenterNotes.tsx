import React from 'react';
import { SlideData } from '../types/presentation';
import { FileText, X, Lightbulb, Keyboard } from 'lucide-react';

interface PresenterNotesProps {
  slide: SlideData;
  isOpen: boolean;
  onClose: () => void;
}

export const PresenterNotes: React.FC<PresenterNotesProps> = ({
  slide,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '32px',
      width: '380px',
      maxHeight: '460px',
      background: 'rgba(11, 16, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(56, 182, 255, 0.3)',
      borderRadius: '16px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(56,182,255,0.15)',
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideUp 0.25s ease-out'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="#38b6ff" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>GHI CHÚ DIỄN GIẢ (SPEAKER NOTES)</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#38b6ff', fontWeight: 700, textTransform: 'uppercase' }}>
            Slide {slide.slideNumber} — {slide.categoryLabel}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            {slide.title}
          </div>
        </div>

        {slide.notes && (
          <div style={{
            background: 'rgba(56,182,255,0.08)',
            border: '1px solid rgba(56,182,255,0.15)',
            padding: '12px',
            borderRadius: '10px',
            display: 'flex',
            gap: '10px'
          }}>
            <Lightbulb size={18} color="#38b6ff" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.45' }}>
              {slide.notes}
            </p>
          </div>
        )}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            <Keyboard size={14} /> PHÍM TẮT ĐIỀU KHIỂN:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.72rem', color: '#cbd5e1' }}>
            <div><kbd className="kbd-key">→</kbd> / <kbd className="kbd-key">Space</kbd>: Tiếp theo</div>
            <div><kbd className="kbd-key">←</kbd>: Lùi lại</div>
            <div><kbd className="kbd-key">Home</kbd>: Về đầu</div>
            <div><kbd className="kbd-key">End</kbd>: Đến cuối</div>
            <div><kbd className="kbd-key">F</kbd>: Toàn màn hình</div>
            <div><kbd className="kbd-key">T</kbd>: Xem tất cả</div>
          </div>
        </div>
      </div>
    </div>
  );
};
