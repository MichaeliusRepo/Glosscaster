// Sauce:
// https://github.com/wass08/wawa-vfx

import { VFXEmitter, VFXParticles, AppearanceMode } from 'wawa-vfx';
// import { hsl } from '../HSL';

export const SideParticle = () => {
  return (
    <>
      {/* Step 1: Define your particle system */}
      <VFXParticles
        name="particles" // A unique identifier for this particle system
        settings={{
          nbParticles: 100, // Maximum number of particles to allocate
          gravity: [0.005, -0.005, 0], // Apply gravity (x, y, z)
          fadeSize: [0, 1], // Size fade in/out settings
          // fadeAlpha: [0, 1], // Opacity fade in/out settings
          // renderMode: "billboard", // "billboard" or "mesh" or "stretchBillboard"
          intensity: 0.1, // Brightness multiplier
          appearance: AppearanceMode.Circular, // Define the default appearance to be plane (default) or circular
          easeFunction: "easeLinear", // add easing to the particle animations
        }}
      />

      {/* Step 2: Define your emitter */}
      <VFXEmitter
        // debug // Show debug visualization
        emitter="particles" // Target the particle system by name
        settings={{
          loop: true, // Continuously emit particles (only if `spawnMode` is 'time')
          duration: 1, // Emission cycle duration in seconds
          nbParticles: 5, // Number of particles to emit per cycle
          spawnMode: "time", // Emission mode: 'time' or 'burst'
          delay: 0, // Time delay before starting emission

          // Particle lifetime range [min, max]
          particlesLifetime: [50, 100],

          // Position range (min/max)
          startPositionMin: [-9, -2, -0.1],
          startPositionMax: [-9, 3, 0.1],

          // Direction range (min/max)
          directionMin: [0, -0.25, -1],
          directionMax: [1, 0.2, 1],

          // Particle size range [min, max]
          size: [0.01, 0.1],

          // Particle speed range [min, max]
          speed: [0.1, 0.1],

          // // Color at start - an array of strings for random selection
          // colorStart: ["white", "skyblue"],

          // // Color at end - an array of strings for random selection
          // colorEnd: ["transparent", "pink"],

          // When true, the emitter will emit particles using its local axes (transformed by its world rotation)
          // useLocalDirection: true,
        }}
      />
    </>
  );
};

export const GlowUpParticles = () => {
  return (
    <>
      {/* Step 1: Define your particle system */}
      <VFXParticles
        name="particles2" // A unique identifier for this particle system
        settings={{
          nbParticles: 100, // Maximum number of particles to allocate
          gravity: [0, 0.01, 0], // Apply gravity (x, y, z)
          fadeSize: [0, 1], // Size fade in/out settings
          // fadeAlpha: [0, 1], // Opacity fade in/out settings
          // renderMode: "billboard", // "billboard" or "mesh" or "stretchBillboard"
          intensity: 3, // Brightness multiplier
          appearance: AppearanceMode.Circular, // Define the default appearance to be plane (default) or circular
          easeFunction: "easeLinear", // add easing to the particle animations
        }}
      />

      {/* Step 2: Define your emitter */}
      <VFXEmitter
        // debug // Show debug visualization
        emitter="particles2" // Target the particle system by name
        settings={{
          loop: true, // Continuously emit particles (only if `spawnMode` is 'time')
          duration: 1, // Emission cycle duration in seconds
          nbParticles: 1, // Number of particles to emit per cycle
          spawnMode: "time", // Emission mode: 'time' or 'burst'
          delay: 0, // Time delay before starting emission

          // Particle lifetime range [min, max]
          particlesLifetime: [50, 100],

          // Position range (min/max)
          startPositionMin: [-9, -4.5, -0.1],
          startPositionMax: [9, -4.5, 0.1],

          // Direction range (min/max)
          directionMin: [-0.5, -0.25, -1],
          directionMax: [0.5, 0.2, 1],

          // Particle size range [min, max]
          size: [0.01, 0.05],

          // Particle speed range [min, max]
          speed: [0.05, 0.1],

          // // Color at start - an array of strings for random selection
          // colorStart: ["white", "skyblue"],

          // // Color at end - an array of strings for random selection
          // colorEnd: ["transparent", "pink"],

          // When true, the emitter will emit particles using its local axes (transformed by its world rotation)
          // useLocalDirection: true,
        }}
      />
    </>
  );
};

