// Sauce:
// https://codesandbox.io/p/sandbox/github/whatisjery/react-fluid-distortion
// https://github.com/whatisjery/react-fluid-distortion

// import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

export const Torus = () => {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        if (!meshRef.current) return;

        meshRef.current.rotation.y += 0.01;
        meshRef.current.rotation.x += 0.005;
    });
    return (
        <>
            {/* <Environment preset='warehouse' /> */}

            <mesh position-z={-4} ref={meshRef}>
                <torusGeometry attach='geometry' args={[2.8, 0.8, 100, 100]} />
                <meshStandardMaterial color={"black"} metalness={1} roughness={0} />
                
                {/* <MeshTransmissionMaterial
                    transmission={1}
                    samples={1}
                    anisotropy={0}
                    chromaticAberration={0} /> */}
            </mesh>
        </>
    );
};
