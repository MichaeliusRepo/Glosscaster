// Sauce: GitHub Copilot innit like.

import { useMemo } from 'react';
import * as THREE from 'three';

export function GradientBackground({ hue = 0, s1 = 0, l1 = 0, s2 = 0, l2 = 0 }: {
    hue?: number;
    s1?: number;
    l1?: number;
    s2?: number;
    l2?: number;
}

) {
    hue = hue % 360;
    if (hue < 0) hue += 360;

    // Create colors using THREE.Color's setHSL method
    // Note: THREE.js uses 0-1 range for saturation and lightness
    const color1 = new THREE.Color().setHSL(
        hue / 360,        // Normalize hue to 0-1
        s1 / 100,         // Normalize saturation to 0-1
        l1 / 100          // Normalize lightness to 0-1
    );

    const color2 = new THREE.Color().setHSL(
        hue / 360,
        s2 / 100,
        l2 / 100
    );




    // Custom shader material for vertical gradient
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: color1 },
                color2: { value: color2 },
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
            depthWrite: false,
            depthTest: false,
            side: THREE.DoubleSide,
        });
    }, [color1, color2]);

    return (
        <mesh position={[0, 0, -10]} renderOrder={-1}>
            <planeGeometry args={[45, 20]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}
