import { SideParticle, GlowUpParticles } from "./effects/Particles";
import { Aurora } from "./elements/Aurora";
import { BoxClock } from "./elements/BoxClock";
import { GradientBackground } from "./elements/GradientBackground";
// import { Torus } from "./elements/Torus";
import { hsl } from "./HSL";

export default function ElementStack({ hue }: { hue: number }) {

    return (
        <>
            <GradientBackground hue={hue} s1={100} l1={0} s2={65} l2={15} />

            <group position={[0, -3, -30]} rotation={[0, 0, 0]} scale={[35, 2, 3]}>
                <Aurora
                    settings={{
                        godrayColor: hsl(hue + 30, 100, 70),
                        timeSpeed: 0.5,
                        noiseScale: 250,
                        topRadius: 1.5,
                        bottomRadius: 1.25,
                        height: 30,
                        smoothBottom: 0.9,
                        smoothTop: 0,
                        fresnelPower: 1.1,
                    }}
                />
            </group>
            
            <group position={[0, 25, -30]} rotation={[Math.PI, 0, 0]} scale={[35, 2, 3]}>
                <Aurora
                    settings={{
                        godrayColor: hsl(hue + 30, 100, 100),
                        timeSpeed: 0.5,
                        noiseScale: 2000,
                        topRadius: 1.5,
                        bottomRadius: 1.75,
                        height: 15,
                        smoothBottom: 0,
                        smoothTop: -3,
                        fresnelPower: 0,
                    }}
                />
            </group>

            {/* <GlowLine
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                scale={[10, 1, 1]}
                color={hsl(hue, 100, 100),}
                glowColor={hsl(hue - 30, 100, 50),}
                glowStrength={2}
                width={0.2}
            /> */}

            <BoxClock hue={hue} position={[4, 0, 0]} rotation={[-0.2, -1.05, 0]} scale={[0.6, 0.8, 0.8]} />
            {/* <Torus /> */}

            <SideParticle />
            <GlowUpParticles />
        </>
    );
};