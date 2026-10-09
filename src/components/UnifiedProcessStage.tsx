import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';

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
    image: getAssetUrl("/assets/image 26.png"),
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
    image: getAssetUrl("/assets/image 27.png"),
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
    title: "Xử lý background\nretouch ảnh\nánh sáng chủ thể",
    shortTitle: "3. BG & Retouch",
    subtitle: "Thiết lập sân khấu nhung, retouch sản phẩm và luồng sáng ma thuật",
    image: getAssetUrl("/assets/image 28.png"),
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
    image: getAssetUrl("/assets/image 29.png"),
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
    image: getAssetUrl("/assets/image 30.png"),
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

  const currentStep = PROCESS_STAGES[currentStepIndex];

  const handleNextStep = () => {
    setCurrentStepIndex((prev) => (prev + 1) % PROCESS_STAGES.length);
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => (prev === 0 ? PROCESS_STAGES.length - 1 : prev - 1));
  };

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
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

      <div className="unified-process-container">
        {/* MAIN BODY: CLEAN, BALANCED WORKSPACE */}
        <div className="unified-process-workspace">
          {/* LEFT COLUMN: Clean Title, Subtitle & Step Navigation */}
          <section className="process-info-col">
            <div className="process-text-group">
              <h1 className="stage-main-title">
                {currentStep.title.split('\n').map((line, idx) => (
                  <span key={idx} className="stage-title-line">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="stage-subtitle">{currentStep.subtitle}</p>
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
                    title={`Xem công đoạn ${s.stepNumber} • ${s.shortTitle}`}
                  >
                    <img src={s.image} alt={s.shortTitle} className="filmstrip-img" />
                    <span className="thumb-idx">{s.stepNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Large Clean Poster Display Card */}
          <section className="process-poster-col">
            <div 
              className="process-poster-frame"
              onClick={() => onImageZoom && onImageZoom(currentStep.image)}
              title={`Click để phóng to toàn màn hình • ${currentStep.title}`}
            >
              <img 
                src={currentStep.image} 
                alt={currentStep.title} 
                className="process-poster-img"
                key={currentStep.image}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
