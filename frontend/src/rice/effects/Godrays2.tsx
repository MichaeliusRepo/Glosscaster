// Sauce:
// https://onion2k.github.io/r3f-by-example/examples/effects/postprocessing-godrays/


import { GodRays } from '@react-three/postprocessing'
import React, { useRef, forwardRef, type JSX } from 'react'
import { Mesh } from 'three'
import { BlendFunction, KernelSize } from "postprocessing";
import { hsl } from '../HSL';

export function Godrays2({ hue }: { hue: number }) {
    const sunRef = useRef<Mesh>(null)
    const color = hsl(hue, 100, 75)

    const Sun = forwardRef<Mesh, JSX.IntrinsicElements['mesh']>(function Sun(props, ref) {
        return (
            <mesh ref={ref} position={[-3, 3, -20]} {...props}>

                <sphereGeometry args={[1, 36, 36]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={1}
                    depthWrite={false}
                />
            </mesh>
        )
    })

    return (
        <>
            <Sun ref={sunRef} />
            <GodRays
                sun={sunRef as React.RefObject<Mesh>}
                exposure={0.9}
                decay={0.95}
                blur={true}
                blendFunction={BlendFunction.SCREEN}
                kernelSize={KernelSize.SMALL}
                samples={100}
                density={1.2}
                weight={0.4}
                clampMax={1}
            />
        </>
    )
}