import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CosmicIntroConfig, DEFAULT_INTRO_CONFIG, getTotalIntroDuration } from './cosmicIntroConfig';

interface CosmicIntroCanvasProps {
  config?: CosmicIntroConfig;
  onProgress?: (progress: number, stageName: string) => void;
  onComplete?: () => void;
  onError?: (err: any) => void;
  isSkipped?: boolean;
}

export const CosmicIntroCanvas: React.FC<CosmicIntroCanvasProps> = ({
  config = DEFAULT_INTRO_CONFIG,
  onProgress,
  onComplete,
  onError,
  isSkipped = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isCleanedUpRef = useRef<boolean>(false);

  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    console.log('[CosmicIntro] Initializing Photorealistic CosmicIntroCanvas V2 renderer...');
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('[CosmicIntro] Canvas element ref is null!');
      return;
    }
    isCleanedUpRef.current = false;

    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;

    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];
    const texturesToDispose: THREE.Texture[] = [];

    const totalDuration = getTotalIntroDuration(config);
    const startTime = performance.now();

    let is3DMode = false;
  // -------------------------------------------------------------
  // SKIP LOGIC: If the intro should be skipped, invoke onComplete and abort setup
  // -------------------------------------------------------------
  if (isSkipped) {
    console.log('[CosmicIntro] Skipping intro as isSkipped flag is true.');
    if (onCompleteRef.current) onCompleteRef.current();
    return; // Exit useEffect early, cleanup will run on unmount
  }

    // -------------------------------------------------------------
    // 1. THREE.JS WEBGL RENDERER & FILMIC TONE MAPPING SETUP
    // -------------------------------------------------------------
    try {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x010206);

      camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 2000);
      camera.position.set(0, 0, 36);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: false,
        alpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      // Film-VFX Filmic Tone Mapping & SRGB Color Space
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      is3DMode = true;
    } catch (webglErr) {
      console.warn('WebGL 3D Context not available -> Switching to 2D Canvas Engine fallback:', webglErr);
      is3DMode = false;
    }

    // -------------------------------------------------------------
    // 2. 3D SCENE OBJECTS & PROCEDURAL TEXTURE GENERATION
    // -------------------------------------------------------------
    let starField3D: THREE.Points | null = null;
    let starGeometry3D: THREE.BufferGeometry | null = null;
    let starMaterial3D: THREE.PointsMaterial | null = null;
    let starBaseX3D: Float32Array = new Float32Array(0);
    let starBaseY3D: Float32Array = new Float32Array(0);
    let starBaseZ3D: Float32Array = new Float32Array(0);

    let fgStarField3D: THREE.Points | null = null;

    let blackHoleGroup3D: THREE.Group | null = null;
    let accretionDisk3D: THREE.Mesh | null = null;
    let outerAccretionDisk: THREE.Mesh | null = null;
    let lensingHaloUpper: THREE.Mesh | null = null;
    let lensingHaloLower: THREE.Mesh | null = null;
    let diskMat3D: THREE.MeshBasicMaterial | null = null;
    let outerDiskMat: THREE.MeshBasicMaterial | null = null;
    let rimMat3D: THREE.MeshBasicMaterial | null = null;
    let lensMatUpper: THREE.MeshBasicMaterial | null = null;
    let lensMatLower: THREE.MeshBasicMaterial | null = null;

    let nebulaMesh1: THREE.Mesh | null = null;
    let nebulaMesh2: THREE.Mesh | null = null;
    let nebulaMesh3: THREE.Mesh | null = null;
    let nebulaMat1: THREE.MeshBasicMaterial | null = null;
    let nebulaMat2: THREE.MeshBasicMaterial | null = null;
    let nebulaMat3: THREE.MeshBasicMaterial | null = null;

    let singularityCore3D: THREE.Mesh | null = null;
    let coreMat3D: THREE.MeshBasicMaterial | null = null;

    let shockwaveMesh3D: THREE.Mesh | null = null;
    let shockMat3D: THREE.MeshBasicMaterial | null = null;
    let shockwaveMesh2: THREE.Mesh | null = null;
    let shockMat2: THREE.MeshBasicMaterial | null = null;

    let expGeo3D: THREE.BufferGeometry | null = null;
    let expMat3D: THREE.PointsMaterial | null = null;
    let expDirections3D: Float32Array = new Float32Array(0);
    let expSpeeds3D: Float32Array = new Float32Array(0);
    let expCount3D = 0;
    let starCount3D = 0;

    if (is3DMode && scene && camera && renderer) {
      try {
        // -----------------------------------------------------------
        // PROCEDURAL TEXTURE GENERATOR 1: SOFT PARTICLE GLOW
        // -----------------------------------------------------------
        const createParticleGlowTexture = (size = 128) => {
          const c = document.createElement('canvas');
          c.width = size; c.height = size;
          const ctx = c.getContext('2d');
          if (ctx) {
            const cx = size / 2, cy = size / 2;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            grad.addColorStop(0.18, 'rgba(255, 235, 245, 0.95)');
            grad.addColorStop(0.40, 'rgba(56, 182, 255, 0.75)');
            grad.addColorStop(0.70, 'rgba(168, 85, 247, 0.30)');
            grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, cx, 0, Math.PI * 2);
            ctx.fill();
          }
          const tex = new THREE.CanvasTexture(c);
          texturesToDispose.push(tex);
          return tex;
        };

        const particleTexture = createParticleGlowTexture(128);

        // -----------------------------------------------------------
        // PROCEDURAL TEXTURE GENERATOR 2: MULTI-SCALE VOLUMETRIC NEBULA
        // -----------------------------------------------------------
        const createVolumetricNebulaTexture = (width = 1024, height = 1024) => {
          const c = document.createElement('canvas');
          c.width = width; c.height = height;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, width, height);

            // Domain-warped organic cloud masses
            for (let i = 0; i < 18; i++) {
              const cx = (0.15 + Math.random() * 0.7) * width;
              const cy = (0.15 + Math.random() * 0.7) * height;
              const radius = (0.18 + Math.random() * 0.38) * Math.min(width, height);

              const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
              const colorChoices = [
                ['rgba(56, 182, 255, 0.50)', 'rgba(168, 85, 247, 0.28)', 'rgba(0,0,0,0)'],
                ['rgba(232, 121, 249, 0.55)', 'rgba(59, 7, 100, 0.32)', 'rgba(0,0,0,0)'],
                ['rgba(56, 249, 215, 0.45)', 'rgba(12, 18, 38, 0.22)', 'rgba(0,0,0,0)'],
                ['rgba(245, 158, 70, 0.40)', 'rgba(120, 30, 90, 0.20)', 'rgba(0,0,0,0)']
              ];
              const cols = colorChoices[i % colorChoices.length];

              grad.addColorStop(0, cols[0]);
              grad.addColorStop(0.48, cols[1]);
              grad.addColorStop(1, cols[2]);

              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, Math.PI * 2);
              ctx.fill();
            }

            // High-frequency gas filaments & dust tendrils
            ctx.lineWidth = 2.0;
            for (let i = 0; i < 64; i++) {
              ctx.beginPath();
              const startX = Math.random() * width;
              const startY = Math.random() * height;
              const cp1x = startX + (Math.random() - 0.5) * 450;
              const cp1y = startY + (Math.random() - 0.5) * 450;
              const endX = startX + (Math.random() - 0.5) * 700;
              const endY = startY + (Math.random() - 0.5) * 700;

              ctx.strokeStyle = i % 3 === 0 
                ? 'rgba(232, 121, 249, 0.22)' 
                : (i % 2 === 0 ? 'rgba(56, 182, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)');
              ctx.moveTo(startX, startY);
              ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
              ctx.stroke();
            }

            // Dark absorbing dust lane shadows
            for (let i = 0; i < 6; i++) {
              const cx = Math.random() * width;
              const cy = Math.random() * height;
              const r = 80 + Math.random() * 180;
              const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
              grad.addColorStop(0, 'rgba(1, 2, 6, 0.70)');
              grad.addColorStop(1, 'rgba(1, 2, 6, 0)');
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(cx, cy, r, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          const tex = new THREE.CanvasTexture(c);
          texturesToDispose.push(tex);
          return tex;
        };

        const nebulaTexture = createVolumetricNebulaTexture(1024, 1024);

        // -----------------------------------------------------------
        // PROCEDURAL TEXTURE GENERATOR 3: PHOTOREALISTIC ACCRETION DISK (REF 1)
        // Includes Relativistic Doppler Beaming Asymmetry & Filamentary Plasma
        // -----------------------------------------------------------
        const createPhotorealisticDiskTexture = () => {
          const c = document.createElement('canvas');
          c.width = 1024; c.height = 1024;
          const ctx = c.getContext('2d');
          if (ctx) {
            const cx = 512, cy = 512;
            
            // Base radial thermal gradient: Dark core -> Electric Cyan -> Violet/Pink fringe

            // Updated radial gradient: Dark core -> Electric Cyan -> Violet/Pink fringe
            const grad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 495);
            grad.addColorStop(0, 'rgba(0,0,0,0)'); // center transparent
            grad.addColorStop(0.15, 'rgba(56, 182, 255, 0.85)'); // Electric cyan inner
            grad.addColorStop(0.45, 'rgba(168, 85, 247, 0.70)'); // Purple-pink mid
            grad.addColorStop(0.75, 'rgba(247, 120, 210, 0.55)'); // Soft pink outer
            grad.addColorStop(1.0, 'rgba(0,0,0,0)'); // edge transparent
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.16, 'rgba(255, 255, 255, 1.0)');  // Pure white inner photon sphere edge
            grad.addColorStop(0.30, 'rgba(190, 240, 255, 0.96)'); // Relativistic Ice-cyan inner flow
            grad.addColorStop(0.52, 'rgba(245, 158, 70, 0.88)');  // High-temperature copper amber plasma
            grad.addColorStop(0.72, 'rgba(215, 95, 30, 0.68)');   // Fiery orange turbulent boundary
            grad.addColorStop(0.88, 'rgba(147, 51, 234, 0.40)');  // Deep magenta outer fringe
            grad.addColorStop(1.0, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, 495, 0, Math.PI * 2);
            ctx.fill();

            // Relativistic Doppler Beaming Asymmetry (Approaching left edge boosted white-cyan, receding right edge dark copper)
            const dopplerGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
            dopplerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)'); // Approaching beam
            dopplerGrad.addColorStop(0.48, 'rgba(0, 0, 0, 0)');
            dopplerGrad.addColorStop(1.0, 'rgba(90, 35, 15, 0.45)');   // Receding side shadow
            ctx.fillStyle = dopplerGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, 495, 0, Math.PI * 2);
            ctx.fill();

            // High-frequency turbulent spiral plasma filaments (60+ spiraling arcs)
            ctx.lineWidth = 2.2;
            for (let i = 0; i < 72; i++) {
              ctx.beginPath();
              const ang = (i / 72) * Math.PI * 2;
              const radius = 125 + (i % 14) * 26;
              ctx.strokeStyle = i % 3 === 0 
                ? 'rgba(255, 255, 255, 0.80)' 
                : (i % 2 === 0 ? 'rgba(180, 240, 255, 0.60)' : 'rgba(245, 158, 70, 0.50)');
              ctx.arc(cx, cy, radius, ang, ang + Math.PI * 1.05);
              ctx.stroke();
            }

            // Luminous hotspots / knots in the inner plasma flow
            for (let i = 0; i < 24; i++) {
              const ang = Math.random() * Math.PI * 2;
              const r = 140 + Math.random() * 260;
              const kx = cx + Math.cos(ang) * r;
              const ky = cy + Math.sin(ang) * r;
              const kr = 4 + Math.random() * 12;

              const kGrad = ctx.createRadialGradient(kx, ky, 0, kx, ky, kr);
              kGrad.addColorStop(0, 'rgba(255, 255, 255, 0.90)');
              kGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
              ctx.fillStyle = kGrad;
              ctx.beginPath();
              ctx.arc(kx, ky, kr, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          const tex = new THREE.CanvasTexture(c);
          texturesToDispose.push(tex);
          return tex;
        };

        const diskTexture = createPhotorealisticDiskTexture();

        // -----------------------------------------------------------
        // 3. VOLUMETRIC NEBULA BACKGROUND PLANES (MULTI-DEPTH PARALLAX)
        // -----------------------------------------------------------
        const nebulaGroup3D = new THREE.Group();
        scene.add(nebulaGroup3D);

        const nebulaPlaneGeo = new THREE.PlaneGeometry(175, 110);
        geometriesToDispose.push(nebulaPlaneGeo);

        // Deep background layer (z = -45)
        nebulaMat1 = new THREE.MeshBasicMaterial({
          map: nebulaTexture,
          transparent: true,
          opacity: 0.50,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        materialsToDispose.push(nebulaMat1);
        nebulaMesh1 = new THREE.Mesh(nebulaPlaneGeo, nebulaMat1);
        nebulaMesh1.position.z = -45;
        nebulaGroup3D.add(nebulaMesh1);

        // Mid background layer (z = -25)
        nebulaMat2 = new THREE.MeshBasicMaterial({
          map: nebulaTexture,
          transparent: true,
          opacity: 0.38,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        materialsToDispose.push(nebulaMat2);
        nebulaMesh2 = new THREE.Mesh(nebulaPlaneGeo, nebulaMat2);
        nebulaMesh2.position.z = -25;
        nebulaMesh2.rotation.z = Math.PI * 0.42;
        nebulaMesh2.scale.set(1.35, 1.35, 1.35);
        nebulaGroup3D.add(nebulaMesh2);

        // Foreground subtle dust layer (z = -10)
        nebulaMat3 = new THREE.MeshBasicMaterial({
          map: nebulaTexture,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        materialsToDispose.push(nebulaMat3);
        nebulaMesh3 = new THREE.Mesh(nebulaPlaneGeo, nebulaMat3);
        nebulaMesh3.position.z = -10;
        nebulaMesh3.rotation.z = -Math.PI * 0.25;
        nebulaMesh3.scale.set(1.6, 1.6, 1.6);
        nebulaGroup3D.add(nebulaMesh3);

        // -----------------------------------------------------------
        // 4. MULTI-TIERED STARFIELD & COSMIC DUST ECOSYSTEM
        // -----------------------------------------------------------
        starCount3D = Math.max(config.starCount, 3200);
        const starPositions = new Float32Array(starCount3D * 3);
        starBaseX3D = new Float32Array(starCount3D);
        starBaseY3D = new Float32Array(starCount3D);
        starBaseZ3D = new Float32Array(starCount3D);
        const starColors = new Float32Array(starCount3D * 3);

        const palette = [
          new THREE.Color(0xffffff), // Pure White
          new THREE.Color(0x38b6ff), // Electric Cyan
          new THREE.Color(0xe879f9), // Bright Magenta
          new THREE.Color(0xa855f7), // Deep Violet
          new THREE.Color(0xffb03a), // Warm Copper Amber
          new THREE.Color(0x38f9d7)  // Bright Turquoise
        ];

        for (let i = 0; i < starCount3D; i++) {
          const x = (Math.random() - 0.5) * 125;
          const y = (Math.random() - 0.5) * 85;
          const z = -45 + Math.random() * 65;

          starBaseX3D[i] = x;
          starBaseY3D[i] = y;
          starBaseZ3D[i] = z;

          starPositions[i * 3] = x;
          starPositions[i * 3 + 1] = y;
          starPositions[i * 3 + 2] = z;

          const col = palette[Math.floor(Math.random() * palette.length)];
          starColors[i * 3] = col.r;
          starColors[i * 3 + 1] = col.g;
          starColors[i * 3 + 2] = col.b;
        }

        starGeometry3D = new THREE.BufferGeometry();
        starGeometry3D.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry3D.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        geometriesToDispose.push(starGeometry3D);

        starMaterial3D = new THREE.PointsMaterial({
          size: 2.6,
          vertexColors: true,
          map: particleTexture,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        materialsToDispose.push(starMaterial3D);

        starField3D = new THREE.Points(starGeometry3D, starMaterial3D);
        scene.add(starField3D);

        // Foreground Bright Stars Tier (800 dynamic glowing stars)
        const fgStarCount = 800;
        const fgPositions = new Float32Array(fgStarCount * 3);
        const fgColors = new Float32Array(fgStarCount * 3);
        for (let i = 0; i < fgStarCount; i++) {
          fgPositions[i * 3] = (Math.random() - 0.5) * 110;
          fgPositions[i * 3 + 1] = (Math.random() - 0.5) * 70;
          fgPositions[i * 3 + 2] = -20 + Math.random() * 35;

          const col = palette[i % palette.length];
          fgColors[i * 3] = col.r;
          fgColors[i * 3 + 1] = col.g;
          fgColors[i * 3 + 2] = col.b;
        }
        const fgGeo = new THREE.BufferGeometry();
        fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPositions, 3));
        fgGeo.setAttribute('color', new THREE.BufferAttribute(fgColors, 3));
        geometriesToDispose.push(fgGeo);

        const fgMat = new THREE.PointsMaterial({
          size: 4.8,
          vertexColors: true,
          map: particleTexture,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        materialsToDispose.push(fgMat);
        fgStarField3D = new THREE.Points(fgGeo, fgMat);
        scene.add(fgStarField3D);

        // -----------------------------------------------------------
        // 5. HERO OBJECT: RELATIVISTIC BLACK HOLE & GARGANTUA LENSING (REF 1)
        // -----------------------------------------------------------
        blackHoleGroup3D = new THREE.Group();
        blackHoleGroup3D.scale.set(0.9, 0.9, 0.9);
        scene.add(blackHoleGroup3D);

        // Pitch-black Event Horizon Sphere with Depth Writing (Occludes background)
        const horizonGeo = new THREE.SphereGeometry(3.3, 64, 64);
        const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        geometriesToDispose.push(horizonGeo);
        materialsToDispose.push(horizonMat);
        blackHoleGroup3D.add(new THREE.Mesh(horizonGeo, horizonMat));

        // Luminous Photon Sphere Rim Glow Shell
        const rimGeo = new THREE.SphereGeometry(3.48, 64, 64);
        rimMat3D = new THREE.MeshBasicMaterial({
          color: 0x38b6ff,
          transparent: true,
          opacity: 0.98,
          blending: THREE.AdditiveBlending
        });
        geometriesToDispose.push(rimGeo);
        materialsToDispose.push(rimMat3D);
        blackHoleGroup3D.add(new THREE.Mesh(rimGeo, rimMat3D));

        // Primary Inner Accretion Disk Mesh
        const diskGeo = new THREE.PlaneGeometry(30, 30, 48, 48);
        diskMat3D = new THREE.MeshBasicMaterial({
          map: diskTexture,
          transparent: true,
          opacity: 0.98,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        geometriesToDispose.push(diskGeo);
        materialsToDispose.push(diskMat3D);
        accretionDisk3D = new THREE.Mesh(diskGeo, diskMat3D);
        accretionDisk3D.rotation.x = Math.PI * 0.38;
        blackHoleGroup3D.add(accretionDisk3D);

        // Secondary Outer Filament Dust Disk Mesh
        const outerDiskGeo = new THREE.PlaneGeometry(46, 46, 48, 48);
        outerDiskMat = new THREE.MeshBasicMaterial({
          map: diskTexture,
          transparent: true,
          opacity: 0.60,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        geometriesToDispose.push(outerDiskGeo);
        materialsToDispose.push(outerDiskMat);
        outerAccretionDisk = new THREE.Mesh(outerDiskGeo, outerDiskMat);
        outerAccretionDisk.rotation.x = Math.PI * 0.38;
        blackHoleGroup3D.add(outerAccretionDisk);

        // Gravitational Lensing Halo Upper Arc (Interstellar Gargantua Style - Ref 1)
        const haloUpperGeo = new THREE.RingGeometry(3.4, 9.2, 128);
        lensMatUpper = new THREE.MeshBasicMaterial({
          map: diskTexture,
          transparent: true,
          opacity: 0.90,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        geometriesToDispose.push(haloUpperGeo);
        materialsToDispose.push(lensMatUpper);
        lensingHaloUpper = new THREE.Mesh(haloUpperGeo, lensMatUpper);
        lensingHaloUpper.rotation.x = Math.PI * 0.48;
        lensingHaloUpper.rotation.y = Math.PI * 0.05;
        blackHoleGroup3D.add(lensingHaloUpper);

        // Gravitational Lensing Halo Lower Arc
        const haloLowerGeo = new THREE.RingGeometry(3.4, 7.8, 128);
        lensMatLower = new THREE.MeshBasicMaterial({
          map: diskTexture,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        geometriesToDispose.push(haloLowerGeo);
        materialsToDispose.push(lensMatLower);
        lensingHaloLower = new THREE.Mesh(haloLowerGeo, lensMatLower);
        lensingHaloLower.rotation.x = -Math.PI * 0.48;
        lensingHaloLower.rotation.y = -Math.PI * 0.05;
        blackHoleGroup3D.add(lensingHaloLower);

        // Orbiting Celestial Planet Silhouette (Miller's Planet - Ref input_file_0.png)
        const planetGeo = new THREE.SphereGeometry(0.42, 32, 32);
        const planetMat = new THREE.MeshBasicMaterial({ color: 0x0a121e });
        geometriesToDispose.push(planetGeo);
        materialsToDispose.push(planetMat);
        const millerPlanetMesh = new THREE.Mesh(planetGeo, planetMat);
        millerPlanetMesh.position.set(-13.5, 2.8, -1.5);
        blackHoleGroup3D.add(millerPlanetMesh);

        // -----------------------------------------------------------
        // 6. BIG BANG EXPLOSION HARDWARE & SHOCKWAVE SHELLS (REF 3)
        // -----------------------------------------------------------
        // Singularity Core (Ref 3 - Golden White Center Flare)
        const coreGeo = new THREE.SphereGeometry(2.6, 48, 48);
        coreMat3D = new THREE.MeshBasicMaterial({
          color: 0xfff8e7,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        });
        geometriesToDispose.push(coreGeo);
        materialsToDispose.push(coreMat3D);
        singularityCore3D = new THREE.Mesh(coreGeo, coreMat3D);
        singularityCore3D.visible = false;
        scene.add(singularityCore3D);

        // Primary Inner Shockwave Shell (Electric Turquoise - Ref 3)
        const shockGeo = new THREE.RingGeometry(0.1, 1.0, 128);
        shockMat3D = new THREE.MeshBasicMaterial({
          color: 0x38f9d7,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        geometriesToDispose.push(shockGeo);
        materialsToDispose.push(shockMat3D);
        shockwaveMesh3D = new THREE.Mesh(shockGeo, shockMat3D);
        shockwaveMesh3D.visible = false;
        scene.add(shockwaveMesh3D);

        // Secondary Outer Shockwave Shell (Fiery Orange / Amber Boundary - Ref 3)
        const shockGeo2 = new THREE.RingGeometry(0.1, 1.0, 128);
        shockMat2 = new THREE.MeshBasicMaterial({
          color: 0xff6b00,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        geometriesToDispose.push(shockGeo2);
        materialsToDispose.push(shockMat2);
        shockwaveMesh2 = new THREE.Mesh(shockGeo2, shockMat2);
        shockwaveMesh2.visible = false;
        scene.add(shockwaveMesh2);

        // -----------------------------------------------------------
        // 7. MULTI-LAYERED BIG BANG EXPLOSION DEBRIS
        // -----------------------------------------------------------
        expCount3D = Math.max(config.explosionParticleCount, 4000);
        const expPositions = new Float32Array(expCount3D * 3);
        expDirections3D = new Float32Array(expCount3D * 3);
        expSpeeds3D = new Float32Array(expCount3D);
        const expColors = new Float32Array(expCount3D * 3);

        for (let i = 0; i < expCount3D; i++) {
          expPositions[i * 3] = 0;
          expPositions[i * 3 + 1] = 0;
          expPositions[i * 3 + 2] = 0;

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const speed = 16 + Math.random() * 70;

          expDirections3D[i * 3] = Math.sin(phi) * Math.cos(theta);
          expDirections3D[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
          expDirections3D[i * 3 + 2] = Math.cos(phi);
          expSpeeds3D[i] = speed;

          const col = palette[Math.floor(Math.random() * palette.length)];
          expColors[i * 3] = col.r;
          expColors[i * 3 + 1] = col.g;
          expColors[i * 3 + 2] = col.b;
        }

        expGeo3D = new THREE.BufferGeometry();
        expGeo3D.setAttribute('position', new THREE.BufferAttribute(expPositions, 3));
        expGeo3D.setAttribute('color', new THREE.BufferAttribute(expColors, 3));
        geometriesToDispose.push(expGeo3D);

        expMat3D = new THREE.PointsMaterial({
          size: 3.6,
          vertexColors: true,
          map: particleTexture,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        materialsToDispose.push(expMat3D);

        scene.add(new THREE.Points(expGeo3D, expMat3D));

      } catch (setupErr) {
        console.warn('3D Setup Error -> Falling back to 2D Canvas Mode:', setupErr);
        is3DMode = false;
      }
    }

    // -------------------------------------------------------------
    // 2D FALLBACK ENGINE DATA STRUCTURES
    // -------------------------------------------------------------
    const ctx2D = is3DMode ? null : canvas.getContext('2d');
    const numStars2D = 400;
    const stars2D = Array.from({ length: numStars2D }, () => ({
      x: (Math.random() - 0.5) * window.innerWidth * 1.5,
      y: (Math.random() - 0.5) * window.innerHeight * 1.5,
      r: Math.random() * 2.4 + 0.6,
      color: ['#ffffff', '#38b6ff', '#e879f9', '#ffb03a', '#38f9d7'][Math.floor(Math.random() * 5)]
    }));

    // -------------------------------------------------------------
    // MAIN ANIMATION RENDER LOOP (3D OR 2D)
    // -------------------------------------------------------------
    const renderLoop = (timestamp: number) => {
      if (isCleanedUpRef.current) return;

      const elapsedTime = (timestamp - startTime) / 1000;
      const normalizedProgress = Math.min(elapsedTime / totalDuration, 1.0);

      const tVoid = config.durationVoid; // 2.0s
      const tBH = tVoid + config.durationBlackHole; // 6.5s
      const tAbs = tBH + config.durationAbsorption; // 10.5s
      const tCol = tAbs + config.durationCollapse; // 12.5s
      const tBB = tCol + config.durationBigBang; // 15.0s
      const tRev = tBB + config.durationReveal; // 16.5s

      let stageName = 'ENTER THE VOID';

      if (elapsedTime < tVoid) stageName = 'ENTER THE VOID';
      else if (elapsedTime < tBH) stageName = 'BLACK HOLE FORMATION';
      else if (elapsedTime < tAbs) stageName = 'GRAVITATIONAL ABSORPTION';
      else if (elapsedTime < tCol) stageName = 'ENERGY COLLAPSE';
      else if (elapsedTime < tBB) {
        const pBigBang = (elapsedTime - tCol) / config.durationBigBang;
        if (pBigBang < 0.2) stageName = 'GRAVITATIONAL COLLAPSE';
        else if (pBigBang < 0.35) stageName = 'BIG BANG IGNITION';
        else if (pBigBang < 0.85) stageName = 'EXPANSION';
        else stageName = 'COSMIC REVEAL';
      } else if (elapsedTime < tRev) stageName = 'GALAXY REVEAL';
      else stageName = 'SLIDE TRANSITION';

      if (onProgressRef.current) {
        onProgressRef.current(normalizedProgress, stageName);
      }

      // -----------------------------------------------------------
      // EXECUTE 3D RENDER LOOP
      // -----------------------------------------------------------
      if (is3DMode && scene && camera && renderer) {
        try {
          // Differential accretion disk & lensing halo rotations
          if (accretionDisk3D) accretionDisk3D.rotation.z += 0.014;
          if (outerAccretionDisk) outerAccretionDisk.rotation.z += 0.006;
          if (lensingHaloUpper) lensingHaloUpper.rotation.z += 0.008;
          if (lensingHaloLower) lensingHaloLower.rotation.z -= 0.007;
          if (blackHoleGroup3D) blackHoleGroup3D.rotation.y += 0.004;

          // Volumetric Nebula Background Parallax Motion
          if (nebulaMesh1) nebulaMesh1.rotation.z += 0.0004;
          if (nebulaMesh2) nebulaMesh2.rotation.z -= 0.0003;
          if (nebulaMesh3) nebulaMesh3.rotation.z += 0.0002;

          // Phase 1: Enter the Void
          if (elapsedTime < tVoid) {
            const p = elapsedTime / tVoid;
            camera.position.z = 38 - p * 3;
            if (starMaterial3D) starMaterial3D.opacity = 0.95;
            if (blackHoleGroup3D) blackHoleGroup3D.scale.set(0.65 + p * 0.35, 0.65 + p * 0.35, 0.65 + p * 0.35);
            if (diskMat3D) diskMat3D.opacity = 0.75 + p * 0.23;
            if (rimMat3D) rimMat3D.opacity = 0.65 + p * 0.3;
          }
          // Phase 2: Black Hole Formation & Accretion Growth
          else if (elapsedTime < tBH) {
            const p = (elapsedTime - tVoid) / config.durationBlackHole;
            camera.position.z = 35 - p * 4;
            const bhScale = 1.0 + Math.sin(p * Math.PI * 0.5) * 0.35;
            if (blackHoleGroup3D) blackHoleGroup3D.scale.set(bhScale, bhScale, bhScale);
            if (diskMat3D) diskMat3D.opacity = 0.98;
            if (outerDiskMat) outerDiskMat.opacity = 0.60;
            if (lensMatUpper) lensMatUpper.opacity = 0.50 + p * 0.40;
            if (lensMatLower) lensMatLower.opacity = 0.40 + p * 0.35;
          }
          // Phase 3: Gravitational Absorption & Relativistic Vortex (Physics Spiral)
          else if (elapsedTime < tAbs) {
            const p = (elapsedTime - tBH) / config.durationAbsorption;
            camera.position.z = 31 - p * 5;

            if (starGeometry3D) {
              const posAttr = starGeometry3D.attributes.position as THREE.BufferAttribute;
              const posArr = posAttr.array as Float32Array;

              for (let i = 0; i < starCount3D; i++) {
                const bx = starBaseX3D[i];
                const by = starBaseY3D[i];
                const bz = starBaseZ3D[i];

                const currentDist = Math.sqrt(bx * bx + by * by);
                // Keplerian Keplerian spiral: angular velocity scales with r^-1.5
                const targetDist = Math.max(currentDist * Math.pow(1.0 - p, 1.4), 1.2);
                const keplerFactor = Math.pow(Math.max(currentDist, 1.0), -1.5) * 12.0;
                const angleOffset = p * (5.5 + keplerFactor);
                // When absorption is near completion, pull all particles directly to center
                if (p > 0.95) {
                  // Force positions to the black hole center
                  posArr[i * 3] = 0;
                  posArr[i * 3 + 1] = 0;
                  posArr[i * 3 + 2] = 0;
                }
                const originalAngle = Math.atan2(by, bx);
                const newAngle = originalAngle + angleOffset;

                posArr[i * 3] = targetDist * Math.cos(newAngle);
                posArr[i * 3 + 1] = targetDist * Math.sin(newAngle);
                posArr[i * 3 + 2] = bz * (1.0 - p * 0.88);
                // Fade out stars as they are absorbed
                if (starMaterial3D) {
                  starMaterial3D.opacity = Math.max(0, 1 - p);
                }
              }
              posAttr.needsUpdate = true;
            }

            if (accretionDisk3D) accretionDisk3D.rotation.z += 0.024 * (1.0 + p * 2.5);
            if (outerAccretionDisk) outerAccretionDisk.rotation.z += 0.012 * (1.0 + p * 2.0);
            if (blackHoleGroup3D) blackHoleGroup3D.scale.set(1.35 + p * 0.22, 1.35 + p * 0.22, 1.35 + p * 0.22);
          }
          // Phase 4: Energy Collapse
          else if (elapsedTime < tCol) {
            const p = (elapsedTime - tAbs) / config.durationCollapse;
            const collapseScale = Math.max((1.0 - p) * 1.57, 0.02);
            if (blackHoleGroup3D) blackHoleGroup3D.scale.set(collapseScale, collapseScale, collapseScale);

            if (singularityCore3D) {
              singularityCore3D.visible = true;
              const coreScale = Math.sin(p * Math.PI) * 4.8 + 0.1;
              singularityCore3D.scale.set(coreScale, coreScale, coreScale);
            }
            if (coreMat3D) coreMat3D.opacity = Math.min(p * 2.8, 1.0);
            if (starMaterial3D) starMaterial3D.opacity = (1.0 - p) * 0.3;
          }
          // Phase 5: Big Bang Explosion (Ref 3)
          else if (elapsedTime < tBB) {
            const p = (elapsedTime - tCol) / config.durationBigBang;

            if (p < 0.22) {
              const flashP = p / 0.22;
              if (coreMat3D) coreMat3D.opacity = 1.0;
              if (singularityCore3D) singularityCore3D.scale.set(4.8 + flashP * 16.0, 4.8 + flashP * 16.0, 4.8 + flashP * 16.0);
            } else {
              if (singularityCore3D) singularityCore3D.visible = false;
              if (blackHoleGroup3D) blackHoleGroup3D.scale.set(0.001, 0.001, 0.001);
            }

            // Dual Expanding Shockwaves
            if (shockwaveMesh3D) {
              shockwaveMesh3D.visible = true;
              const shockScale = p * 55.0;
              shockwaveMesh3D.scale.set(shockScale, shockScale, shockScale);
            }
            if (shockMat3D) shockMat3D.opacity = Math.sin(p * Math.PI) * 0.96;

            if (shockwaveMesh2) {
              shockwaveMesh2.visible = true;
              const shockScale2 = Math.max(0, (p - 0.08) * 50.0);
              shockwaveMesh2.scale.set(shockScale2, shockScale2, shockScale2);
            }
            if (shockMat2) shockMat2.opacity = Math.sin(Math.max(0, p - 0.08) * Math.PI) * 0.88;

            if (expMat3D) expMat3D.opacity = Math.sin(p * Math.PI) * 0.98;

            if (expGeo3D) {
              const posAttr = expGeo3D.attributes.position as THREE.BufferAttribute;
              const posArr = posAttr.array as Float32Array;

              const timeInExplosion = (elapsedTime - tCol);
              for (let i = 0; i < expCount3D; i++) {
                const speed = expSpeeds3D[i];
                const dist = timeInExplosion * speed;

                posArr[i * 3] = expDirections3D[i * 3] * dist;
                posArr[i * 3 + 1] = expDirections3D[i * 3 + 1] * dist;
                posArr[i * 3 + 2] = expDirections3D[i * 3 + 2] * dist;
              }
              posAttr.needsUpdate = true;
            }

            if (starGeometry3D) {
              const starPosAttr = starGeometry3D.attributes.position as THREE.BufferAttribute;
              const starPosArr = starPosAttr.array as Float32Array;
              for (let i = 0; i < starCount3D; i++) {
                starPosArr[i * 3] = starBaseX3D[i];
                starPosArr[i * 3 + 1] = starBaseY3D[i];
                starPosArr[i * 3 + 2] = starBaseZ3D[i];
              }
              starPosAttr.needsUpdate = true;
            }
            if (starMaterial3D) starMaterial3D.opacity = p * 0.85;
          }
          // Phase 6: Galaxy Reveal & Transition
          else if (elapsedTime < tRev) {
            const p = (elapsedTime - tBB) / config.durationReveal;
            if (shockwaveMesh3D) shockwaveMesh3D.visible = false;
            if (shockwaveMesh2) shockwaveMesh2.visible = false;
            if (expMat3D) expMat3D.opacity = (1.0 - p) * 0.5;
            if (starMaterial3D) starMaterial3D.opacity = 0.85 * (1.0 - p);
            if (nebulaMat1) nebulaMat1.opacity = 0.50 * (1.0 - p);
            if (nebulaMat2) nebulaMat2.opacity = 0.38 * (1.0 - p);
            if (nebulaMat3) nebulaMat3.opacity = 0.22 * (1.0 - p);
          } else {
            if (starMaterial3D) starMaterial3D.opacity = 0;
            if (expMat3D) expMat3D.opacity = 0;
          }

          renderer.render(scene, camera);

        } catch (frameErr) {
          console.warn('3D Render Loop Error -> Switching to 2D Mode:', frameErr);
          is3DMode = false;
        }
      }

      // -----------------------------------------------------------
      // EXECUTE 2D CANVAS FALLBACK RENDER LOOP
      // -----------------------------------------------------------
      if (!is3DMode && ctx2D) {
        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);

        ctx2D.fillStyle = '#010206';
        ctx2D.fillRect(0, 0, w, h);

        ctx2D.save();
        ctx2D.translate(w / 2, h / 2);

        // 2D Starfield & Particle Vortex
        stars2D.forEach(s => {
          let x = s.x;
          let y = s.y;

          if (elapsedTime >= tBH && elapsedTime < tCol) {
            const pAbs = (elapsedTime - tBH) / (tCol - tBH);
            const dist = Math.sqrt(x * x + y * y);
            const targetDist = Math.max(dist * Math.pow(1.0 - pAbs, 1.3), 2.5);
            const angle = Math.atan2(y, x) + pAbs * 4.8;
            x = targetDist * Math.cos(angle);
            y = targetDist * Math.sin(angle);
          }

          ctx2D.fillStyle = s.color;
          ctx2D.beginPath();
          ctx2D.arc(x, y, s.r, 0, Math.PI * 2);
          ctx2D.fill();
        });

        // 2D Black Hole & Multi-layered Accretion Disk (Interstellar Gradient)
        if (elapsedTime >= tVoid && elapsedTime < tCol) {
          const pBH = Math.min((elapsedTime - tVoid) / config.durationBlackHole, 1.0);
          const radius = 80 * pBH;

          // Multi-layer Accretion Disk
          const grad = ctx2D.createRadialGradient(0, 0, radius * 0.65, 0, 0, radius * 2.7);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(0.20, 'rgba(255, 255, 255, 1.0)');
          grad.addColorStop(0.38, 'rgba(56, 182, 255, 0.90)');
          grad.addColorStop(0.65, 'rgba(245, 158, 70, 0.85)');
          grad.addColorStop(0.85, 'rgba(168, 85, 247, 0.45)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx2D.fillStyle = grad;
          ctx2D.beginPath();
          ctx2D.arc(0, 0, radius * 2.7, 0, Math.PI * 2);
          ctx2D.fill();

          // Pitch Black Event Horizon Void
          ctx2D.fillStyle = '#000000';
          ctx2D.beginPath();
          ctx2D.arc(0, 0, radius, 0, Math.PI * 2);
          ctx2D.fill();

          // Luminous Photon Sphere Ring
          ctx2D.strokeStyle = 'rgba(56, 182, 255, 0.95)';
          ctx2D.lineWidth = 3.8;
          ctx2D.beginPath();
          ctx2D.arc(0, 0, radius + 1.5, 0, Math.PI * 2);
          ctx2D.stroke();
        }

        // 2D Big Bang Explosion Flash & Layered Shockwave
        if (elapsedTime >= tCol && elapsedTime < tBB) {
          const pExp = (elapsedTime - tCol) / config.durationBigBang;
          const expRadius = pExp * Math.max(w, h) * 1.4;

          const expGrad = ctx2D.createRadialGradient(0, 0, 0, 0, 0, expRadius);
          expGrad.addColorStop(0, `rgba(255, 255, 255, ${1 - pExp})`);
          expGrad.addColorStop(0.28, `rgba(56, 249, 215, ${0.92 * (1 - pExp)})`);
          expGrad.addColorStop(0.62, `rgba(255, 107, 0, ${0.80 * (1 - pExp)})`);
          expGrad.addColorStop(0.88, `rgba(168, 85, 247, ${0.45 * (1 - pExp)})`);
          expGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx2D.fillStyle = expGrad;
          ctx2D.beginPath();
          ctx2D.arc(0, 0, expRadius, 0, Math.PI * 2);
          ctx2D.fill();
        }

        ctx2D.restore();
      }

      if (normalizedProgress >= 1.0) {
        console.log('[CosmicIntro] Timeline completed naturally (100%). Triggering onComplete callback.');
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    console.log('[CosmicIntro] Starting initial animation frame loop...');
    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      if (renderer && camera) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      console.log('[CosmicIntro] Cleaning up CosmicIntroCanvas resources.');
      isCleanedUpRef.current = true;
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);

      geometriesToDispose.forEach(g => g.dispose());
      materialsToDispose.forEach(m => m.dispose());
      texturesToDispose.forEach(t => t.dispose());

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [config, isSkipped]);

  return (
    <canvas
      ref={canvasRef}
      className="cosmic-intro-canvas-element"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};
