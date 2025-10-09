import { Canvas } from "@react-three/fiber"
import { Html, Text, Float, Environment, OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

function BackgroundAurora() {
    return (
        <mesh scale={50}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                side={THREE.BackSide}
                uniforms={{
                    time: { value: 0 },
                }}
                fragmentShader={`
          uniform float time;
          varying vec3 vNormal;
          void main() {
            vec3 color = vec3(
              0.2 + 0.2 * sin(time + vNormal.x * 2.0),
              0.3 + 0.3 * sin(time + vNormal.y * 3.0),
              0.4 + 0.4 * sin(time + vNormal.z * 4.0)
            );
            gl_FragColor = vec4(color, 1.0);
          }
        `}
            />
        </mesh>
    )
}

function GlassPanel({ title, position }: { title: string; position: [number, number, number] }) {
    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <group position={position}>
                {/* Glass-like plane */}
                <mesh>
                    <planeGeometry args={[2.5, 1.2]} />
                    <meshPhysicalMaterial
                        color="#88aaff"
                        roughness={0.1}
                        transmission={0.9}
                        thickness={0.6}
                        clearcoat={1}
                        transparent
                    />
                </mesh>

                {/* Text overlay */}
                <Text
                    position={[0, 0.3, 0.05]}
                    fontSize={0.25}
                    color="#ffffff"
                    outlineWidth={0.005}
                    outlineColor="#00aaff"
                >
                    {title}
                </Text>

                {/* Optional HTML buttons */}
                <Html transform position={[0, -0.2, 0.06]}>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.6rem",
                            justifyContent: "center",
                        }}
                    >
                        <button className="glass-btn">Open</button>
                        <button className="glass-btn">Info</button>
                    </div>
                </Html>
            </group>
        </Float>
    )
}

export default function App() {
    return (
        <>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 3, 5]} intensity={1.5} />
                <Environment preset="sunset" />

                <BackgroundAurora />

                {/* Floating panels */}
                <GlassPanel title="CPU Monitor" position={[-3, 0, 0]} />
                <GlassPanel title="File Explorer" position={[0, 0, 0]} />
                <GlassPanel title="Network Status" position={[3, 0, 0]} />

                {/* Bloom for PS3-like glow */}
                <EffectComposer>
                    <Bloom intensity={1.5} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
                </EffectComposer>

                <OrbitControls enableZoom={false} />
            </Canvas>

            {/* Simple styling for buttons */}
            <style>{`
        .glass-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 10px;
          color: white;
          padding: 0.4rem 1rem;
          font-family: 'Segoe UI', sans-serif;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: background 0.3s;
        }
        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
        </>
    )
}
