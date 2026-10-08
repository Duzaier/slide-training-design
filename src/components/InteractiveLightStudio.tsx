import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Play, 
  Pause, 
  Compass, 
  Layers, 
  Eye, 
  Palette,
  Maximize2,
  Minimize2
} from 'lucide-react';

type MaterialPreset = 'plaster' | 'obsidian' | 'gold' | 'clay' | 'cyberpunk';

interface MaterialConfig {
  name: string;
  desc: string;
  color: number;
  roughness: number;
  metalness: number;
  clearcoat?: number;
}

const MATERIAL_PRESETS: Record<MaterialPreset, MaterialConfig> = {
  plaster: {
    name: 'Thạch Cao Mỹ Thuật',
    desc: 'Màu trắng ngà khuếch tán mềm chuẩn giáo trình hình họa.',
    color: 0xe8ecf4,
    roughness: 0.82,
    metalness: 0.02
  },
  obsidian: {
    name: 'Obsidian Đen Bóng',
    desc: 'Bề mặt khoáng thạch đen bóng, tương phản gắt & phản xạ sắc nét.',
    color: 0x141a28,
    roughness: 0.18,
    metalness: 0.85,
    clearcoat: 0.6
  },
  gold: {
    name: 'Kim Loại Vàng',
    desc: 'Bề mặt kim loại óng ánh với ánh sắc phản chiếu rực rỡ.',
    color: 0xf5b941,
    roughness: 0.32,
    metalness: 0.92
  },
  clay: {
    name: 'Đất Sét Terracotta',
    desc: 'Màu đất nung mộc mạc với độ nhám bề mặt tự nhiên.',
    color: 0xd76e50,
    roughness: 0.9,
    metalness: 0.02
  },
  cyberpunk: {
    name: 'Neon Cyber Blue',
    desc: 'Chất liệu sci-fi hiện đại phản chiếu ánh xanh công nghệ.',
    color: 0x124baf,
    roughness: 0.28,
    metalness: 0.65,
    clearcoat: 0.4
  }
};

export const InteractiveLightStudio: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Angle state for UI HUD
  const [azimuthDeg, setAzimuthDeg] = useState<number>(45);
  const [elevationDeg, setElevationDeg] = useState<number>(45);
  const [lightDistance, setLightDistance] = useState<number>(4.2);
  const [lightIntensity, setLightIntensity] = useState<number>(45);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialPreset>('plaster');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Exit fullscreen on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Real-time lighting face intensities for anatomical diagnostics
  const [faceDiagnostics, setFaceDiagnostics] = useState<{
    highlightFace: string;
    highlightVal: number;
    midtoneFace: string;
    midtoneVal: number;
    coreShadowFace: string;
    coreShadowVal: number;
    shadowLengthStr: string;
  }>({
    highlightFace: 'Mặt Trên (Top)',
    highlightVal: 92,
    midtoneFace: 'Mặt Phải (Right)',
    midtoneVal: 68,
    coreShadowFace: 'Mặt Trái (Left)',
    coreShadowVal: 15,
    shadowLengthStr: '100%'
  });

  // Imperative refs for Three.js state to bypass React render overhead in animation loops
  const stateRef = useRef({
    azimuth: (45 * Math.PI) / 180,
    elevation: (45 * Math.PI) / 180,
    distance: 4.2,
    intensity: 45,
    isAutoRotate: false,
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    material: 'plaster' as MaterialPreset
  });

  // Sync React states to ref
  useEffect(() => {
    stateRef.current.isAutoRotate = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    stateRef.current.distance = lightDistance;
  }, [lightDistance]);

  useEffect(() => {
    stateRef.current.intensity = lightIntensity;
  }, [lightIntensity]);

  useEffect(() => {
    stateRef.current.material = selectedMaterial;
  }, [selectedMaterial]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 700;
    let height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = null; // transparent to blend with slide cosmos

    // 2. Fixed Isometric-Perspective Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.8, 4.0, 4.8);
    camera.lookAt(0, 0.7, 0);

    // 3. WebGL Renderer with High-Quality PCF Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 4. Subtle Hemisphere & Ambient Lights (Physically subtle fill)
    const hemiLight = new THREE.HemisphereLight(0x22385c, 0x080e18, 0.35);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambientLight);

    // 5. Receiving Ground Surface (Floor)
    const groundGeo = new THREE.PlaneGeometry(24, 24, 1, 1);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b1122,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Floor Grid Helper for 3D spatial depth
    const grid = new THREE.GridHelper(20, 20, 0x38b6ff, 0x182848);
    grid.position.y = 0.001;
    (grid.material as THREE.Material).opacity = 0.35;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // 6. Central 3D Box (BoxGeometry)
    const boxSize = 1.6;
    const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxMat = new THREE.MeshPhysicalMaterial({
      color: MATERIAL_PRESETS.plaster.color,
      roughness: MATERIAL_PRESETS.plaster.roughness,
      metalness: MATERIAL_PRESETS.plaster.metalness,
      clearcoat: 0.0
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(0, boxSize / 2, 0); // resting exactly on the ground
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);

    // 7. Dynamic Point Light (Physical Point Light with Inverse-Square Decay)
    const pointLight = new THREE.PointLight(0xffffff, 45, 20, 2);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    pointLight.shadow.camera.near = 0.2;
    pointLight.shadow.camera.far = 20;
    pointLight.shadow.bias = -0.0003;
    pointLight.shadow.normalBias = 0.02; // Eliminate shadow acne & light bleeding
    pointLight.shadow.radius = 2.5; // Soft shadow edge
    scene.add(pointLight);

    // 8. Light Source Visual Marker (Emissive Glowing Orb)
    const markerGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lightMarker = new THREE.Mesh(markerGeo, markerMat);
    scene.add(lightMarker);

    // Orbit Ring Helper around the box
    const ringGeo = new THREE.RingGeometry(4.18, 4.22, 64);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0x38b6ff, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.15 
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2;
    orbitRing.position.y = boxSize / 2;
    scene.add(orbitRing);

    // Subtle guide ray line from light to center of box
    const rayLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, boxSize / 2, 0)
    ]);
    const rayLineMat = new THREE.LineDashedMaterial({
      color: 0x38b6ff,
      dashSize: 0.15,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.4
    });
    const rayLine = new THREE.Line(rayLineGeo, rayLineMat);
    rayLine.computeLineDistances();
    scene.add(rayLine);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation & Render Loop
    let animationFrameId: number;
    let lastDiagUpdate = 0;

    const animate = (time: number) => {
      const s = stateRef.current;

      // Auto rotation
      if (s.isAutoRotate) {
        s.azimuth = (s.azimuth + 0.008) % (Math.PI * 2);
        setAzimuthDeg(Math.round((s.azimuth * 180) / Math.PI));
      }

      // Update light position from spherical coordinates
      const targetY = boxSize / 2;
      const lx = s.distance * Math.cos(s.elevation) * Math.sin(s.azimuth);
      const ly = targetY + s.distance * Math.sin(s.elevation);
      const lz = s.distance * Math.cos(s.elevation) * Math.cos(s.azimuth);

      pointLight.position.set(lx, ly, lz);
      pointLight.intensity = s.intensity;
      lightMarker.position.set(lx, ly, lz);

      // Update guide ray line
      const linePositions = rayLine.geometry.attributes.position as THREE.BufferAttribute;
      linePositions.setXYZ(0, lx, ly, lz);
      linePositions.setXYZ(1, 0, targetY, 0);
      linePositions.needsUpdate = true;
      rayLine.computeLineDistances();

      // Update material if changed
      const preset = MATERIAL_PRESETS[s.material];
      if (boxMat.color.getHex() !== preset.color) {
        boxMat.color.setHex(preset.color);
        boxMat.roughness = preset.roughness;
        boxMat.metalness = preset.metalness;
        boxMat.clearcoat = preset.clearcoat || 0;
        boxMat.needsUpdate = true;
      }

      // Render the true WebGL 3D Scene
      renderer.render(scene, camera);

      // Diagnostics Calculation (~10 FPS throttle to keep UI ultra-smooth)
      if (time - lastDiagUpdate > 100) {
        lastDiagUpdate = time;
        
        // Compute normalized light vector from box center
        const Lvec = new THREE.Vector3(lx, ly - targetY, lz).normalize();
        
        // Face normals
        const nTop = new THREE.Vector3(0, 1, 0);
        const nRight = new THREE.Vector3(1, 0, 0); // +X
        const nFront = new THREE.Vector3(0, 0, 1); // +Z
        const nLeft = new THREE.Vector3(-1, 0, 0); // -X
        const nBack = new THREE.Vector3(0, 0, -1); // -Z

        const dotTop = Math.max(0, nTop.dot(Lvec));
        const dotRight = Math.max(0, nRight.dot(Lvec));
        const dotFront = Math.max(0, nFront.dot(Lvec));
        const dotLeft = Math.max(0, nLeft.dot(Lvec));
        const dotBack = Math.max(0, nBack.dot(Lvec));

        const faces = [
          { name: 'Mặt Trên (Top)', val: Math.round((0.15 + dotTop * 0.85) * 100) },
          { name: 'Mặt Phải (+X Right)', val: Math.round((0.15 + dotRight * 0.85) * 100) },
          { name: 'Mặt Trước (+Z Front)', val: Math.round((0.15 + dotFront * 0.85) * 100) },
          { name: 'Mặt Trái (-X Left)', val: Math.round((0.15 + dotLeft * 0.85) * 100) },
          { name: 'Mặt Sau (-Z Back)', val: Math.round((0.15 + dotBack * 0.85) * 100) }
        ].sort((a, b) => b.val - a.val);

        const shadowFactor = Math.min(3.5, 1 / Math.max(0.15, Math.tan(Math.max(0.1, s.elevation))));

        setFaceDiagnostics({
          highlightFace: faces[0].name,
          highlightVal: faces[0].val,
          midtoneFace: faces[1].name,
          midtoneVal: faces[1].val,
          coreShadowFace: faces[faces.length - 1].name,
          coreShadowVal: faces[faces.length - 1].val,
          shadowLengthStr: `${Math.round(shadowFactor * 100)}%`
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 11. Clean Lifecycle Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      // Dispose all GPU geometries, materials, and WebGL context
      boxGeo.dispose();
      boxMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      grid.dispose();
      markerGeo.dispose();
      markerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      rayLineGeo.dispose();
      rayLineMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Pointer Drag Handler (Pointer Capture API for smooth 1:1 control)
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    stateRef.current.isDragging = true;
    stateRef.current.prevPointerX = e.clientX;
    stateRef.current.prevPointerY = e.clientY;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stateRef.current.isDragging) return;

    const deltaX = e.clientX - stateRef.current.prevPointerX;
    const deltaY = e.clientY - stateRef.current.prevPointerY;
    stateRef.current.prevPointerX = e.clientX;
    stateRef.current.prevPointerY = e.clientY;

    const sensitivity = 0.008;

    // Dragging right -> rotate light towards right on screen (inverted theta for camera perspective)
    stateRef.current.azimuth = (stateRef.current.azimuth - deltaX * sensitivity) % (Math.PI * 2);
    if (stateRef.current.azimuth < 0) stateRef.current.azimuth += Math.PI * 2;

    // Dragging up -> increase elevation, dragging down -> decrease elevation
    const minElev = (-80 * Math.PI) / 180;
    const maxElev = (85 * Math.PI) / 180;
    stateRef.current.elevation = Math.max(minElev, Math.min(maxElev, stateRef.current.elevation - deltaY * sensitivity));

    // Update UI states
    const curAzDeg = Math.round((stateRef.current.azimuth * 180) / Math.PI) % 360;
    const curElDeg = Math.round((stateRef.current.elevation * 180) / Math.PI);
    setAzimuthDeg(curAzDeg);
    setElevationDeg(curElDeg);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    stateRef.current.isDragging = false;
    setIsDragging(false);
  };

  // Slider change handlers
  const handleAzimuthSlider = (val: number) => {
    setAzimuthDeg(val);
    stateRef.current.azimuth = (val * Math.PI) / 180;
  };

  const handleElevationSlider = (val: number) => {
    setElevationDeg(val);
    stateRef.current.elevation = (val * Math.PI) / 180;
  };

  // Quick preset angle buttons
  const applyPreset = (az: number, el: number) => {
    setAzimuthDeg(az);
    setElevationDeg(el);
    stateRef.current.azimuth = (az * Math.PI) / 180;
    stateRef.current.elevation = (el * Math.PI) / 180;
  };

  return (
    <div className="cube-studio-stage">
      {/* Studio Header Action Toolbar (Clean Minimalist Bar) */}
      <div className="cube-studio-header cube-studio-header-minimal">
        <div className="cube-studio-actions-row">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`cube-studio-btn ${isAutoRotate ? 'btn-active' : ''}`}
            title="Tự động xoay nguồn sáng 360°"
          >
            {isAutoRotate ? <Pause size={15} /> : <Play size={15} />}
            <span>{isAutoRotate ? 'Dừng xoay' : 'Tự động xoay 360°'}</span>
          </button>
          
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`cube-studio-btn ${showAnnotations ? 'btn-active' : ''}`}
            title="Bật/Tắt bảng phân tích quang học"
          >
            <Eye size={15} />
            <span>{showAnnotations ? 'Ẩn phân tích' : 'Hiện phân tích'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`cube-studio-btn cube-btn-fullscreen ${isFullscreen ? 'btn-active' : ''}`}
            title="Mở rộng không gian 3D toàn màn hình"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span>{isFullscreen ? 'Thu nhỏ (Esc)' : 'Mở rộng toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="cube-studio-viewport-grid">
        {/* LEFT / CENTER: Grand True 3D WebGL Canvas Viewport */}
        <div 
          className={`cube-viewport-container realistic-viewport grand-viewport ${isFullscreen ? 'fullscreen-3d-active' : ''}`}
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          title="Kéo giữ chuột trực tiếp trên canvas để di chuyển nguồn sáng 360° quanh khối hộp"
        >
          {/* Hardware-Accelerated 3D WebGL Canvas */}
          <canvas ref={canvasRef} className="webgl-3d-canvas" />

          {/* Fullscreen Mode Top-Left Floating Controls */}
          {isFullscreen && (
            <div className="fullscreen-overlay-controls">
              <button 
                className="fullscreen-floating-btn"
                onClick={() => setIsFullscreen(false)}
                title="Thu nhỏ chế độ toàn màn hình (Esc)"
              >
                <Minimize2 size={16} />
                <span>Thu nhỏ (Esc)</span>
              </button>
            </div>
          )}

          {/* Viewport Floating HUD Indicators */}
          <div className="cube-compass-overlay">
            <Compass size={14} color="#38b6ff" />
            <span>
              Azimuth: <strong>{azimuthDeg}°</strong> • Elevation: <strong>{elevationDeg}°</strong> • R: <strong>{lightDistance.toFixed(1)}m</strong>
            </span>
          </div>

          <div className="viewport-drag-hint">
            <Maximize2 size={12} />
            <span>Kéo chuột trên màn hình 3D để di chuyển đèn</span>
          </div>
        </div>

        {/* RIGHT PANEL: Lighting Controls & Optical Anatomy Breakdown */}
        <div className="cube-controls-panel">
          {/* Panel 1: Master Orbit & Intensity Controls */}
          <div className="cube-panel-card">
            <h3 className="cube-card-title">
              <RotateCw size={16} color="#38b6ff" />
              <span>ĐIỀU KHIỂN NGUỒN SÁNG 360° × 180°</span>
            </h3>

            {/* Azimuth 360 Slider */}
            <div className="cube-slider-group">
              <div className="cube-slider-label-row">
                <span className="label-text">Phương vị ngang (Azimuth 0° - 360°)</span>
                <span className="cube-slider-val">{azimuthDeg}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={azimuthDeg} 
                onChange={(e) => handleAzimuthSlider(parseFloat(e.target.value))}
                className="cube-custom-slider slider-azimuth"
              />
            </div>

            {/* Elevation Slider */}
            <div className="cube-slider-group">
              <div className="cube-slider-label-row">
                <span className="label-text">Độ cao dọc (Elevation -80° đến +85°)</span>
                <span className="cube-slider-val">{elevationDeg}°</span>
              </div>
              <input 
                type="range" 
                min="-80" 
                max="85" 
                value={elevationDeg} 
                onChange={(e) => handleElevationSlider(parseFloat(e.target.value))}
                className="cube-custom-slider slider-elevation"
              />
            </div>

            {/* Distance & Intensity Row */}
            <div className="cube-slider-double-row">
              <div className="cube-slider-group">
                <div className="cube-slider-label-row">
                  <span className="label-text">Khoảng cách ({lightDistance.toFixed(1)}m)</span>
                </div>
                <input 
                  type="range" 
                  min="2.5" 
                  max="6.5" 
                  step="0.1"
                  value={lightDistance} 
                  onChange={(e) => setLightDistance(parseFloat(e.target.value))}
                  className="cube-custom-slider slider-softness"
                />
              </div>

              <div className="cube-slider-group">
                <div className="cube-slider-label-row">
                  <span className="label-text">Cường độ (Lumens)</span>
                  <span className="cube-slider-val">{lightIntensity}W</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="80" 
                  step="1"
                  value={lightIntensity} 
                  onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                  className="cube-custom-slider slider-temp"
                />
              </div>
            </div>

            {/* Quick Lighting Presets Grid */}
            <div className="cube-presets-label">Góc chiếu sáng tiêu chuẩn:</div>
            <div className="cube-presets-grid">
              <button 
                onClick={() => applyPreset(315, 45)} 
                className={`preset-chip ${azimuthDeg === 315 && elevationDeg === 45 ? 'chip-active' : ''}`}
              >
                Góc Phải 315° (Key Light)
              </button>
              <button 
                onClick={() => applyPreset(135, 45)} 
                className={`preset-chip ${azimuthDeg === 135 && elevationDeg === 45 ? 'chip-active' : ''}`}
              >
                Góc Trái 135° (Fill Light)
              </button>
              <button 
                onClick={() => applyPreset(azimuthDeg, 80)} 
                className={`preset-chip ${elevationDeg >= 78 ? 'chip-active' : ''}`}
              >
                Đỉnh Đầu 80° (Top Down)
              </button>
              <button 
                onClick={() => applyPreset(45, 30)} 
                className={`preset-chip ${azimuthDeg === 45 && elevationDeg === 30 ? 'chip-active' : ''}`}
              >
                Trước Mặt 45° (Front)
              </button>
              <button 
                onClick={() => applyPreset(225, 20)} 
                className={`preset-chip ${azimuthDeg === 225 ? 'chip-active' : ''}`}
              >
                Đằng Sau 225° (Rim Light)
              </button>
              <button 
                onClick={() => applyPreset(315, 15)} 
                className={`preset-chip ${elevationDeg <= 18 ? 'chip-active' : ''}`}
              >
                Hoàng Hôn 15° (Bóng dài)
              </button>
            </div>
          </div>

          {/* Panel 2: PBR Material Presets */}
          <div className="cube-panel-card">
            <h3 className="cube-card-title">
              <Palette size={16} color="#38b6ff" />
              <span>CHẤT LIỆU BỀ MẶT 3D (MESH PHYSICAL MATERIAL)</span>
            </h3>

            <div className="material-selector-grid">
              {(Object.keys(MATERIAL_PRESETS) as MaterialPreset[]).map((matKey) => {
                const item = MATERIAL_PRESETS[matKey];
                const isSelected = selectedMaterial === matKey;
                const colorHex = '#' + item.color.toString(16).padStart(6, '0');
                return (
                  <button
                    key={matKey}
                    onClick={() => setSelectedMaterial(matKey)}
                    className={`material-choice-btn ${isSelected ? 'choice-active' : ''}`}
                  >
                    <span 
                      className="material-color-dot" 
                      style={{ backgroundColor: colorHex }} 
                    />
                    <span className="material-name-text">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel 3: Real-Time Optical Anatomy Diagnostics */}
          {showAnnotations && (
            <div className="cube-panel-card">
              <h3 className="cube-card-title">
                <Layers size={16} color="#38b6ff" />
                <span>PHÂN TÍCH QUANG HỌC 4 VÙNG SẮC ĐỘ THỜI GIAN THỰC</span>
              </h3>

              <div className="cube-anatomy-list">
                <div className="cube-anatomy-item item-highlight">
                  <div className="anatomy-indicator" />
                  <div className="anatomy-info">
                    <div className="anatomy-header-row">
                      <strong>1. Highlight (Vùng Hứng Sáng Cực Đại)</strong>
                      <span className="anatomy-metric">{faceDiagnostics.highlightVal}% Lumens</span>
                    </div>
                    <p>Mặt <strong>{faceDiagnostics.highlightFace}</strong> vuông góc nhất với vectơ ánh sáng chính, hội tụ độ chói và phản xạ Specular mạnh nhất.</p>
                  </div>
                </div>

                <div className="cube-anatomy-item item-midtone">
                  <div className="anatomy-indicator" />
                  <div className="anatomy-info">
                    <div className="anatomy-header-row">
                      <strong>2. Midtone (Sắc Độ Chuyển Tiếp Trung Gian)</strong>
                      <span className="anatomy-metric">{faceDiagnostics.midtoneVal}% Lumens</span>
                    </div>
                    <p>Mặt <strong>{faceDiagnostics.midtoneFace}</strong> nhận góc chiếu xiên, tạo sắc độ trung gian định hình chiều sâu khối hộp 3D.</p>
                  </div>
                </div>

                <div className="cube-anatomy-item item-shadow">
                  <div className="anatomy-indicator" />
                  <div className="anatomy-info">
                    <div className="anatomy-header-row">
                      <strong>3. Core Shadow (Vùng Tối Cốt Lõi)</strong>
                      <span className="anatomy-metric">{faceDiagnostics.coreShadowVal}% Lumens</span>
                    </div>
                    <p>Mặt <strong>{faceDiagnostics.coreShadowFace}</strong> khuất sáng hoàn toàn, chỉ nhận ánh sáng tán xạ thứ cấp từ môi trường.</p>
                  </div>
                </div>

                <div className="cube-anatomy-item item-cast">
                  <div className="anatomy-indicator" />
                  <div className="anatomy-info">
                    <div className="anatomy-header-row">
                      <strong>4. Cast Shadow (Bóng Đổ Thời Gian Thực)</strong>
                      <span className="anatomy-metric">Độ vươn: {faceDiagnostics.shadowLengthStr}</span>
                    </div>
                    <p>Bóng đổ được tính toán thực tế bằng <strong>Three.js PCFSoftShadowMap</strong>, tự động dài ra khi hạ thấp đèn và thu gọn khi nâng cao đỉnh đầu.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
