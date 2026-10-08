import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pipette, Copy, Check, RotateCcw } from 'lucide-react';

export interface ColorPickerValue {
  hex: string;
  rgb: [number, number, number];
  hsv: [number, number, number];
  cmyk: [number, number, number, number];
}

interface InteractiveColorPickerProps {
  currentColor?: string;
  onColorChange?: (color: ColorPickerValue) => void;
  className?: string;
}

// Color Math Utilities
export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const vNorm = Math.max(0, Math.min(100, v)) / 100;
  const hNorm = ((h % 360) + 360) % 360;

  const c = vNorm * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = vNorm - c;

  let rPrime = 0, gPrime = 0, bPrime = 0;
  if (hNorm >= 0 && hNorm < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (hNorm >= 60 && hNorm < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (hNorm >= 120 && hNorm < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (hNorm >= 180 && hNorm < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (hNorm >= 240 && hNorm < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return [
    Math.round((rPrime + m) * 255),
    Math.round((gPrime + m) * 255),
    Math.round((bPrime + m) * 255)
  ];
}

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / d) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / d + 2;
    } else {
      h = (rNorm - gNorm) / d + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return [h, Math.round(s * 100), Math.round(v * 100)];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : [r, g, b];
  }
  return null;
}

export function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k >= 0.999) return [0, 0, 0, 100];

  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  const kPercent = Math.round(k * 100);

  return [Math.max(0, c), Math.max(0, m), Math.max(0, y), Math.max(0, kPercent)];
}

export const InteractiveColorPicker: React.FC<InteractiveColorPickerProps> = ({
  currentColor = '#1E5AFF',
  onColorChange,
  className = ''
}) => {
  // Initialize HSV directly from currentColor so there is zero initial state mismatch
  const initialRgb = hexToRgb(currentColor || '#1E5AFF');
  const initialHsv = initialRgb ? rgbToHsv(initialRgb[0], initialRgb[1], initialRgb[2]) : [224, 88, 100];

  // Hue: 0-360, Sat: 0-100, Val: 0-100
  const [hue, setHue] = useState<number>(initialHsv[0]);
  const [sat, setSat] = useState<number>(initialHsv[1]);
  const [val, setVal] = useState<number>(initialHsv[2]);
  const [initialColor] = useState<string>(currentColor || '#1E5AFF');
  const [copied, setCopied] = useState<boolean>(false);
  const [hexInput, setHexInput] = useState<string>((currentColor || '#1E5AFF').replace('#', '').toUpperCase());

  const spectrumRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const isDraggingSpectrum = useRef<boolean>(false);
  const isDraggingHue = useRef<boolean>(false);

  // Single-source tracking refs to prevent circular feedback loops and closure staleness
  const hueRef = useRef<number>(initialHsv[0]);
  const satRef = useRef<number>(initialHsv[1]);
  const valRef = useRef<number>(initialHsv[2]);
  const lastEmittedHexRef = useRef<string>((currentColor || '#1E5AFF').toUpperCase());
  const onColorChangeRef = useRef(onColorChange);

  useEffect(() => {
    onColorChangeRef.current = onColorChange;
  }, [onColorChange]);

  // Keep numerical refs in sync with state
  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  useEffect(() => {
    satRef.current = sat;
  }, [sat]);

  useEffect(() => {
    valRef.current = val;
  }, [val]);

  // Derive RGB, HEX, CMYK
  const rgb = hsvToRgb(hue, sat, val);
  const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
  const cmyk = rgbToCmyk(rgb[0], rgb[1], rgb[2]);

  // Notify parent on change ONLY when hex has genuinely changed from last emitted
  useEffect(() => {
    if (lastEmittedHexRef.current.toUpperCase() !== hex.toUpperCase()) {
      lastEmittedHexRef.current = hex.toUpperCase();
      if (onColorChangeRef.current) {
        onColorChangeRef.current({
          hex,
          rgb,
          hsv: [hue, sat, val],
          cmyk
        });
      }
    }
  }, [hex, rgb, hue, sat, val, cmyk]);

  // Synchronize when prop changes EXTERNALLY (and only when user is NOT actively dragging)
  useEffect(() => {
    if (!currentColor) return;

    // Never sync from parent if user is actively dragging in this picker
    if (isDraggingSpectrum.current || isDraggingHue.current) return;

    // Never sync from parent if incoming color is identical to what we already emitted
    if (lastEmittedHexRef.current && currentColor.toUpperCase() === lastEmittedHexRef.current.toUpperCase()) {
      return;
    }

    const parsedRgb = hexToRgb(currentColor);
    if (parsedRgb) {
      const [h, s, v] = rgbToHsv(parsedRgb[0], parsedRgb[1], parsedRgb[2]);
      hueRef.current = h;
      satRef.current = s;
      valRef.current = v;
      setHue(h);
      setSat(s);
      setVal(v);
      setHexInput(currentColor.replace('#', '').toUpperCase());
      lastEmittedHexRef.current = currentColor.toUpperCase();
    }
  }, [currentColor]);

  // Global pointer release safety: guarantees dragging states are always cleared even on window blur / drag out
  useEffect(() => {
    const handleGlobalRelease = () => {
      isDraggingSpectrum.current = false;
      isDraggingHue.current = false;
    };
    window.addEventListener('pointerup', handleGlobalRelease);
    window.addEventListener('pointercancel', handleGlobalRelease);
    window.addEventListener('blur', handleGlobalRelease);
    return () => {
      window.removeEventListener('pointerup', handleGlobalRelease);
      window.removeEventListener('pointercancel', handleGlobalRelease);
      window.removeEventListener('blur', handleGlobalRelease);
    };
  }, []);

  // Handle Spectrum Pointer (Drag / Click in 2D field)
  const updateSpectrumPos = useCallback((clientX: number, clientY: number) => {
    if (!spectrumRef.current) return;
    const rect = spectrumRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const newSat = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    const newVal = Math.max(0, Math.min(100, Math.round(100 - (y / rect.height) * 100)));

    satRef.current = newSat;
    valRef.current = newVal;
    setSat(newSat);
    setVal(newVal);

    const newRgb = hsvToRgb(hueRef.current, newSat, newVal);
    const newHex = rgbToHex(newRgb[0], newRgb[1], newRgb[2]);
    lastEmittedHexRef.current = newHex.toUpperCase();
    setHexInput(newHex.replace('#', '').toUpperCase());
  }, []);

  const handleSpectrumPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingSpectrum.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    updateSpectrumPos(e.clientX, e.clientY);
  };

  const handleSpectrumPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSpectrum.current) {
      updateSpectrumPos(e.clientX, e.clientY);
    }
  };

  const handleSpectrumPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSpectrum.current) {
      isDraggingSpectrum.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handleSpectrumLostCapture = () => {
    isDraggingSpectrum.current = false;
  };

  // Handle Hue Pointer (Drag / Click in Hue bar)
  const updateHuePos = useCallback((clientY: number) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    if (rect.height === 0) return;

    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const newHue = Math.max(0, Math.min(359, Math.round((y / rect.height) * 360))) % 360;

    hueRef.current = newHue;
    setHue(newHue);

    const newRgb = hsvToRgb(newHue, satRef.current, valRef.current);
    const newHex = rgbToHex(newRgb[0], newRgb[1], newRgb[2]);
    lastEmittedHexRef.current = newHex.toUpperCase();
    setHexInput(newHex.replace('#', '').toUpperCase());
  }, []);

  const handleHuePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingHue.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    updateHuePos(e.clientY);
  };

  const handleHuePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingHue.current) {
      updateHuePos(e.clientY);
    }
  };

  const handleHuePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingHue.current) {
      isDraggingHue.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handleHueLostCapture = () => {
    isDraggingHue.current = false;
  };

  // Eyedropper API (Chromium native screen dropper)
  const handleEyedropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          applyHex(result.sRGBHex);
        }
      } catch (_) {
        // User cancelled picker
      }
    } else {
      alert('Trình duyệt hỗ trợ công cụ Chấm màu native trên Chrome / Edge. Bạn cũng có thể click trực tiếp vào hình poster bên trái để chấm màu!');
    }
  };

  const applyHex = (rawHex: string) => {
    const parsedRgb = hexToRgb(rawHex);
    if (parsedRgb) {
      const [h, s, v] = rgbToHsv(parsedRgb[0], parsedRgb[1], parsedRgb[2]);
      hueRef.current = h;
      satRef.current = s;
      valRef.current = v;
      setHue(h);
      setSat(s);
      setVal(v);
      const cleanHex = rawHex.replace('#', '').toUpperCase();
      setHexInput(cleanHex);
      lastEmittedHexRef.current = `#${cleanHex}`;
    }
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value.trim().toUpperCase();
    setHexInput(valStr);
    if (valStr.length === 6 || valStr.length === 3) {
      const parsed = hexToRgb(valStr);
      if (parsed) {
        const [h, s, v] = rgbToHsv(parsed[0], parsed[1], parsed[2]);
        hueRef.current = h;
        satRef.current = s;
        valRef.current = v;
        setHue(h);
        setSat(s);
        setVal(v);
        lastEmittedHexRef.current = `#${valStr}`;
      }
    }
  };

  const handleRgbInputChange = (channel: 'r' | 'g' | 'b', valStr: string) => {
    const num = Math.max(0, Math.min(255, parseInt(valStr, 10) || 0));
    let [r, g, b] = rgb;
    if (channel === 'r') r = num;
    if (channel === 'g') g = num;
    if (channel === 'b') b = num;

    const [h, s, v] = rgbToHsv(r, g, b);
    hueRef.current = h;
    satRef.current = s;
    valRef.current = v;
    setHue(h);
    setSat(s);
    setVal(v);
    const newHex = rgbToHex(r, g, b);
    setHexInput(newHex.replace('#', '').toUpperCase());
    lastEmittedHexRef.current = newHex.toUpperCase();
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleRevertInitial = () => {
    applyHex(initialColor);
  };

  return (
    <div className={`ps-color-picker-studio ${className}`}>
      {/* Top Header Bar */}
      <div className="ps-picker-header">
        <div className="ps-header-left">
          <div className="ps-header-title">
            <span className="ps-icon-square" />
            <span>COLOR PICKER (PHOTOSHOP)</span>
          </div>
          <span className="ps-header-subtitle">Click & rê chuột để chọn màu</span>
        </div>

        <div className="ps-header-actions">
          <button
            type="button"
            className="ps-eyedropper-btn"
            onClick={handleEyedropper}
            title="Dùng Pipette hút màu trực tiếp từ màn hình"
          >
            <Pipette size={14} />
            <span>Chấm màu</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: 2D Field + Vertical Hue Strip */}
      <div className="ps-picker-interactive-row">
        {/* 2D Saturation / Value Gradient Field */}
        <div
          ref={spectrumRef}
          className="ps-spectrum-field"
          style={{
            backgroundColor: `hsl(${hue}, 100%, 50%)`
          }}
          onPointerDown={handleSpectrumPointerDown}
          onPointerMove={handleSpectrumPointerMove}
          onPointerUp={handleSpectrumPointerUp}
          onPointerCancel={handleSpectrumPointerUp}
          onLostPointerCapture={handleSpectrumLostCapture}
          title="Kéo thả để điều chỉnh Độ bão hòa (Saturation) và Độ sáng (Brightness)"
        >
          {/* Horizontal White Gradient Overlay */}
          <div className="ps-spectrum-overlay-white" />
          {/* Vertical Black Gradient Overlay */}
          <div className="ps-spectrum-overlay-black" />

          {/* Draggable Reticle Indicator */}
          <div
            className="ps-spectrum-reticle"
            style={{
              left: `${sat}%`,
              top: `${100 - val}%`
            }}
          />
        </div>

        {/* Vertical Hue Rainbow Slider Strip */}
        <div
          ref={hueSliderRef}
          className="ps-hue-strip"
          onPointerDown={handleHuePointerDown}
          onPointerMove={handleHuePointerMove}
          onPointerUp={handleHuePointerUp}
          onPointerCancel={handleHuePointerUp}
          onLostPointerCapture={handleHueLostCapture}
          title="Kéo thanh quang phổ 360° để chọn sắc tướng (Hue)"
        >
          {/* Hue pointer arrows */}
          <div
            className="ps-hue-pointer"
            style={{
              top: `${(hue / 360) * 100}%`
            }}
          >
            <div className="ps-hue-pointer-left" />
            <div className="ps-hue-pointer-right" />
          </div>
        </div>

        {/* Swatch Preview Block (Photoshop Split Box: Current vs Previous) */}
        <div className="ps-preview-swatch-col">
          <div className="ps-swatch-split-box">
            <div
              className="ps-swatch-current"
              style={{ backgroundColor: hex }}
              title="Màu hiện tại đang chọn"
            >
              <span className="ps-swatch-label">NEW</span>
            </div>
            <div
              className="ps-swatch-previous"
              style={{ backgroundColor: initialColor }}
              onClick={handleRevertInitial}
              title="Click để quay lại màu ban đầu"
            >
              <span className="ps-swatch-label">CURRENT</span>
            </div>
          </div>

          <button
            type="button"
            className="ps-revert-btn"
            onClick={handleRevertInitial}
            title="Khôi phục màu ban đầu"
          >
            <RotateCcw size={12} />
            <span>Khôi phục</span>
          </button>
        </div>
      </div>

      {/* Values & Inputs Data Grid (RGB • HEX • HSB • CMYK) */}
      <div className="ps-picker-values-grid">
        {/* HEX Input & Copy Button */}
        <div className="ps-value-row ps-hex-row">
          <span className="ps-value-label">HEX #</span>
          <div className="ps-hex-input-wrap">
            <input
              type="text"
              maxLength={7}
              value={hexInput}
              onChange={handleHexInputChange}
              className="ps-hex-input"
              placeholder="1E5AFF"
            />
            <button
              type="button"
              className="ps-copy-hex-btn"
              onClick={handleCopyHex}
              title="Copy mã HEX vào clipboard"
            >
              {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
              <span>{copied ? 'ĐÃ COPY' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* RGB Numeric Row */}
        <div className="ps-channels-row">
          <div className="ps-channel-cell">
            <span className="ps-channel-label">R:</span>
            <input
              type="number"
              min={0}
              max={255}
              value={rgb[0]}
              onChange={(e) => handleRgbInputChange('r', e.target.value)}
              className="ps-num-input"
            />
          </div>
          <div className="ps-channel-cell">
            <span className="ps-channel-label">G:</span>
            <input
              type="number"
              min={0}
              max={255}
              value={rgb[1]}
              onChange={(e) => handleRgbInputChange('g', e.target.value)}
              className="ps-num-input"
            />
          </div>
          <div className="ps-channel-cell">
            <span className="ps-channel-label">B:</span>
            <input
              type="number"
              min={0}
              max={255}
              value={rgb[2]}
              onChange={(e) => handleRgbInputChange('b', e.target.value)}
              className="ps-num-input"
            />
          </div>
        </div>

        {/* HSB & CMYK Spec Row */}
        <div className="ps-spec-data-row">
          <div className="ps-spec-group">
            <span className="ps-spec-title">HSB:</span>
            <span className="ps-spec-val">{hue}° • {sat}% • {val}%</span>
          </div>
          <div className="ps-spec-group">
            <span className="ps-spec-title">CMYK:</span>
            <span className="ps-spec-val">{cmyk[0]}/{cmyk[1]}/{cmyk[2]}/{cmyk[3]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
