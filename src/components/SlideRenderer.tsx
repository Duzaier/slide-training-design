import React, { useState, useMemo, useEffect } from 'react';
import { getAssetUrl } from '../utils/assetHelper';
import { SlideData } from '../types/presentation';
import { InteractiveColorPicker } from './InteractiveColorPicker';
import { InteractiveLightStudio } from './InteractiveLightStudio';
import { UnifiedProcessStage } from './UnifiedProcessStage';
import { ConceptBorrowingStage } from './ConceptBorrowingStage';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Compass,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SlideRendererProps {
  slide: SlideData;
  onImageClick?: (url: string) => void;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, onImageClick }) => {
  const [activeBreakdownTab, setActiveBreakdownTab] = useState<'both' | 'sketch' | 'analysis'>('both');
  const [zoomModalUrl, setZoomModalUrl] = useState<string | null>(null);
  const [zoomImageIndex, setZoomImageIndex] = useState<number>(0);

  // Collect all images in current slide
  const currentImages = useMemo(() => {
    return slide.images && slide.images.length > 0 ? slide.images : [];
  }, [slide.images]);

  const hasMultipleImages = currentImages.length >= 2;

  const handleImageZoom = (url: string) => {
    if (onImageClick) {
      onImageClick(url);
      return;
    }
    const idx = currentImages.findIndex(img => img.url === url);
    if (idx !== -1) {
      setZoomImageIndex(idx);
    } else {
      setZoomImageIndex(0);
    }
    setZoomModalUrl(url);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMultipleImages) return;
    const nextIdx = zoomImageIndex > 0 ? zoomImageIndex - 1 : currentImages.length - 1;
    setZoomImageIndex(nextIdx);
    setZoomModalUrl(currentImages[nextIdx].url);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMultipleImages) return;
    const nextIdx = zoomImageIndex < currentImages.length - 1 ? zoomImageIndex + 1 : 0;
    setZoomImageIndex(nextIdx);
    setZoomModalUrl(currentImages[nextIdx].url);
  };

  // Keyboard navigation for enlarged lightbox
  useEffect(() => {
    if (!zoomModalUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomModalUrl(null);
      } else if (e.key === 'ArrowLeft') {
        if (hasMultipleImages) {
          const nextIdx = zoomImageIndex > 0 ? zoomImageIndex - 1 : currentImages.length - 1;
          setZoomImageIndex(nextIdx);
          setZoomModalUrl(currentImages[nextIdx].url);
        }
      } else if (e.key === 'ArrowRight') {
        if (hasMultipleImages) {
          const nextIdx = zoomImageIndex < currentImages.length - 1 ? zoomImageIndex + 1 : 0;
          setZoomImageIndex(nextIdx);
          setZoomModalUrl(currentImages[nextIdx].url);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomModalUrl, zoomImageIndex, hasMultipleImages, currentImages]);

  // Slide 12 Interactive Color Studio state
  const [slide12PickedColor, setSlide12PickedColor] = useState<string>('#1E5AFF');

  // Special Check: Is this Slide 01 (Speaker Profile), Slide 02 (Concept), Slide 03 (AI in Design), Slide 04 (Gen Model), Slide 05 (Lighting), or Slide 06 (Gen AI Grid)?
  const isSpeakerSlide = slide.id === 1;
  const isSlide2 = slide.id === 2 || slide.layoutType === 'concept_minimal';
  const isSlide3 = slide.id === 3 || slide.layoutType === 'ai_design_minimal';
  const isSlide4 = slide.id === 4 || slide.layoutType === 'gen_model_minimal';
  const isSlide5 = slide.id === 5 || slide.layoutType === 'lighting_minimal';
  const isSlide6 = slide.id === 6 || slide.layoutType === 'gen_ai_grid_minimal';
  const isSlide7 = slide.id === 7 || slide.layoutType === 'prompt_minimal';
  const isQuestionOrStatementSlide = slide.id === 8 || slide.id === 9 || slide.id === 16 || slide.id === 22 || slide.id === 26 || slide.id === 27 || slide.layoutType === 'editorial_question_minimal';
  const isSlide10 = slide.id === 10 || slide.layoutType === 'lighting_duo_minimal';
  const isCubeStudioSlide = slide.id === 105 || slide.layoutType === 'cube_lighting_studio';
  const isSlide11 = slide.id === 11 || slide.layoutType === 'composition_perspective_minimal';
  const isSlide12 = slide.id === 12 || slide.layoutType === 'color_analysis_minimal';
  const isSlide13 = slide.id === 13 || slide.layoutType === 'value_contrast_minimal';
  const isSlide14 = slide.id === 14 || slide.layoutType === 'style_art_gallery_minimal';
  const isTypographySlide = slide.layoutType === 'typography_minimal' || slide.title?.toLowerCase() === 'typography';
  const isProcessUnifiedSlide = slide.id === 17 || slide.layoutType === 'design_process_unified' || slide.title?.toLowerCase().includes('tiến trình');
  const isConceptBorrowingSlide = slide.id === 182 || slide.layoutType === 'concept_borrowing_stage' || slide.title?.toLowerCase().includes('mượn ý tưởng');
  const isSocialSizeSlide = slide.layoutType === 'social_size_minimal' || slide.title?.toLowerCase() === 'size';
  const isSocialMultiImageSlide = slide.layoutType === 'social_multi_image_minimal' || slide.title?.toLowerCase().includes('nhiều ảnh');
  const isSocialSizeErrorSlide = slide.layoutType === 'social_size_error_minimal' || slide.title?.toLowerCase().includes('lỗi sai kích thước');

  return (
    <div className="slide-content-wrapper">
      {/* 1. SLIDE 01: SPEAKER PROFILE (PHẠM LAI ĐĂNG KHOA) - BESPOKE GALAXY ART DIRECTION */}
      {isSpeakerSlide ? (
        <div className="layout-speaker-galaxy-stage">
          {/* Galaxy Cosmic Backdrop with soft blur */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* 4 Floating Decorative 3D Assets (ảnh 1, 2, 3, 4) */}
          <div className="floating-decor-item decor-chatgpt" style={{ top: '4%', left: '46%', width: '70px', opacity: 0.7 }} title="3D ChatGPT Asset">
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '8%', right: '3%', width: '75px', opacity: 0.7 }} title="3D Photoshop Asset">
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '4%', width: '85px', opacity: 0.75 }} title="Cosmic Moon Asset">
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-nebula" style={{ bottom: '4%', left: '3%', width: '80px', opacity: 0.65 }} title="Nebula Planet Asset">
            <img src={getAssetUrl('/assets/decor_nebula_planet.png')} alt="Nebula Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          {/* Main 2-Column Hero: Left Portrait • Right Profile Info */}
          <div className="speaker-galaxy-content-grid">
            {/* LEFT COLUMN: Speaker Portrait */}
            <div className="speaker-portrait-col">
              <div
                className="speaker-hero-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/speaker_portrait.png'))}
                title="Click để xem ảnh kích thước lớn"
              >
                <div className="speaker-portrait-glow-ring" />
                <div className="speaker-img-container">
                  <img
                    src={slide.images[0]?.url || getAssetUrl('/assets/speaker_portrait.png')}
                    alt="Phạm Lai Đăng Khoa"
                    className="speaker-hero-img"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Minimalist Profile Information */}
            <div className="speaker-minimal-col">
              <h1 className="speaker-minimal-name">Phạm Lai Đăng Khoa</h1>
              <div className="speaker-minimal-roles">
                <p className="speaker-minimal-role">Thực tập sinh DiepLam Printing & Design</p>
                <p className="speaker-minimal-role">Freelancer Upwork</p>
                <p className="speaker-minimal-role">Chủ tịch Gen 5</p>
              </div>
            </div>
          </div>
        </div>
      ) : isSlide2 ? (
        /* 2. SLIDE 02: CONCEPT VÀ TÍNH THIẾT KẾ (MINIMALIST 2-POSTER COMPARISON) */
        <div className="layout-concept-minimal-stage">
          {/* Ambient Cosmic Background */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(255, 120, 0, 0.22) 0%, rgba(56, 182, 255, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(112, 0, 255, 0.25) 0%, rgba(255, 120, 0, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-chatgpt" style={{ bottom: '10%', left: '3.5%', width: '70px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '3.5%', width: '85px', opacity: 0.75 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="concept-minimal-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Heading (Single Line) */}
            <div className="concept-minimal-title-col">
              <h1 className="concept-minimal-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: 2 Side-by-Side Posters */}
            <div className="concept-minimal-posters-col">
              <div
                className="concept-poster-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/slide2_poster_1.png'))}
                title="Click để phóng to Poster 1"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/slide2_poster_1.png')}
                  alt="Concept 01"
                  className="concept-poster-img"
                />
              </div>

              <div
                className="concept-poster-card"
                onClick={() => handleImageZoom(slide.images[1]?.url || getAssetUrl('/assets/slide2_poster_2.png'))}
                title="Click để phóng to Poster 2"
              >
                <img
                  src={slide.images[1]?.url || getAssetUrl('/assets/slide2_poster_2.png')}
                  alt="Concept 02"
                  className="concept-poster-img"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isSlide3 ? (
        /* 3. SLIDE 03: AI HỖ TRỢ ĐƯỢC GÌ TRONG THIẾT KẾ? (MINIMALIST HERO POSTER) */
        <div className="layout-ai-minimal-stage">
          {/* Ambient Cosmic Background with Crimson / Ruby Energy Aura */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(235, 30, 60, 0.26) 0%, rgba(255, 90, 90, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(140, 10, 30, 0.3) 0%, rgba(56, 182, 255, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '10%', left: '3.5%', width: '75px', opacity: 0.75 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-nebula" style={{ top: '4%', right: '4%', width: '75px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_nebula_planet.png')} alt="Nebula Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="ai-minimal-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title (Single Line) */}
            <div className="ai-minimal-title-col">
              <h1 className="ai-minimal-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: Interactive Product Artwork Poster */}
            <div className="ai-minimal-poster-col">
              <div
                className="ai-poster-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/bt 1.png'))}
                title="Click để phóng to visual WARRIOR Vị Dâu"
              >
                <div className="ai-poster-glow-backdrop" />
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/bt 1.png')}
                  alt="WARRIOR Vị Dâu AI Design"
                  className="ai-poster-img"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isSlide4 ? (
        /* 4. SLIDE 04: GEN MODEL (3-STEP WORKFLOW GALLERY) */
        <div className="layout-concept-minimal-stage">
          {/* Ambient Cosmic Background with Azure / Cyan Aura */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(0, 140, 255, 0.22) 0%, rgba(56, 182, 255, 0.1) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(112, 0, 255, 0.22) 0%, rgba(0, 140, 255, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-chatgpt" style={{ bottom: '10%', left: '3.5%', width: '70px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '3.5%', width: '85px', opacity: 0.75 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="concept-minimal-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title (Single Line) */}
            <div className="concept-minimal-title-col">
              <h1 className="concept-minimal-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: 3 Side-by-Side Images (Mẫu thực tế • Dáng tham chiếu • Model AI) */}
            <div className="genmodel-minimal-posters-col">
              {/* Image 1: Real Model Reference */}
              <div
                className="genmodel-poster-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/slide4_real_model.png'))}
                title="Click để phóng to Ảnh Chụp Mẫu Thực Tế"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/slide4_real_model.png')}
                  alt="Ảnh chụp mẫu thực tế"
                  className="genmodel-poster-img"
                />
              </div>

              {/* Image 2: Pose Reference */}
              <div
                className="genmodel-poster-card"
                onClick={() => handleImageZoom(slide.images[1]?.url || getAssetUrl('/assets/slide4_pose_ref.png'))}
                title="Click để phóng to Dáng Nhân Vật Tham Chiếu"
              >
                <img
                  src={slide.images[1]?.url || getAssetUrl('/assets/slide4_pose_ref.png')}
                  alt="Dáng nhân vật tham chiếu"
                  className="genmodel-poster-img"
                />
              </div>

              {/* Image 3: AI Model */}
              <div
                className="genmodel-poster-card"
                onClick={() => handleImageZoom(slide.images[2]?.url || getAssetUrl('/assets/slide4_ai_model.png'))}
                title="Click để phóng to Tạo Hình AI 3D"
              >
                <img
                  src={slide.images[2]?.url || getAssetUrl('/assets/slide4_ai_model.png')}
                  alt="Tạo hình nhân vật AI 3D"
                  className="genmodel-poster-img"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isSlide5 ? (
        /* 5. SLIDE 05: TẠO GÓC NHÌN CƠ BẢN VỀ ÁNH SÁNG (MINIMALIST LIGHTING & 3D ISOMETRIC) */
        <div className="layout-lighting-minimal-stage">
          {/* Ambient Cosmic Background with Subtle Silver/Emerald/Cyan Aura */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(56, 182, 255, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '10%', left: '3.5%', width: '72px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-nebula" style={{ top: '4%', right: '3.5%', width: '75px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_nebula_planet.png')} alt="Nebula Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="lighting-minimal-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title (Single Line) */}
            <div className="lighting-minimal-title-col">
              <h1 className="lighting-minimal-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: 2 Side-by-Side Images (Diagram • 3D Render) */}
            <div className="lighting-minimal-posters-col">
              {/* Image 1: Lighting Infographic Diagram */}
              <div
                className="lighting-poster-card lighting-diagram-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/image 3.png'))}
                title="Click để phóng to Sơ đồ phân tích ánh sáng"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/image 3.png')}
                  alt="Sơ đồ Phân Tích Ánh Sáng"
                  className="lighting-poster-img"
                />
              </div>

              {/* Image 2: Isometric 3D Truck Render */}
              <div
                className="lighting-poster-card lighting-render-card"
                onClick={() => handleImageZoom(slide.images[1]?.url || getAssetUrl('/assets/image 17.png'))}
                title="Click để phóng to Mô Hình 3D Isometric"
              >
                <img
                  src={slide.images[1]?.url || getAssetUrl('/assets/image 17.png')}
                  alt="3D Truck Isometric Render"
                  className="lighting-poster-img"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isSlide6 ? (
        /* 6. SLIDE 06: GEN AI THẾ NÀO CHO ĐÚNG? (2x2 EDITORIAL GALLERY GRID) */
        <div className="layout-genai-minimal-stage">
          {/* Ambient Cosmic Background with Purple / Golden Amber Aura */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(56, 182, 255, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-chatgpt" style={{ bottom: '10%', left: '3.5%', width: '70px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '3.5%', width: '85px', opacity: 0.75 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="genai-minimal-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title (Single Line) */}
            <div className="genai-minimal-title-col">
              <h1 className="genai-minimal-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: 2-Column Gallery Layout */}
            <div className="genai-posters-showcase">
              {/* Sub-column 1: Square Visuals (FB Post + Storylab) */}
              <div className="genai-posters-subcol">
                <div
                  className="genai-grid-card genai-card-square"
                  onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/image 4.png'))}
                  title="Click để phóng to Bài Đăng Social"
                >
                  <img
                    src={slide.images[0]?.url || getAssetUrl('/assets/image 4.png')}
                    alt="Social Media Post"
                    className="genai-grid-img"
                  />
                </div>

                <div
                  className="genai-grid-card genai-card-square"
                  onClick={() => handleImageZoom(slide.images[2]?.url || getAssetUrl('/assets/Nhà cái 1.png'))}
                  title="Click để phóng to Visual Storylab"
                >
                  <img
                    src={slide.images[2]?.url || getAssetUrl('/assets/Nhà cái 1.png')}
                    alt="Storylab Sponsor Visual"
                    className="genai-grid-img"
                  />
                </div>
              </div>

              {/* Sub-column 2: Portrait Posters (Hovilo + Vovinam) */}
              <div className="genai-posters-subcol">
                <div
                  className="genai-grid-card genai-card-portrait"
                  onClick={() => handleImageZoom(slide.images[1]?.url || getAssetUrl('/assets/image 5.png'))}
                  title="Click để phóng to Poster Hovilo Dạ Vũ"
                >
                  <img
                    src={slide.images[1]?.url || getAssetUrl('/assets/image 5.png')}
                    alt="Hovilo Dạ Vũ Poster"
                    className="genai-grid-img"
                  />
                </div>

                <div
                  className="genai-grid-card genai-card-portrait"
                  onClick={() => handleImageZoom(slide.images[3]?.url || getAssetUrl('/assets/CD đóng form 1.png'))}
                  title="Click để phóng to Poster Vovinam Countdown"
                >
                  <img
                    src={slide.images[3]?.url || getAssetUrl('/assets/CD đóng form 1.png')}
                    alt="Vovinam Countdown Poster"
                    className="genai-grid-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isSlide7 ? (
        /* 7. SLIDE 07: PROMPT THẾ NÀO (EDITORIAL AI CHAT & IMAGE GENERATION SHOWCASE) */
        <div className="layout-prompt-minimal-stage">
          {/* Ambient Cosmic Background with Deep Azure & Indigo Aura */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.22) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(56, 182, 255, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-chatgpt" style={{ bottom: '10%', left: '3.5%', width: '70px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-nebula" style={{ top: '4%', right: '3.5%', width: '75px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_nebula_planet.png')} alt="Nebula Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="prompt-minimal-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title (Single Line) */}
            <div className="prompt-minimal-title-col">
              <h1 className="prompt-minimal-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: AI Chat & Generation Visual Showcase */}
            <div className="prompt-minimal-poster-col">
              <div
                className="prompt-poster-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/image 7.png'))}
                title="Click để phóng to Ảnh minh họa Prompt AI"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/image 7.png')}
                  alt="Prompt AI Showcase"
                  className="prompt-poster-img"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isQuestionOrStatementSlide ? (
        /* 8 & 9. SLIDE 08/09: EDITORIAL KEY QUESTION & STATEMENT */
        <div className="layout-question-editorial-stage">
          {/* Ambient Cosmic Background with Subtle Purple & Cyan Aura */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(56, 182, 255, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.2) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-chatgpt" style={{ top: '6%', right: '6%', width: '75px', opacity: 0.75 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '8%', left: '6%', width: '75px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '8%', left: '6%', width: '85px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="question-editorial-content">
            <h1 className="question-editorial-heading">
              {slide.title.split('\n').map((line, idx, arr) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <div className="question-editorial-glow-line" />
          </div>
        </div>
      ) : isSlide10 ? (
        /* 10. SLIDE 10: ÁNH SÁNG (3D PRIMITIVES & COMMERCIAL POSTER) */
        <div className="layout-lighting-duo-stage">
          {/* Ambient Cosmic Background with Purple & Sapphire Aura */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(56, 182, 255, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(56, 182, 255, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '10%', left: '3.5%', width: '72px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '3.5%', width: '80px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="lighting-duo-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title (Single Line) */}
            <div className="lighting-duo-title-col">
              <h1 className="lighting-duo-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: 2 Side-by-Side Images (3D Primitives • Commercial Poster) */}
            <div className="lighting-duo-posters-col">
              {/* Image 1: 3D Primitives (Sphere, Box, Cylinder) */}
              <div
                className="lighting-duo-card lighting-primitives-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/Các khối 1.png'))}
                title="Click để phóng to Nghiên cứu ánh sáng các khối 3D"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/Các khối 1.png')}
                  alt="Các Khối 3D Cơ Bản"
                  className="lighting-duo-img lighting-primitives-img"
                />
              </div>

              {/* Image 2: Shopee Mall AHC 11.11 Poster */}
              <div
                className="lighting-duo-card lighting-commercial-card"
                onClick={() => handleImageZoom(slide.images[1]?.url || getAssetUrl('/assets/bài tập 1.png'))}
                title="Click để phóng to Key Visual Shopee Mall x AHC"
              >
                <img
                  src={slide.images[1]?.url || getAssetUrl('/assets/bài tập 1.png')}
                  alt="Key Visual Shopee Mall x AHC"
                  className="lighting-duo-img"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isCubeStudioSlide ? (
        /* 10B. SLIDE 10B: 3D LIGHTING & SHADOW SIMULATION STUDIO */
        <div className="layout-cube-studio-stage">
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.22) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(255, 170, 0, 0.18) 0%, rgba(56, 182, 255, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>
          <InteractiveLightStudio />
        </div>
      ) : isSlide11 ? (
        /* 11. SLIDE 11: BỐ CỤC, PHỐI CẢNH (EDITORIAL SQUARE HERO POSTER) */
        <div className="layout-perspective-minimal-stage">
          {/* Ambient Cosmic Background with Warm Red & Solar Amber Aura */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(249, 115, 22, 0.14) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, rgba(239, 68, 68, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '10%', left: '3.5%', width: '72px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '3.5%', width: '80px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="perspective-minimal-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title (Single Line) */}
            <div className="perspective-minimal-title-col">
              <h1 className="perspective-minimal-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: Square Hero Poster Showcase */}
            <div className="perspective-minimal-poster-col">
              <div
                className="perspective-poster-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/Bài tập 2.png'))}
                title="Click để phóng to Key Visual Shopee Xả Kho Voucher"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/Bài tập 2.png')}
                  alt="Key Visual Shopee Xả Kho Voucher"
                  className="perspective-poster-img"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isSlide12 ? (
        /* 12. SLIDE 12: MÀU SẮC (COLOR BREAKDOWN & COLOR PICKER) */
        <div className="layout-color-analysis-stage">
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.22) 0%, rgba(249, 115, 22, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, rgba(56, 182, 255, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          <div className="floating-decor-item decor-photoshop" style={{ bottom: '8%', left: '3.5%', width: '72px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '3.5%', width: '80px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="color-analysis-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title */}
            <div className="color-analysis-title-col">
              <h1 className="color-analysis-heading">{slide.title}</h1>
            </div>

            {/* RIGHT SHOWCASE: Poster Analysis + Interactive Color Picker Studio */}
            <div className="color-analysis-visual-col">
              {/* Image 1: Poster Analysis */}
              <div
                className="color-analysis-card color-poster-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/Phân tích màu 1.png'))}
                title="Click để phóng to Bảng phân tích màu sắc"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/Phân tích màu 1.png')}
                  alt="Phân Tích Màu Sắc"
                  className="color-analysis-img"
                />
              </div>

              {/* Interactive Photoshop-grade Color Picker Studio */}
              <div className="color-analysis-card color-picker-studio-card">
                <InteractiveColorPicker
                  currentColor={slide12PickedColor}
                  onColorChange={(val) => {
                    if (val.hex.toUpperCase() !== slide12PickedColor.toUpperCase()) {
                      setSlide12PickedColor(val.hex);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : isSlide13 ? (
        /* 13. SLIDE 13: VALUE (VALUE CONTRAST & READABILITY) */
        <div className="layout-value-contrast-stage">
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(56, 182, 255, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.18) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          <div className="floating-decor-item decor-photoshop" style={{ bottom: '10%', left: '3.5%', width: '72px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '3.5%', width: '80px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="value-contrast-content-grid">
            {/* LEFT COLUMN: Title */}
            <div className="value-contrast-title-col">
              <h1 className="value-contrast-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: 2-Row Value Comparison Matrix */}
            <div className="value-comparison-showcase">
              {/* Row 1: 4 Cards (Catch Star Color, Catch Star Gray, FBIZ Cyan, FBIZ White) */}
              <div className="value-comparison-row">
                <div
                  className="value-card"
                  onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/image 10.png'))}
                  title="Click để phóng to Catch STAR Color"
                >
                  <img src={slide.images[0]?.url || getAssetUrl('/assets/image 10.png')} alt="Catch Star Color" className="value-img" />
                </div>
                <div
                  className="value-card"
                  onClick={() => handleImageZoom(slide.images[1]?.url || getAssetUrl('/assets/image 11.png'))}
                  title="Click để phóng to Catch STAR Gray"
                >
                  <img src={slide.images[1]?.url || getAssetUrl('/assets/image 11.png')} alt="Catch Star Gray" className="value-img" />
                </div>
                <div
                  className="value-card"
                  onClick={() => handleImageZoom(slide.images[2]?.url || getAssetUrl('/assets/image 13.png'))}
                  title="Click để phóng to F-BIZ Cyan"
                >
                  <img src={slide.images[2]?.url || getAssetUrl('/assets/image 13.png')} alt="F-BIZ Cyan" className="value-img" />
                </div>
                <div
                  className="value-card"
                  onClick={() => handleImageZoom(slide.images[3]?.url || getAssetUrl('/assets/image 14.png'))}
                  title="Click để phóng to F-BIZ White"
                >
                  <img src={slide.images[3]?.url || getAssetUrl('/assets/image 14.png')} alt="F-BIZ White" className="value-img" />
                </div>
              </div>

              {/* Row 2: 2 Cards (FBIZ Navy, FBIZ Gray) */}
              <div className="value-comparison-row value-row-bottom">
                <div
                  className="value-card value-card-wide"
                  onClick={() => handleImageZoom(slide.images[4]?.url || getAssetUrl('/assets/image 15.png'))}
                  title="Click để phóng to F-BIZ Navy"
                >
                  <img src={slide.images[4]?.url || getAssetUrl('/assets/image 15.png')} alt="F-BIZ Navy" className="value-img" />
                </div>
                <div
                  className="value-card value-card-wide"
                  onClick={() => handleImageZoom(slide.images[5]?.url || getAssetUrl('/assets/image 16.png'))}
                  title="Click để phóng to F-BIZ Dark Slate"
                >
                  <img src={slide.images[5]?.url || getAssetUrl('/assets/image 16.png')} alt="F-BIZ Dark Slate" className="value-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isSlide14 ? (
        /* 14. SLIDE 14: STYLE ART (MULTI-GENRE ART STYLE GALLERY) */
        <div className="layout-style-art-stage">
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(236, 72, 153, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.2) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          <div className="floating-decor-item decor-chatgpt" style={{ top: '2.5%', right: '3.5%', width: '60px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="style-art-stage-container">
            {/* TOP HEADER: Title "Style art" */}
            <div className="style-art-header-row">
              <h1 className="style-art-heading">{slide.title}</h1>
            </div>

            {/* MAIN SHOWCASE: 2 Full-Width Rows */}
            <div className="style-art-gallery-showcase">
              {/* Row 1: 5 Character / Illustration Artworks */}
              <div className="style-art-row-characters">
                {slide.images.slice(0, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className={`style-art-card style-art-char-card style-art-char-${idx + 1}`}
                    onClick={() => handleImageZoom(img.url)}
                    title={`Click để phóng to Style ${idx + 1}`}
                  >
                    <img src={img.url} alt={img.caption || `Style Art ${idx + 1}`} className="style-art-img" />
                  </div>
                ))}
              </div>

              {/* Row 2: 2 Commercial Posters + 1 Wide 3D Asset Banner (image 25) */}
              <div className="style-art-row-bottom">
                {/* Poster 1 (Square 1:1) */}
                {slide.images[5] && (
                  <div
                    className="style-art-card style-art-poster-card style-art-poster-square"
                    onClick={() => handleImageZoom(slide.images[5].url)}
                    title="Click để phóng to Poster Low G"
                  >
                    <img src={slide.images[5].url} alt={slide.images[5].caption || "Poster Low G"} className="style-art-img" />
                  </div>
                )}

                {/* Poster 2 (Portrait 3:4) */}
                {slide.images[6] && (
                  <div
                    className="style-art-card style-art-poster-card style-art-poster-portrait"
                    onClick={() => handleImageZoom(slide.images[6].url)}
                    title="Click để phóng to Poster Champion"
                  >
                    <img src={slide.images[6].url} alt={slide.images[6].caption || "Poster Champion"} className="style-art-img" />
                  </div>
                )}

                {/* 3D Asset Pack Banner (image 25 ~3.08:1) - 100% uncropped */}
                {slide.images[7] && (
                  <div
                    className="style-art-card style-art-banner-card"
                    onClick={() => handleImageZoom(slide.images[7].url)}
                    title="Click để phóng to 3D Assets Pack"
                  >
                    <img src={slide.images[7].url} alt={slide.images[7].caption || "3D Assets Pack"} className="style-art-img" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : isTypographySlide ? (
        /* TYPOGRAPHY (3 CORE TYPOGRAPHY SHOWCASE) */
        <div className="layout-typography-stage">
          {/* Ambient Cosmic Background */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, rgba(56, 182, 255, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(56, 182, 255, 0.08) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          <div className="floating-decor-item decor-photoshop" style={{ bottom: '9%', left: '3.5%', width: '70px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-moon" style={{ top: '4%', right: '3.5%', width: '80px', opacity: 0.65 }}>
            <img src={getAssetUrl('/assets/decor_moon_planet.png')} alt="Moon Planet" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="typography-content-grid">
            {/* LEFT COLUMN: Clean Minimalist Title */}
            <div className="typography-title-col">
              <h1 className="typography-heading">{slide.title}</h1>
            </div>

            {/* RIGHT SHOWCASE: 3 Square Typography Cards */}
            <div className="typography-showcase-row">
              {/* Card 1: 440HZ */}
              <div
                className="typography-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/LOGO 1.png'))}
                title="Click để phóng to 440HZ Typography"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/LOGO 1.png')}
                  alt={slide.images[0]?.caption || "440HZ"}
                  className="typography-img"
                />
              </div>

              {/* Card 2: Đi qua mùa Hạ */}
              <div
                className="typography-card"
                onClick={() => handleImageZoom(slide.images[1]?.url || getAssetUrl('/assets/Logo dự án 1.png'))}
                title="Click để phóng to Đi qua mùa Hạ Lettering"
              >
                <img
                  src={slide.images[1]?.url || getAssetUrl('/assets/Logo dự án 1.png')}
                  alt={slide.images[1]?.caption || "Đi qua mùa Hạ"}
                  className="typography-img"
                />
              </div>

              {/* Card 3: Võ Việt Quy Tụ */}
              <div
                className="typography-card typography-card-dark"
                onClick={() => handleImageZoom(slide.images[2]?.url || getAssetUrl('/assets/Untitled-1 1.png'))}
                title="Click để phóng to Võ Việt Quy Tụ 3D Typography"
              >
                <img
                  src={slide.images[2]?.url || getAssetUrl('/assets/Untitled-1 1.png')}
                  alt={slide.images[2]?.caption || "Võ Việt Quy Tụ"}
                  className="typography-img typography-img-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isProcessUnifiedSlide ? (
        /* 17. SLIDE 17: UNIFIED PROCESS PROGRESSION STAGE (5 CÔNG ĐOẠN XỬ LÝ KEY VISUAL) */
        <UnifiedProcessStage onImageZoom={handleImageZoom} />
      ) : isConceptBorrowingSlide ? (
        /* 18B. SLIDE 18B: MƯỢN Ý TƯỞNG (CONCEPT BORROWING STAGE) */
        <ConceptBorrowingStage onImageZoom={handleImageZoom} />
      ) : isSocialSizeSlide ? (
        /* 23. SLIDE 23: SIZE (2000X2000 & 3660 X 2880) */
        <div className="layout-social-size-stage">
          {/* Ambient Cosmic Background */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(56, 182, 255, 0.15) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.2) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-chatgpt" style={{ top: '3.5%', right: '3.5%', width: '65px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '8%', left: '3.5%', width: '70px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="social-size-content-grid">
            {/* LEFT COLUMN: Title "Size" */}
            <div className="social-size-title-col">
              <h1 className="social-size-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: 2 Size Cards */}
            <div className="social-size-cards-col">
              <div className="social-size-cards-wrapper">
                {/* Card 1: 2000X2000 */}
                <div className="social-size-card-container">
                  <div className="social-size-tag-badge">2000X2000</div>
                  <div
                    className="social-size-card"
                    onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/Nhà cái 1.png'))}
                    title="Click để phóng to ảnh 2000X2000"
                  >
                    <img
                      src={slide.images[0]?.url || getAssetUrl('/assets/Nhà cái 1.png')}
                      alt={slide.images[0]?.caption || "Ảnh vuông 2000X2000"}
                      className="social-size-card-img"
                    />
                  </div>
                </div>

                {/* Card 2: 3660 X 2880 */}
                <div className="social-size-card-container">
                  <div className="social-size-tag-badge">3660 X 2880</div>
                  <div
                    className="social-size-card"
                    onClick={() => handleImageZoom(slide.images[1]?.url || getAssetUrl('/assets/CD đóng form 1.png'))}
                    title="Click để phóng to ảnh 3660 X 2880"
                  >
                    <img
                      src={slide.images[1]?.url || getAssetUrl('/assets/CD đóng form 1.png')}
                      alt={slide.images[1]?.caption || "Ảnh dọc 3660 X 2880"}
                      className="social-size-card-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isSocialMultiImageSlide ? (
        /* 24. SLIDE 24: NHIỀU ẢNH (440Hz Post + 5 Layout Templates) */
        <div className="layout-social-multi-stage">
          {/* Ambient Cosmic Background */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(56, 182, 255, 0.15) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(56, 182, 255, 0.2) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-chatgpt" style={{ top: '3.5%', right: '3.5%', width: '65px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '8%', left: '3.5%', width: '70px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="social-multi-container">
            {/* MAIN CONTENT: Left Showcase Post with Title + Right 5 Square Templates */}
            <div className="social-multi-body-layout">
              {/* LEFT COLUMN: Title "Nhiều ảnh" sitting closely above 440Hz Post */}
              <div className="social-multi-showcase-col">
                <div className="social-multi-title-wrap">
                  <h1 className="social-multi-heading">{slide.title}</h1>
                </div>
                <div
                  className="social-multi-showcase-card"
                  onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/image 31.png'))}
                  title="Click để phóng to bài đăng mẫu 440Hz"
                >
                  <div className="social-multi-card-tag">Bài đăng thực tế • 440Hz</div>
                  <img
                    src={slide.images[0]?.url || getAssetUrl('/assets/image 31.png')}
                    alt={slide.images[0]?.caption || "Bài đăng 440Hz"}
                    className="social-multi-showcase-img"
                  />
                  <button className="social-multi-zoom-btn" title="Phóng to">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: 5 Layout Template Cards (matching authentic 1:1 image dimensions) */}
              <div className="social-multi-templates-col">
                <div className="social-multi-templates-grid">
                  {slide.images.slice(1, 6).map((img, idx) => (
                    <div
                      key={idx}
                      className={`social-template-card social-template-card-${idx + 1}`}
                      onClick={() => handleImageZoom(img.url)}
                      title={`Click để phóng to ${img.caption || `Layout ${idx + 1}`}`}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || `Layout ${idx + 1}`}
                        className="social-template-img"
                      />
                      <button className="social-template-zoom-btn" title="Phóng to ảnh">
                        <Maximize2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isSocialSizeErrorSlide ? (
        /* 25. SLIDE 25: LỖI SAI KÍCH THƯỚC */
        <div className="layout-social-error-stage">
          {/* Ambient Cosmic Background */}
          <div className="galaxy-backdrop-layer">
            <div className="galaxy-nebula-glow galaxy-glow-top-right" style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 70%)' }} />
            <div className="galaxy-nebula-glow galaxy-glow-bottom-left" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(56, 182, 255, 0.1) 50%, transparent 70%)' }} />
            <div className="galaxy-stars-particle-mesh" />
          </div>

          {/* Floating Subtle 3D Decors */}
          <div className="floating-decor-item decor-chatgpt" style={{ top: '3.5%', right: '3.5%', width: '65px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_chatgpt_3d.png')} alt="ChatGPT 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="floating-decor-item decor-photoshop" style={{ bottom: '8%', left: '3.5%', width: '70px', opacity: 0.7 }}>
            <img src={getAssetUrl('/assets/decor_photoshop_3d.png')} alt="Photoshop 3D" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>

          <div className="social-error-content-grid">
            {/* LEFT COLUMN: Title "Lỗi sai kích thước" */}
            <div className="social-error-title-col">
              <h1 className="social-error-heading">{slide.title}</h1>
            </div>

            {/* RIGHT COLUMN: Cropped Infographic Post */}
            <div className="social-error-preview-col">
              <div
                className="social-error-preview-card"
                onClick={() => handleImageZoom(slide.images[0]?.url || getAssetUrl('/assets/image 8.png'))}
                title="Click để phóng to Lỗi sai kích thước"
              >
                <img
                  src={slide.images[0]?.url || getAssetUrl('/assets/image 8.png')}
                  alt={slide.images[0]?.caption || "Lỗi sai kích thước trên Facebook News Feed"}
                  className="social-error-preview-img"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* OTHER SLIDES: Standard Header Meta */
        <>
          <div className="slide-header-meta">
            <div className="slide-category-row">
              <span className="slide-index-pill">SLIDE {slide.slideNumber}</span>
              <span className="badge-tag">
                <Compass size={12} /> {slide.categoryLabel}
              </span>
              {slide.brand && (
                <span className="badge-tag badge-tag-amber">
                  {slide.brand}
                </span>
              )}
            </div>
            <h1 className="slide-main-title">{slide.title}</h1>
            {slide.subtitle && <p className="slide-sub-title">{slide.subtitle}</p>}
          </div>

          {/* 2. HERO COVER & SUMMARY LAYOUT */}
          {slide.layoutType === 'hero_cover' && (
            <div className="layout-hero-cover">
              <div className="hero-text-side">
                <p className="hero-primary-text">{slide.primaryText}</p>

                {slide.keyPoints && slide.keyPoints.length > 0 && (
                  <div className="hero-keypoints-list">
                    {slide.keyPoints.map((point, idx) => (
                      <div key={idx} className="hero-keypoint-item">
                        <div className="hero-keypoint-bullet" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {slide.specs && (
                  <div className="hero-specs-row">
                    {slide.specs.map((spec, idx) => (
                      <div key={idx} className="hero-spec-card">
                        <span className="hero-spec-label">{spec.label}</span>
                        <span className="hero-spec-value">{spec.value}</span>
                        {spec.sub && <span className="hero-spec-sub">{spec.sub}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="hero-visual-side">
                {slide.images[0] && (
                  <div
                    className="hero-image-card"
                    onClick={() => handleImageZoom(slide.images[0].url)}
                    style={{ cursor: 'pointer' }}
                    title="Click để phóng to ảnh"
                  >
                    <img src={slide.images[0].url} alt={slide.title} />
                    {slide.images[0].caption && (
                      <div className="image-floating-badge">
                        {slide.images[0].caption}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. MULTI-PHOTO SPECIFICATION LAYOUT */}
          {slide.layoutType === 'multi_photo_spec' && (
            <div className="layout-multi-photo-spec">
              <div className="multi-photo-details">
                <p className="hero-primary-text">{slide.primaryText}</p>

                {slide.specs && (
                  <div className="multi-photo-specs-grid">
                    {slide.specs.map((spec, idx) => (
                      <div key={idx} className="multi-photo-spec-box">
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                          {spec.label}
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                          {spec.value}
                        </span>
                        {spec.sub && <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{spec.sub}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {slide.keyPoints && (
                  <div className="hero-keypoints-list">
                    {slide.keyPoints.map((point, idx) => (
                      <div key={idx} className="hero-keypoint-item">
                        <CheckCircle2 size={16} color="#00f0aa" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="multi-photo-image-preview">
                {slide.images[0] && (
                  <div
                    className="preview-container-box"
                    onClick={() => handleImageZoom(slide.images[0].url)}
                    style={{ cursor: 'pointer' }}
                    title="Click để phóng to bố cục"
                  >
                    <img src={slide.images[0].url} alt={slide.title} />
                    {slide.images[0].dimensions && (
                      <div className="image-floating-badge">
                        📏 {slide.images[0].dimensions}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. INTERACTIVE COLOR PICKER LAYOUT */}
          {slide.layoutType === 'interactive_color' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', height: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <p className="hero-primary-text">{slide.primaryText}</p>
                {slide.keyPoints && (
                  <div className="hero-keypoints-list">
                    {slide.keyPoints.map((point, idx) => (
                      <div key={idx} className="hero-keypoint-item">
                        <div className="hero-keypoint-bullet" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <InteractiveColorPicker />
                {slide.images[0] && (
                  <div
                    className="glass-panel"
                    style={{ padding: '8px', borderRadius: '12px', height: '140px', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => handleImageZoom(slide.images[0].url)}
                  >
                    <img src={slide.images[0].url} alt="Figma Palette" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. INTERACTIVE 3D LIGHT STUDIO LAYOUT */}
          {slide.layoutType === 'interactive_3d' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '32px', height: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <p className="hero-primary-text">{slide.primaryText}</p>
                {slide.keyPoints && (
                  <div className="hero-keypoints-list">
                    {slide.keyPoints.map((point, idx) => (
                      <div key={idx} className="hero-keypoint-item">
                        <Sparkles size={16} color="#ffbd59" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <InteractiveLightStudio />
              </div>
            </div>
          )}

          {/* 6. POSTER BREAKDOWN & WIREFRAME COMPARISON */}
          {slide.layoutType === 'poster_breakdown' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '32px', height: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <p className="hero-primary-text">{slide.primaryText}</p>

                <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '10px', width: 'fit-content' }}>
                  <button
                    onClick={() => setActiveBreakdownTab('both')}
                    style={{
                      background: activeBreakdownTab === 'both' ? '#38b6ff' : 'transparent',
                      color: activeBreakdownTab === 'both' ? '#07090e' : '#cbd5e1',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Song song
                  </button>
                  <button
                    onClick={() => setActiveBreakdownTab('sketch')}
                    style={{
                      background: activeBreakdownTab === 'sketch' ? '#38b6ff' : 'transparent',
                      color: activeBreakdownTab === 'sketch' ? '#07090e' : '#cbd5e1',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Lưới Phác Thảo
                  </button>
                  <button
                    onClick={() => setActiveBreakdownTab('analysis')}
                    style={{
                      background: activeBreakdownTab === 'analysis' ? '#38b6ff' : 'transparent',
                      color: activeBreakdownTab === 'analysis' ? '#07090e' : '#cbd5e1',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Bounding Boxes
                  </button>
                </div>

                {slide.keyPoints && (
                  <div className="hero-keypoints-list">
                    {slide.keyPoints.map((point, idx) => (
                      <div key={idx} className="hero-keypoint-item">
                        <Layers size={16} color="#38b6ff" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: activeBreakdownTab === 'both' ? '1fr 1fr' : '1fr', gap: '14px' }}>
                {(activeBreakdownTab === 'both' || activeBreakdownTab === 'sketch') && slide.images[0] && (
                  <div
                    className="preview-container-box"
                    onClick={() => handleImageZoom(slide.images[0].url)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={slide.images[0].url} alt="Sketch" />
                    <div className="image-floating-badge">1. Bản Phác Thảo Lưới</div>
                  </div>
                )}
                {(activeBreakdownTab === 'both' || activeBreakdownTab === 'analysis') && slide.images[1] && (
                  <div
                    className="preview-container-box"
                    onClick={() => handleImageZoom(slide.images[1].url)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={slide.images[1].url} alt="Breakdown" />
                    <div className="image-floating-badge" style={{ color: '#ff5757' }}>2. Bóc Tách Bounding Boxes</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. SIDE BY SIDE & FULL VISUAL */}
          {(slide.layoutType === 'side_by_side' || slide.layoutType === 'exercise_task') && (
            <div className="layout-side-by-side">
              <div className="side-text-col">
                <p className="hero-primary-text">{slide.primaryText}</p>

                {slide.keyPoints && (
                  <div className="hero-keypoints-list">
                    {slide.keyPoints.map((point, idx) => (
                      <div key={idx} className="hero-keypoint-item">
                        <CheckCircle2 size={16} color="#38b6ff" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {slide.specs && (
                  <div className="hero-specs-row">
                    {slide.specs.map((spec, idx) => (
                      <div key={idx} className="hero-spec-card">
                        <span className="hero-spec-label">{spec.label}</span>
                        <span className="hero-spec-value">{spec.value}</span>
                        {spec.sub && <span className="hero-spec-sub">{spec.sub}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="side-visual-col">
                {slide.images.length === 1 && (
                  <div
                    className="hero-image-card"
                    onClick={() => handleImageZoom(slide.images[0].url)}
                    style={{ cursor: 'pointer', maxHeight: '520px' }}
                  >
                    <img src={slide.images[0].url} alt={slide.title} />
                    {slide.images[0].caption && (
                      <div className="image-floating-badge">{slide.images[0].caption}</div>
                    )}
                  </div>
                )}

                {slide.images.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${slide.images.length}, 1fr)`, gap: '14px', width: '100%' }}>
                    {slide.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="hero-image-card"
                        onClick={() => handleImageZoom(img.url)}
                        style={{ cursor: 'pointer', maxHeight: '460px' }}
                      >
                        <img src={img.url} alt={img.caption || `Image ${idx + 1}`} />
                        {img.badge && <div className="image-floating-badge">{img.badge}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. GALLERY GRID (3+ IMAGES) */}
          {slide.layoutType === 'gallery_grid' && (
            <div className="layout-gallery-grid">
              <p className="hero-primary-text">{slide.primaryText}</p>

              <div className="gallery-cards-row">
                {slide.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="gallery-item-card"
                    onClick={() => handleImageZoom(img.url)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="gallery-item-image-wrapper">
                      <img src={img.url} alt={img.caption || `Card ${idx + 1}`} />
                    </div>
                    <div className="gallery-item-caption">
                      <span>{img.caption || `Graphic Element ${idx + 1}`}</span>
                      {img.badge && <span className="badge-tag" style={{ fontSize: '0.65rem' }}>{img.badge}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. SOCIAL MOCKUP & THEORY GRID */}
          {(slide.layoutType === 'social_mockup' || slide.layoutType === 'theory_grid') && (
            <div className="layout-side-by-side">
              <div className="side-text-col">
                <p className="hero-primary-text">{slide.primaryText}</p>

                {slide.keyPoints && (
                  <div className="hero-keypoints-list">
                    {slide.keyPoints.map((point, idx) => (
                      <div key={idx} className="hero-keypoint-item">
                        <div className="hero-keypoint-bullet" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {slide.rules && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                    {slide.rules.map((rule, idx) => (
                      <div key={idx} className="hero-spec-card" style={{ borderLeft: '3px solid #ffbd59' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{rule.title}</span>
                          {rule.badge && <span className="badge-tag badge-tag-amber" style={{ fontSize: '0.65rem' }}>{rule.badge}</span>}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>{rule.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="side-visual-col">
                {slide.images[0] && (
                  <div
                    className="hero-image-card"
                    onClick={() => handleImageZoom(slide.images[0].url)}
                    style={{ cursor: 'pointer', maxHeight: '520px' }}
                  >
                    <img src={slide.images[0].url} alt={slide.title} />
                    {slide.images[0].caption && (
                      <div className="image-floating-badge">{slide.images[0].caption}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Enlarged Visual Lightbox with Multi-image Navigation */}
      {zoomModalUrl && (
        <div
          className="image-lightbox-overlay"
          onClick={() => setZoomModalUrl(null)}
        >
          {/* Close button */}
          <button
            className="lightbox-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setZoomModalUrl(null);
            }}
            title="Đóng (Esc)"
            aria-label="Đóng"
          >
            <X size={22} />
          </button>

          {/* Previous Arrow Button (shown when slide has 2+ images) */}
          {hasMultipleImages && (
            <button
              className="lightbox-nav-arrow lightbox-nav-prev"
              onClick={handlePrevImage}
              title="Ảnh trước (ArrowLeft)"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Image Display Area */}
          <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomModalUrl}
              alt={currentImages[zoomImageIndex]?.caption || "Enlarged Visual"}
              className="lightbox-image"
            />
            {hasMultipleImages && (
              <div className="lightbox-indicator-bar">
                <span className="lightbox-counter-badge">
                  {zoomImageIndex + 1} / {currentImages.length}
                </span>
                {currentImages[zoomImageIndex]?.caption && (
                  <span className="lightbox-caption-text">
                    {currentImages[zoomImageIndex].caption}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Next Arrow Button (shown when slide has 2+ images) */}
          {hasMultipleImages && (
            <button
              className="lightbox-nav-arrow lightbox-nav-next"
              onClick={handleNextImage}
              title="Ảnh kế tiếp (ArrowRight)"
              aria-label="Ảnh kế tiếp"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
