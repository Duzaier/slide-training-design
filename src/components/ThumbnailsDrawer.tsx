import React, { useState } from 'react';
import { SlideData } from '../types/presentation';
import { X, Search, Grid, Eye } from 'lucide-react';

interface ThumbnailsDrawerProps {
  slides: SlideData[];
  currentSlideIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (index: number) => void;
}

export const ThumbnailsDrawer: React.FC<ThumbnailsDrawerProps> = ({
  slides,
  currentSlideIndex,
  isOpen,
  onClose,
  onSelectSlide
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSlides = slides.filter(slide => 
    slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slide.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slide.primaryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slide.slideNumber.includes(searchQuery)
  );

  return (
    <div className="thumbnails-overlay" onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="thumbnails-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(56,182,255,0.15)', padding: '8px', borderRadius: '10px' }}>
              <Grid size={22} color="#38b6ff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>TẤT CẢ CÁC SLIDE (SLIDE DECK OVERVIEW)</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{slides.length} Slides chuẩn hóa từ tài liệu thiết kế Figma</p>
            </div>
          </div>

          {/* Search bar & Close button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm slide theo tiêu đề, số..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '999px',
                  padding: '8px 16px 8px 36px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '260px'
                }}
              />
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Thumbnails Grid */}
        <div className="thumbnails-grid">
          {filteredSlides.map((slide) => {
            const originalIndex = slides.findIndex(s => s.id === slide.id);
            const isActive = originalIndex === currentSlideIndex;

            return (
              <div
                key={slide.id}
                className={`thumbnail-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectSlide(originalIndex);
                  onClose();
                }}
              >
                <div className="thumbnail-preview-box">
                  {slide.images[0]?.url ? (
                    <img src={slide.images[0].url} alt={slide.title} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <Eye size={24} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 800, color: '#38b6ff' }}>
                    SLIDE {slide.slideNumber}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                    {slide.categoryLabel}
                  </span>
                </div>

                <div className="thumbnail-title" title={slide.title}>
                  {slide.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
