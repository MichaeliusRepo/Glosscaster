import { Canvas } from '@react-three/fiber'
import { Stats } from "@react-three/drei";
import EffectStack from './EffectStack';
import ElementStack from './ElementStack';
import * as THREE from 'three';
import { FileExplorerMeine } from '../fileManager/FileExplorerMeine';

export default function XMB({ hue }: { hue: number }) {
    return (
        <Canvas style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
        }} camera={{ position: [0, 0, 7], fov: 60 }}
            onCreated={({ gl }) => {
                gl.setClearColor(new THREE.Color("#000000"));
            }}

        >
            <ambientLight intensity={1.5} />
            <ElementStack hue={hue} />

            <FileExplorerMeine hue={hue} />

            <EffectStack hue={hue} />
            <Stats />

        </Canvas>
    )
}