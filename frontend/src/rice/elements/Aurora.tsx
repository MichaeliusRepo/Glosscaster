// Sauce:
// https://www.youtube.com/watch?v=qCqt0E-NXqU

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AuroraSettings {
    position?: [number, number, number];
    rotation?: [number, number, number];
    godrayColor?: string;
    timeSpeed?: number;
    noiseScale?: number;
    topRadius?: number;
    bottomRadius?: number;
    height?: number;
    smoothBottom?: number;
    smoothTop?: number;
    fresnelPower?: number;
}

export const Aurora = ({
    settings = {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        godrayColor: '#ffffff',
        timeSpeed: 0.1,
        noiseScale: 5,
        topRadius: 3,
        bottomRadius: 2,
        height: 10,
        smoothBottom: 0.1,
        smoothTop: 0.9,
        fresnelPower: 5,
    },
    ...props
}: { settings?: AuroraSettings }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                noiseScale: { value: settings.noiseScale },
                color: { value: new THREE.Color(settings.godrayColor) },
                smoothTop: { value: settings.smoothTop },
                smoothBottom: { value: settings.smoothBottom },
                fresnelPower: { value: settings.fresnelPower },
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vWorldPosition;

                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPos.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float noiseScale;
                uniform vec3 color;
                uniform float smoothTop;
                uniform float smoothBottom;
                uniform float fresnelPower;

                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vWorldPosition;

                // Worley noise approximation
                float hash(vec3 p) {
                    p = fract(p * 0.3183099 + .1);
                    p *= 17.0;
                    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                }

                float noise(vec3 x) {
                    vec3 p = floor(x);
                    vec3 f = fract(x);
                    f = f * f * (3.0 - 2.0 * f);
                    
                    return mix(mix(mix(hash(p + vec3(0,0,0)), 
                                    hash(p + vec3(1,0,0)), f.x),
                                mix(hash(p + vec3(0,1,0)), 
                                    hash(p + vec3(1,1,0)), f.x), f.y),
                            mix(mix(hash(p + vec3(0,0,1)), 
                                    hash(p + vec3(1,0,1)), f.x),
                                mix(hash(p + vec3(0,1,1)), 
                                    hash(p + vec3(1,1,1)), f.x), f.y), f.z);
                }

                void main() {
                    // Fresnel effect
                    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
                    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), fresnelPower);

                    // Animated noise
                    vec3 noiseInput = vec3(vNormal * noiseScale + time);
                    float noiseValue = noise(noiseInput);

                    // Gradient based on UV
                    float gradient = smoothstep(0.0, smoothBottom, vUv.y) * 
                                   smoothstep(1.0, smoothTop, vUv.y);

                    // Combine effects
                    float alpha = noiseValue * fresnel * gradient;
                    
                    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }, [settings]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime * settings.timeSpeed!;
        }
    });

    return (
        <mesh
            position={settings.position}
            rotation={settings.rotation}
            {...props}
        >
            <cylinderGeometry
                args={[
                    settings.topRadius,
                    settings.bottomRadius,
                    settings.height,
                    64,
                    1,
                    true
                ]}
            />
            <primitive object={shaderMaterial} ref={materialRef} attach="material" />
        </mesh>
    );
};