// Sauce:
// https://youtu.be/WwN_OQ-7ous?si=7JqmnP1fOvmC9CY_&t=207

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react'
import * as THREE from 'three'
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { clamp, lerp } from 'three/src/math/MathUtils.js';
import { hsl } from '../HSL';
import { sigmoid } from '../../util/MeinMath';

function CenterBox({ hue }: { position: [number, number, number], hue: number }) {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y += 0.001;
    });

    return (
        <group ref={groupRef}>
            <mesh rotation={[45, 45, 0]}>
                <Environment preset='warehouse' />

                <boxGeometry args={[0.6, 0.6, 0.6]} />
                {/* <meshStandardMaterial color={color} roughness={0} metalness={1} /> */}

                <MeshTransmissionMaterial
                    color={hsl(hue, 100, 100)}
                    transmission={1.1}
                    samples={1}
                    anisotropy={0}
                    chromaticAberration={0} />
            </mesh>
        </group>
    )
}

function SatelliteArmSingle({ offset, rotation, transmission }: { offset: number, rotation: [number, number, number], transmission: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        if (!meshRef.current) return;

        meshRef.current.rotation.y -= 0.01;
    });

    return (
        <group rotation={rotation}>
            <mesh ref={meshRef} position={[0, offset, 0]} >

                <Environment preset='warehouse' />

                <cylinderGeometry args={[0.175, 0.175, 2.5, 6]} />
                {/* <boxGeometry args={[0.25, 2.5, 0.25]} /> */}

                <MeshTransmissionMaterial
                    transmission={transmission}
                    samples={1}
                    anisotropy={0}
                    chromaticAberration={0} />

            </mesh>
        </group>
    )
}

function GenerativeSatelliteArm({ position, rotation, hour }: { position: [number, number, number], rotation: [number, number, number], hour: number }) {

    function GetRotation(i: number) { return -(i * Math.PI) / 6; }
    const armDistance = 2.5;

    function GetLightStrength(i: number) {


        let a = i - hour;
        if (a < 0) a *= -1;
        a = clamp(sigmoid(a, 0.15), 0, 1);

        // The closer the difference is to 0, the stronger the light
        return lerp(0.97, -5, 1 - a);
    }

    return (
        <group position={position} rotation={rotation}>
            {
                Array.from({ length: 12 }).map((_, i) => (
                    <SatelliteArmSingle key={i} offset={armDistance} rotation={[0, 0, GetRotation(i)]} transmission={GetLightStrength(i)} />
                ))
            }
        </group>
    )
}

export function BoxClock({ hue = 0, position, rotation, scale }: { hue: number, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }) {
    const now = new Date();
    const hour = now.getHours() % 12 + (now.getMinutes() / 60);

    return (
        <group
            position={position} rotation={rotation} scale={scale} >
            <CenterBox position={[0, 0, 0]} hue={hue} />
            <GenerativeSatelliteArm position={[0, 0, 0]} rotation={[0, 0, 0]} hour={hour} />
        </group>
    )

}