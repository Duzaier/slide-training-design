import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  ArrowRight, 
  Maximize2, 
  Grid3X3, 
  Layers, 
  Sparkles, 
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export interface ProcessStageStep {
  id: number;
  stepNumber: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  image: string;
  category: string;
  description: string;
  keyActions: string[];
  technicalFocus: string;
}

const PROCESS_STAGES: ProcessStageStep[] = [
  {
    id: 1,
    stepNumber: "01",
    title: "Sketch",
    shortTitle: "1. Sketch",
    subtitle: "Bản vẽ phác thảo bố cục & hệ thống lưới (Layout Wireframe & Grid)",
    image: "/assets/image 26.png",
    category: "Khung bố cục & Lưới",
    description: "Xây dựng hệ thống lưới (Grid) & wireframe định hình tỷ lệ các khu vực chính: tiêu đề, sản phẩm trung tâm và voucher.",
    keyActions: [
      "Phân vùng tỷ lệ hiển thị tiêu đề và nhân vật chính",
      "Xây dựng lưới căn chỉnh (Grid Alignment & Safe Margin)",
      "Định hình cấu trúc khối voucher và CTA chính"
    ],
    technicalFocus: "Composition & Structural Foundation"
  },
  {
    id: 2,
    stepNumber: "02",
    title: "Thay element cơ bản",
    shortTitle: "2. Thay Element",
    subtitle: "Định vị và đưa các sản phẩm thương hiệu vào bố cục",
    image: "/assets/image 27.png",
    category: "Sắp đặt thành phần",
    description: "Định vị và thay thế các element sản phẩm chủ đạo (bộ mỹ phẩm AHC, hộp quà 3D, mũ ảo thuật và các tag voucher) vào khung wireframe bố cục.",
    keyActions: [
      "Tách nền và import sản phẩm chai mỹ phẩm AHC thực tế",
      "Sắp đặt mũ ma thuật, hộp quà 3D và banner voucher",
      "Cân bằng tỷ lệ kích thước và tương quan không gian"
    ],
    technicalFocus: "Element Placement & Visual Proportions"
  },
  {
    id: 3,
    stepNumber: "03",
    title: "Xử lý background, retouch ảnh & ánh sáng chủ thể",
    shortTitle: "3. BG & Retouch",
    subtitle: "Thiết lập sân khấu nhung, retouch sản phẩm và luồng sáng ma thuật",
    image: "/assets/image 28.png",
    category: "Retouch & Ánh sáng cục bộ",
    description: "Thiết lập background rèm nhung sân khấu, retouch sắc nét từng sản phẩm AHC và xử lý luồng ánh sáng chủ thể tỏa ra từ chiếc nón ảo thuật.",
    keyActions: [
      "Tạo background rèm nhung sân khấu màu đỏ thẫm",
      "Retouch phản quang trên thân chai AHC và bề mặt da",
      "Vẽ luồng sáng phát quang xanh tím bốc lên từ chiếc nón"
    ],
    technicalFocus: "Surface Retouching & Local Subject Luminance"
  },
  {
    id: 4,
    stepNumber: "04",
    title: "Xử lý ánh sáng tổng thể",
    shortTitle: "4. Ánh sáng tổng thể",
    subtitle: "Đánh nguồn sáng spotlight sân khấu, tương phản và khối 3D",
    image: "/assets/image 29.png",
    category: "Chiếu sáng tổng thể",
    description: "Đánh nguồn sáng spotlight tổng thể từ đỉnh sân khấu rọi xuống trung tâm cụm sản phẩm, tạo độ tương phản mạnh mẽ và chiều sâu không gian 3D.",
    keyActions: [
      "Tạo luồng spotlight từ đỉnh chiếu rọi xuống cụm trung tâm",
      "Tăng cường Value Contrast (độ sâu vùng tối & điểm nhấn sáng)",
      "Tạo bóng đổ tiếp xúc (Contact Shadow) chân thực trên mặt sàn"
    ],
    technicalFocus: "Global Light Environment & 3D Depth"
  },
  {
    id: 5,
    stepNumber: "05",
    title: "Hoàn thiện với hiệu ứng",
    shortTitle: "5. Hiệu ứng",
    subtitle: "Bổ sung dải ruy-băng ánh sáng ma thuật, hạt bụi sao và hoàn thiện",
    image: "/assets/image 30.png",
    category: "VFX & Hoàn thiện",
    description: "Bổ sung các dải ruy-băng ánh sáng xoắn ốc ma thuật, hạt bụi sao phát quang và vệt sáng viền hoàn thiện tác phẩm Key Visual.",
    keyActions: [
      "Vẽ các dải ruy-băng lụa ánh sáng cuộn quanh cụm sản phẩm",
      "Thêm hiệu ứng bụi sao phát sáng (Magic Sparkles & Stardust)",
      "Cân chỉnh Color Grading & Glow ma thuật huyền bí cuối cùng"
    ],
    technicalFocus: "Atmospheric FX & Commercial Polish"
  }
];

interface UnifiedProcessStageProps {
  onImageZoom?: (url: string) => void;
}

export const UnifiedProcessStage: React.FC<UnifiedProcessStageProps> = ({ onImageZoom }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<number | null>(null);

  const currentStep = PROCESS_STAGES[currentStepIndex];

  // Auto-play progression logic
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % PROCESS_STAGES.length);
      }, 2800);
    } else {
      if (autoPlayTimerRef.current !== null) {
        window.clearInterval(autoPlayTimerRef.current);
      }
    }
    return () => {
      if (autoPlayTimerRef.current !== null) {
        window.clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev + 1) % PROCESS_STAGES.length);
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev === 0 ? PROCESS_STAGES.length - 1 : prev - 1));
  };

  const handleSelectStep = (index: number) => {
    setIsPlaying(false);
    setCompareMode(false);
    setCurrentStepIndex(index);
  };

  const toggleCompare = () => {
    setIsPlaying(false);
    setCompareMode((prev) => !prev);
    setCurrentStepIndex(compareMode ? 0 : 4);
  };

  return (
    <div className="layout-unified-process-stage">
      {/* Ambient Cosmic Background */}
      <div className="galaxy-backdrop-layer">
        <div 
          className="galaxy-nebula-glow galaxy-glow-top-right" 
          style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(56, 182, 255, 0.15) 50%, transparent 70%)' }} 
        />
        <div 
          className="galaxy-nebula-glow galaxy-glow-bottom-left" 
          style={{ background: 'radial-gradient(circle, rgba(235, 30, 60, 0.2) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)' }} 
        />
        <div className="galaxy-stars-particle-mesh" />
      </div>

      {/* Floating 3D Decors */}
      <div className="floating-decor-item decor-chatgpt" style={{ top: '3%', right: '3%', width: '65px', opacity: 0.65 }}>
        <img src="/assets/decor_chatgpt_3d.png" alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
      </div>
      <div className="floating-decor-item decor-photoshop" style={{ bottom: '4%', left: '3%', width: '70px', opacity: 0.65 }}>
        <img src="/assets/decor_photoshop_3d.png" alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
      </div>

      <div className="unified-process-container">
        {/* TOP CONTROL BAR: STEPPER & ACTION TOOLS */}
        <header className="unified-process-header">
          <div className="process-header-left">
            <span className="process-badge-tag">
              <Layers size={13} /> TIẾN TRÌNH THỰC HIỆN KEY VISUAL
            </span>
            <span className="process-brand-pill">Shopee Mall x AHC 11.11</span>
          </div>

          <div className="process-controls-group">
            <button 
              className={`process-ctrl-btn ${isPlaying ? 'ctrl-btn-active' : ''}`}
              onClick={togglePlay}
              title={isPlaying ? "Dừng tự động phát" : "Tự động phát tiến trình từng bước"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? "Dừng" : "Phát tiến trình"}</span>
            </button>

            <button 
              className={`process-ctrl-btn ${compareMode ? 'ctrl-btn-active' : ''}`}
              onClick={toggleCompare}
              title="So sánh nhanh Bản phác thảo (Bước 1) và Tác phẩm hoàn thiện (Bước 5)"
            >
              <SlidersHorizontal size={14} />
              <span>{compareMode ? "Bản hoàn thiện (Bước 5)" : "So sánh Before / After"}</span>
            </button>

            <button 
              className={`process-ctrl-btn ${isGridView ? 'ctrl-btn-active' : ''}`}
              onClick={() => setIsGridView((prev) => !prev)}
              title={isGridView ? "Chuyển về xem chi tiết" : "Xem toàn cảnh 5 bước cạnh nhau"}
            >
              {isGridView ? <Layers size={14} /> : <Grid3X3 size={14} />}
              <span>{isGridView ? "Xem chi tiết" : "Toàn cảnh 5 bước"}</span>
            </button>
          </div>
        </header>

        {/* INTERACTIVE STEPPER TIMELINE */}
        <nav className="process-stepper-nav" aria-label="5 Công đoạn Key Visual">
          <div className="process-stepper-track">
            <div 
              className="process-stepper-fill" 
              style={{ width: `${(currentStepIndex / (PROCESS_STAGES.length - 1)) * 100}%` }}
            />
          </div>

          <div className="process-steps-list">
            {PROCESS_STAGES.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPassed = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  className={`process-step-node ${isActive ? 'node-active' : ''} ${isPassed ? 'node-passed' : ''}`}
                  onClick={() => handleSelectStep(idx)}
                >
                  <div className="node-indicator">
                    <span className="node-num">{step.stepNumber}</span>
                  </div>
                  <div className="node-label-group">
                    <span className="node-step-title">{step.shortTitle}</span>
                    <span className="node-step-category">{step.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* MAIN BODY: EITHER DETAILED VIEW OR 5-STAGE GRID VIEW */}
        {!isGridView ? (
          <div className="unified-process-workspace">
            {/* LEFT COLUMN: Stage Detailed Description & Breakdown */}
            <section className="process-info-col">
              <div className="stage-meta-header">
                <div className="stage-number-pill">
                  <Sparkles size={13} className="text-pink-400" />
                  CÔNG ĐOẠN {currentStep.stepNumber} / 05
                </div>
                <span className="stage-focus-tag">{currentStep.technicalFocus}</span>
              </div>

              <h1 className="stage-main-title">{currentStep.title}</h1>
              <p className="stage-subtitle">{currentStep.subtitle}</p>

              <div className="stage-desc-card">
                <p className="stage-desc-text">{currentStep.description}</p>

                <div className="stage-actions-list">
                  <h2 className="actions-header">Thao tác kỹ thuật chính:</h2>
                  {currentStep.keyActions.map((action, idx) => (
                    <div key={idx} className="action-item">
                      <CheckCircle2 size={15} className="action-icon" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Navigation Controls & Mini Thumbnails Filmstrip */}
              <div className="stage-footer-nav">
                <div className="stage-arrow-btns">
                  <button 
                    className="stage-nav-arrow" 
                    onClick={handlePrevStep}
                    title="Công đoạn trước"
                  >
                    <ArrowLeft size={16} /> <span>Trước</span>
                  </button>
                  <button 
                    className="stage-nav-arrow stage-nav-arrow-next" 
                    onClick={handleNextStep}
                    title="Công đoạn kế tiếp"
                  >
                    <span>Tiếp theo</span> <ArrowRight size={16} />
                  </button>
                </div>

                <div className="stage-filmstrip-row">
                  {PROCESS_STAGES.map((s, idx) => (
                    <div
                      key={s.id}
                      className={`filmstrip-thumb ${idx === currentStepIndex ? 'thumb-active' : ''}`}
                      onClick={() => handleSelectStep(idx)}
                      title={`Xem ${s.shortTitle}`}
                    >
                      <img src={s.image} alt={s.shortTitle} className="filmstrip-img" />
                      <span className="thumb-idx">{s.stepNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN: Poster Display Card with Live Zoom */}
            <section className="process-poster-col">
              <div 
                className="process-poster-frame"
                onClick={() => onImageZoom && onImageZoom(currentStep.image)}
                title={`Click để phóng to toàn màn hình • ${currentStep.title}`}
              >
                <div className="poster-stage-overlay-badge">
                  <span className="overlay-badge-step">GIAI ĐOẠN {currentStep.stepNumber}</span>
                  <span className="overlay-badge-name">{currentStep.category}</span>
                </div>

                <img 
                  src={currentStep.image} 
                  alt={currentStep.title} 
                  className="process-poster-img"
                  key={currentStep.image}
                />

                <div className="poster-zoom-hint">
                  <Maximize2 size={14} /> <span>Nhấp để phóng to</span>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* GRID OVERVIEW VIEW: ALL 5 STAGES SIDE BY SIDE */
          <div className="unified-process-grid-view">
            <div className="grid-view-banner">
              <h2>Toàn cảnh tiến trình 5 công đoạn xử lý Key Visual</h2>
              <p>Quan sát sự chuyển biến liên tục từ bản phác thảo ý tưởng đến visual thương mại hoàn thiện.</p>
            </div>

            <div className="grid-stages-sequence">
              {PROCESS_STAGES.map((step, idx) => (
                <div 
                  key={step.id} 
                  className={`grid-stage-card ${idx === currentStepIndex ? 'grid-card-active' : ''}`}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsGridView(false);
                  }}
                  title={`Nhấp để xem chi tiết ${step.title}`}
                >
                  <div className="grid-card-header">
                    <span className="grid-card-step">{step.stepNumber}</span>
                    <span className="grid-card-title">{step.title}</span>
                  </div>

                  <div className="grid-card-img-wrapper">
                    <img src={step.image} alt={step.title} className="grid-card-img" />
                  </div>

                  <div className="grid-card-footer">
                    <span className="grid-card-category">{step.category}</span>
                    <ChevronRight size={14} className="grid-card-arrow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
