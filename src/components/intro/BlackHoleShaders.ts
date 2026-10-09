// Custom GLSL Shaders for Cinematic Black Hole & Big Bang Simulation

export const AccretionDiskShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uSwirlSpeed;
    uniform float uCollapse;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    // 2D Noise helper
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Convert UV to polar coordinates around disk center (0.5, 0.5)
      vec2 centered = vUv - vec2(0.5);
      float r = length(centered) * 2.0; // 0.0 at center, 1.0 at edge
      float angle = atan(centered.y, centered.x);

      // Inner horizon cut-off (black hole radius ~ 0.3)
      if (r < 0.28) {
        discard;
      }

      // Swirling spiral coordinates
      float spiral = angle + (1.2 / r) - uTime * uSwirlSpeed;
      vec2 noiseUV = vec2(r * 3.0, spiral * 2.0);
      float n = snoise(noiseUV + vec2(uTime * 0.5)) * 0.5 + 0.5;
      float n2 = snoise(noiseUV * 2.5 - vec2(uTime * 0.8)) * 0.5 + 0.5;
      float combinedNoise = (n * 0.6 + n2 * 0.4);

      // Radial opacity profile (bright inner ring, fading outer ring)
      float radialMask = smoothstep(0.28, 0.38, r) * (1.0 - smoothstep(0.65, 1.0, r));

      // Relativistic Doppler beaming effect (one side brighter due to rotation towards camera)
      float doppler = 1.0 + 0.4 * cos(angle + 0.5);

      // Temperature color ramp: Hot inner white-cyan -> Mid sapphire blue -> Outer violet/amber
      vec3 colHot = vec3(0.9, 0.98, 1.0) * 1.6;
      vec3 colMid = vec3(0.22, 0.71, 1.0);
      vec3 colOuter = vec3(0.66, 0.33, 0.97);
      vec3 colAmber = vec3(1.0, 0.69, 0.23);

      vec3 diskColor = mix(colHot, colMid, smoothstep(0.28, 0.5, r));
      diskColor = mix(diskColor, colOuter, smoothstep(0.5, 0.8, r));
      diskColor = mix(diskColor, colAmber, smoothstep(0.75, 1.0, r) * combinedNoise);

      float alpha = radialMask * (0.6 + 0.4 * combinedNoise) * doppler * uIntensity;

      // Compression fade during collapse
      alpha *= (1.0 - uCollapse * 0.5);

      gl_FragColor = vec4(diskColor * (1.2 + combinedNoise * 0.8), alpha);
    }
  `
};

export const SingularityCoreShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uEnergy;
    uniform float uFlash;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vec2 uv = vUv - vec2(0.5);
      float dist = length(uv) * 2.0;
      float glow = exp(-dist * 4.0) * uEnergy;

      vec3 coreWhite = vec3(1.0, 1.0, 1.0);
      vec3 coreCyan = vec3(0.35, 0.85, 1.0);
      vec3 coreMagenta = vec3(0.92, 0.28, 0.75);

      vec3 finalColor = mix(coreWhite, coreCyan, dist * 1.5);
      finalColor = mix(finalColor, coreMagenta, dist * 2.5);

      float alpha = smoothstep(1.0, 0.0, dist) * (glow + uFlash * 4.0);
      gl_FragColor = vec4(finalColor * (1.5 + uFlash * 6.0), alpha);
    }
  `
};

export const ShockwaveShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uRadius;
    uniform float uThickness;
    uniform float uIntensity;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vec2 centered = vUv - vec2(0.5);
      float dist = length(centered) * 2.0;

      // Ring mask around expanding radius
      float ring = smoothstep(uRadius - uThickness, uRadius, dist) * (1.0 - smoothstep(uRadius, uRadius + uThickness, dist));
      
      // Secondary shockwave noise texture
      float wave = sin(dist * 40.0 - uTime * 15.0) * 0.5 + 0.5;

      vec3 ringCyan = vec3(0.22, 0.71, 1.0);
      vec3 ringMagenta = vec3(0.66, 0.33, 0.97);
      vec3 ringGold = vec3(1.0, 0.7, 0.3);

      vec3 ringColor = mix(ringCyan, ringMagenta, sin(uTime * 2.0 + dist * 5.0) * 0.5 + 0.5);
      ringColor = mix(ringColor, ringGold, wave * 0.3);

      float alpha = ring * uIntensity * (0.8 + wave * 0.4);

      gl_FragColor = vec4(ringColor * 2.5, alpha);
    }
  `
};
