# Design System Specification (DESIGN.md)
**Project**: Social Media Design Masterclass — Interactive Presentation Deck
**Framework**: React 18 + TypeScript + Vite + GSAP
**Standard**: Antigravity Design Engineering (WCAG 2.2 AA & 100% Figma Fidelity)

---

## 1. Brand Identity & Personality Archetype

- **Archetype**: *Professional Training & Creative Masterclass (Tech Editorial & Studio Glow)*.
- **Tone**: Authoritative, educational, dynamic, structured, and sleek.
- **Intent**: Deliver complex multi-photo social design guidelines and 3D visual theories through an ultra-clean, high-contrast, interactive dark-mode presentation deck.

---

## 2. Color System & Semantic Tokens

### Core Palette
| Token | HEX | Role | WCAG on Dark (`#07090E`) |
| :--- | :--- | :--- | :--- |
| `--bg-dark-primary` | `#07090E` | Canvas / Viewport Base | Baseline |
| `--bg-dark-secondary` | `#0D121D` | Surface & Stage Container | 1.1:1 |
| `--bg-dark-card` | `rgba(18, 25, 38, 0.75)` | Elevated Glass Panels | 1.4:1 |
| `--color-primary` | `#38B6FF` | Brand Accent / Focal Text | **10.5:1 (Pass AAA)** |
| `--color-secondary` | `#7000FF` | Ambient Depth Glow | 2.8:1 (Graphic only) |
| `--color-accent-amber` | `#FFBD59` | Warning / Highlights / Specs | **12.1:1 (Pass AAA)** |
| `--color-accent-coral` | `#FF5757` | Urgency / CTA Badges | **6.4:1 (Pass AA)** |
| `--color-accent-emerald` | `#00F0AA` | Success / Checkmarks | **14.2:1 (Pass AAA)** |
| `--text-main` | `#F8FAFC` | Primary Headlines & Titles | **18.2:1 (Pass AAA)** |
| `--text-muted` | `#94A3B8` | Subtitles & Supporting Text | **7.1:1 (Pass AA)** |
| `--text-subtle` | `#64748B` | Metadata & Counter Labels | **4.6:1 (Pass AA)** |

---

## 3. Typography Scale & Hierarchy

- **Display & Headings**: `'Outfit'`, `'Plus Jakarta Sans'`, sans-serif (`font-weight: 700 / 800`).
- **Body & UI**: `'Plus Jakarta Sans'`, `'Inter'`, sans-serif (`font-weight: 400 / 500 / 600`).
- **Code, Metrics & Dimensions**: `'JetBrains Mono'`, monospace (`font-weight: 600 / 700`).

### Type Scale Matrix
```css
--font-hero-title: clamp(1.8rem, 2.6vw, 2.7rem);    /* 800 weight, line-height 1.15 */
--font-subtitle:   clamp(0.95rem, 1.2vw, 1.15rem);   /* 400 weight, line-height 1.45 */
--font-body-large: 1.1rem;                           /* 400 weight, line-height 1.65 */
--font-body-med:   0.95rem;                          /* 500 weight, line-height 1.55 */
--font-badge:      0.72rem;                          /* 700 uppercase, letter-spacing 0.08em */
--font-spec-value: 1.25rem;                          /* 800 JetBrains Mono */
```

---

## 4. Spacing, Grid & Elevation

### Spacing Scale (8px Base Unit)
- `4px` (`--s-xs`): Micro pill gaps & inline icons.
- `8px` (`--s-sm`): Card inner tags & badge paddings.
- `12px` (`--s-md`): List items & interactive button gaps.
- `16px` (`--s-lg`): Standard card inner padding.
- `24px` (`--s-xl`): Module spacing & widget containers.
- `32px` (`--s-xxl`): Stage margins & header padding.

### Elevation & Shadows
- `--shadow-subtle`: `0 4px 20px rgba(0, 0, 0, 0.4)`
- `--shadow-elevated`: `0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 182, 255, 0.15)`
- `--shadow-glow`: `0 0 30px rgba(56, 182, 255, 0.25)`

---

## 5. Component Language

1. **Floating Presentation Navigation Bar**:
   - Translucent glass capsule with backdrop blur `12px`.
   - Tactile 38×38px round arrow buttons with hover glow.
   - Dual-digit slide counter `01 / 23`.
2. **Multi-Photo Specification Cards**:
   - Border-accented layout cards with dynamic aspect ratio previews.
   - Dedicated dimension chips (e.g. `1920 × 960 px`).
3. **Interactive 3D Light Studio**:
   - Real-time 360° orbital light source manipulating diffuse gradients and cast shadows.
   - Multi-shape toggle for Sphere, Cube, and Cylinder.
4. **5-Swatch Color Analyzer**:
   - Live color picker updating dominant, secondary, accent, and shadow values with click-to-copy hex utility.
5. **Thumbnails Drawer (`T` Key)**:
   - Full 23-slide responsive visual grid with instant search filter.

---

## 6. Responsive Breakpoint Matrix

| Viewport | Target Device | Layout Strategy |
| :--- | :--- | :--- |
| **>= 1440px** | Desktop Presentation / Projector | Split dual-column 1.15fr : 0.85fr; full visual height 860px max. |
| **1024px – 1439px** | Laptops (1366×768 / 1440×900) | Fluid typography scale, compact padding, 480px visual cards. |
| **768px – 1023px** | Tablets / iPad Pro | Single column with scrolling overflow, touch swipe enabled. |
| **< 768px** | Smartphone (390×844) | Stacked layout, bottom navigation condensed, mobile touch targets >=44px. |

---

## 7. Motion & Interaction Principles

- **Slide Transitions**: GSAP `fromTo` with directional translation (`x: ±40px`), subtle scale (`0.985 -> 1.0`), and duration `0.4s` (`power2.out`).
- **Interactive Feedback**: All hoverable elements transition within `0.2s ease-out` with active scale down `0.97`.
- **Accessibility**: Honors `prefers-reduced-motion: reduce` by zeroing transition delays and instant DOM updates.

---

## 8. Do's and Don'ts

### DO:
- Keep slide headlines readable from across a room (large contrast and balanced wrap).
- Ensure all images have `object-fit: contain` or tailored cards to prevent distortion.
- Provide keyboard, mouse, click, and swipe navigation simultaneously.
- Verify every layout in a live browser session across 4 viewports before publishing.

### DON'T:
- Never use unstyled raw inputs or default browser focus rectangles.
- Never use low-contrast text (contrast < 4.5:1 is forbidden).
- Never allow text or visual overflow outside the 100vh viewport in presentation mode.
- Never hardcode fixed pixel widths on mobile viewports.
