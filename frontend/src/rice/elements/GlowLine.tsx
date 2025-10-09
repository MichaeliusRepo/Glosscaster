// Sauce: GitHub Copilot innit like.

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LineProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number]
    color?: string
    glowColor?: string
    glowStrength?: number
    width?: number
}

export function GlowLine({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = '#ffffff',
    glowColor = '#00ffff',
    glowStrength = 1.0,
    width = 0.1
}: LineProps) {
    const meshRef = useRef<THREE.Mesh>(null)

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                glowColor: { value: new THREE.Color(glowColor) },
                glowStrength: { value: glowStrength },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform vec3 glowColor;
                uniform float glowStrength;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    // Calculate distance from center line
                    float dist = abs(vUv.y - 0.5) * 2.0;
                    
                    // Core line
                    float core = smoothstep(0.5, 0.0, dist);
                    
                    // Glow effect
                    float glow = exp(-2.0 * dist) * glowStrength;
                    
                    // Combine core and glow
                    vec3 finalColor = mix(glowColor * glow, color, core);
                    float alpha = max(core, glow);
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
    }, [color, glowColor, glowStrength])

    useFrame((state) => {
        if (!meshRef.current) return
        const material = meshRef.current.material as THREE.ShaderMaterial
        material.uniforms.time.value = state.clock.elapsedTime
    })

    return (
        <mesh
            ref={meshRef}
            position={new THREE.Vector3(...position)}
            rotation={new THREE.Euler(...rotation)}
            scale={new THREE.Vector3(...scale)}
        >
            <planeGeometry args={[1, width, 32, 1]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    )
}