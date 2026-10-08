import React, { useState } from 'react';
import { Maximize2, Layers, Compass, Palette } from 'lucide-react';

interface ConceptBorrowingStageProps {
  onImageZoom?: (url: string) => void;
}

type ViewMode = 'part1' | 'part2' | 'all';

export const ConceptBorrowingStage: React.FC<ConceptBorrowingStageProps> = ({ onImageZoom }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('part1');

  const handleZoom = (url: string) => {
    if (onImageZoom) {
      onImageZoom(url);
    }
  };

  return (
    <div className="layout-concept-borrowing-stage">
      {/* Ambient Cosmic Background */}
      <div className="galaxy-backdrop-layer">
        <div 
          className="galaxy-nebula-glow galaxy-glow-top-right" 
          style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.22) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 70%)' }} 
        />
        <div 
          className="galaxy-nebula-glow galaxy-glow-bottom-left" 
          style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(56, 182, 255, 0.1) 50%, transparent 70%)' }} 
        />
        <div className="galaxy-stars-particle-mesh" />
      </div>

      {/* Floating 3D Cosmic Decors */}
      <div className="floating-decor-item decor-chatgpt" style={{ top: '4%', right: '4%', width: '70px', opacity: 0.7 }}>
        <img src="/assets/decor_chatgpt_3d.png" alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
      </div>
      <div className="floating-decor-item decor-photoshop" style={{ bottom: '8%', left: '3%', width: '75px', opacity: 0.75 }}>
        <img src="/assets/decor_photoshop_3d.png" alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
      </div>
      <div className="floating-decor-item decor-moon" style={{ top: '5%', left: '3.5%', width: '80px', opacity: 0.65 }}>
        <img src="/assets/decor_moon_planet.png" alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
      </div>

      <div className="concept-borrowing-container">
        {/* LEFT COLUMN: Title & Concept Navigation */}
        <section className="borrowing-info-col">
          <div className="borrowing-header-group">
            <span className="borrowing-category-badge">CÁCH KẾT HỢP KIẾN THỨC</span>
            <h1 className="borrowing-main-title">Mượn ý tưởng</h1>
            <p className="borrowing-subtitle">
              Phương pháp liên kết, vay mượn góc nhìn bố cục và chất liệu Galaxy từ các tác phẩm tham chiếu để sáng tạo nên ấn phẩm Key Visual thương mại.
            </p>
          </div>

          {/* Interactive Flow Switcher */}
          <div className="borrowing-tabs-panel">
            <span className="borrowing-tabs-title">GÓC ĐỘ MƯỢN Ý TƯỞNG:</span>
            <div className="borrowing-tab-buttons">
              <button
                className={`borrowing-tab-btn ${viewMode === 'part1' ? 'active' : ''}`}
                onClick={() => setViewMode('part1')}
              >
                <Compass size={16} />
                <span>1. Bố cục & Dáng (2 ảnh)</span>
              </button>

              <button
                className={`borrowing-tab-btn ${viewMode === 'part2' ? 'active' : ''}`}
                onClick={() => setViewMode('part2')}
              >
                <Palette size={16} />
                <span>2. Chất liệu & Thành phẩm (3 ảnh)</span>
              </button>

              <button
                className={`borrowing-tab-btn ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => setViewMode('all')}
              >
                <Layers size={16} />
                <span>Xem toàn cảnh (5 ảnh)</span>
              </button>
            </div>
          </div>

          {/* Quick Context Tip */}
          <div className="borrowing-context-card">
            {viewMode === 'part1' && (
              <p>
                <strong>Phần 1 • Dáng tay & Khối không gian:</strong> Tham chiếu dáng tay vươn tới cầm cầu năng lượng từ bản Sketch sang phối cảnh 3D Key Visual góc rộng màn hình holographic.
              </p>
            )}
            {viewMode === 'part2' && (
              <p>
                <strong>Phần 2 • Chất liệu Galaxy & Poster:</strong> Tổng hợp hiệu ứng tóc phát quang ánh sao và dải tinh vân Cosmic LoL để hoàn thiện poster <em>Training Design: Thời đại AI</em>.
              </p>
            )}
            {viewMode === 'all' && (
              <p>
                <strong>Toàn cảnh 5 tác phẩm:</strong> Sự kết hợp liền mạch từ Sketch sơ khởi, phối cảnh Key Visual đến bộ màu Cosmic và tác phẩm thương mại hoàn thiện.
              </p>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Visual Gallery Stage */}
        <section className="borrowing-visual-col">
          {viewMode === 'part1' && (
            <div className="borrowing-cards-grid grid-part1">
              {/* Image 1: Sketch */}
              <div 
                className="borrowing-image-card card-sketch" 
                onClick={() => handleZoom('/assets/image 37.png')}
                title="Click để phóng to Bản vẽ phác thảo"
              >
                <div className="borrowing-card-glow" />
                <div className="borrowing-card-tag">Phác thảo • Sketch Pose</div>
                <img 
                  src="/assets/image 37.png" 
                  alt="Bản vẽ phác thảo Moon Knight Sketch" 
                  className="borrowing-card-img" 
                />
                <button className="borrowing-zoom-btn" title="Phóng to ảnh">
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Image 2: PUBG Visual */}
              <div 
                className="borrowing-image-card card-pubg" 
                onClick={() => handleZoom('/assets/image 41.png')}
                title="Click để phóng to 3D Key Visual"
              >
                <div className="borrowing-card-glow" />
                <div className="borrowing-card-tag">3D Key Visual • Phối cảnh Holographic</div>
                <img 
                  src="/assets/image 41.png" 
                  alt="PUBG Key Visual 绿洲无界 万物启元" 
                  className="borrowing-card-img" 
                />
                <button className="borrowing-zoom-btn" title="Phóng to ảnh">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'part2' && (
            <div className="borrowing-cards-grid grid-part2">
              {/* Image 3: Cosmic Boy */}
              <div 
                className="borrowing-image-card card-cosmic-boy" 
                onClick={() => handleZoom('/assets/image 39.png')}
                title="Click để phóng to Nhân vật Cosmic Boy"
              >
                <div className="borrowing-card-glow" />
                <div className="borrowing-card-tag">Chất liệu Tinh vân & Ánh sao</div>
                <img 
                  src="/assets/image 39.png" 
                  alt="Cosmic Star Boy" 
                  className="borrowing-card-img" 
                />
                <button className="borrowing-zoom-btn" title="Phóng to ảnh">
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Image 4: LoL Cosmic Skins */}
              <div 
                className="borrowing-image-card card-cosmic-skins" 
                onClick={() => handleZoom('/assets/image 40.png')}
                title="Click để phóng to Hệ thống Cosmic Skin"
              >
                <div className="borrowing-card-glow" />
                <div className="borrowing-card-tag">Cosmic Skin System (LoL)</div>
                <img 
                  src="/assets/image 40.png" 
                  alt="Cosmic Skin League of Legends" 
                  className="borrowing-card-img" 
                />
                <button className="borrowing-zoom-btn" title="Phóng to ảnh">
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Image 5: Training Design Poster */}
              <div 
                className="borrowing-image-card card-final-poster" 
                onClick={() => handleZoom('/assets/Train 1.png')}
                title="Click để phóng to Poster Training Design hoàn thiện"
              >
                <div className="borrowing-card-glow" />
                <div className="borrowing-card-tag highlight-tag">Ấn phẩm hoàn thiện</div>
                <img 
                  src="/assets/Train 1.png" 
                  alt="Training Design - Tư duy thiết kế trong thời đại AI" 
                  className="borrowing-card-img" 
                />
                <button className="borrowing-zoom-btn" title="Phóng to ảnh">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'all' && (
            <div className="borrowing-cards-grid grid-all">
              <div className="all-view-row row-upper">
                <span className="row-label">1. THAM CHIẾU BỐ CỤC & DÁNG CẦM VẬT THỂ</span>
                <div className="row-items">
                  <div 
                    className="borrowing-image-card card-mini" 
                    onClick={() => handleZoom('/assets/image 37.png')}
                  >
                    <img src="/assets/image 37.png" alt="Sketch" className="borrowing-card-img" />
                    <span className="mini-tag">Sketch</span>
                  </div>
                  <div 
                    className="borrowing-image-card card-mini card-mini-wide" 
                    onClick={() => handleZoom('/assets/image 41.png')}
                  >
                    <img src="/assets/image 41.png" alt="PUBG Visual" className="borrowing-card-img" />
                    <span className="mini-tag">3D Key Visual</span>
                  </div>
                </div>
              </div>

              <div className="all-view-row row-lower">
                <span className="row-label">2. CHẤT LIỆU GALAXY & TÁC PHẨM HOÀN THIỆN</span>
                <div className="row-items">
                  <div 
                    className="borrowing-image-card card-mini" 
                    onClick={() => handleZoom('/assets/image 39.png')}
                  >
                    <img src="/assets/image 39.png" alt="Cosmic Boy" className="borrowing-card-img" />
                    <span className="mini-tag">Chất liệu sao</span>
                  </div>
                  <div 
                    className="borrowing-image-card card-mini" 
                    onClick={() => handleZoom('/assets/image 40.png')}
                  >
                    <img src="/assets/image 40.png" alt="Cosmic LoL" className="borrowing-card-img" />
                    <span className="mini-tag">Cosmic Skin</span>
                  </div>
                  <div 
                    className="borrowing-image-card card-mini card-mini-hero" 
                    onClick={() => handleZoom('/assets/Train 1.png')}
                  >
                    <img src="/assets/Train 1.png" alt="Training Design" className="borrowing-card-img" />
                    <span className="mini-tag highlight">Poster Hoàn thiện</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
