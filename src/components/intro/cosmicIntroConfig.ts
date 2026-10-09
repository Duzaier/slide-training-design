export interface CosmicIntroConfig {
  durationVoid: number;           // Scene A: Enter the void (seconds)
  durationBlackHole: number;       // Scene B: Black hole formation (seconds)
  durationAbsorption: number;      // Scene C: Gravitational absorption (seconds)
  durationCollapse: number;        // Scene D: Overload & singularity collapse (seconds)
  durationBigBang: number;         // Scene E: Big Bang explosion (seconds)
  durationReveal: number;          // Scene F: Galaxy background reconstruction (seconds)
  durationTransition: number;      // Scene G: Reveal Slide 1 (seconds)
  starCount: number;               // Number of background & infalling stars
  explosionParticleCount: number;  // Number of particles created in Big Bang
  sessionStorageKey: string;       // Key for session replay tracking
  enableAudio: boolean;            // Audio toggle flag
}

export const DEFAULT_INTRO_CONFIG: CosmicIntroConfig = {
  durationVoid: 2.0,
  durationBlackHole: 2.5,
  durationAbsorption: 4.0,
  durationCollapse: 2.0,
  durationBigBang: 2.5,
  durationReveal: 2.0,
  durationTransition: 1.5,
  starCount: 5000,
  explosionParticleCount: 7000,
  sessionStorageKey: 'figma_presentation_intro_seen_v1',
  enableAudio: false
};

// Total intro duration in seconds
export const getTotalIntroDuration = (config: CosmicIntroConfig = DEFAULT_INTRO_CONFIG): number => {
  return (
    config.durationVoid +
    config.durationBlackHole +
    config.durationAbsorption +
    config.durationCollapse +
    config.durationBigBang +
    config.durationReveal +
    config.durationTransition
  );
};
