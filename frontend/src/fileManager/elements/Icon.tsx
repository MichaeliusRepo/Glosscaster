import { Text, useTexture } from "@react-three/drei"
import { useSpring, animated, config } from "@react-spring/three"
import { hsl } from "../../rice/HSL"

export function Icon(
    { text, imgPath, hue, opacity, position, rotation, horizontal }:
        {
            text: string,
            imgPath: string,
            hue: number,
            opacity: number,
            position?: [number, number, number],
            rotation?: [number, number, number],
            horizontal?: boolean
        }) {

    const AnimatedText = animated(Text);
    // Animated spring for smooth position and opacity transitions
    const springs = useSpring({
        position: position || [0, 0, 0],
        opacity: opacity || 0,
        config: config.default, // Smooth, gentle animation
    });

    // Load texture
    const texture = useTexture(imgPath);

    return (
        <>
            <animated.group
                position={springs.position as any}
                rotation={rotation}
            >
                {/* <button> */}
                <animated.mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
                    <planeGeometry args={[1, 1]} />
                    {/* @ts-ignore */}
                    <animated.meshStandardMaterial
                        map={texture}
                        color="white"
                        transparent={true}
                        opacity={springs.opacity} // This should animate smoothly now
                    />
                </animated.mesh>

                {/* Text overlay */}
                <AnimatedText
                    position={horizontal ? [0.8, 0, 0] : [0, 0.8, 0]}
                    fontSize={0.25}
                    color="#ffffff"
                    outlineWidth={0.005}
                    outlineColor={hsl(hue, 100, 50)}
                    fillOpacity={springs.opacity}
                    outlineOpacity={springs.opacity}
                    anchorX={horizontal ? "left" : "center"}
                >
                    {text}
                </AnimatedText>

            </animated.group>
        </>
    )
};