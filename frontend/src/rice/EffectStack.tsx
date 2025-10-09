import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { CustomFluid2 } from "./effects/CustomFluid2";
// import { Godrays2 } from "./effects/Godrays2";

export default function EffectStack({ hue }: { hue: number }) {

return (
    <>
            <EffectComposer>
                <Bloom
                    intensity={1.9}
                    luminanceThreshold={0.1}
                    luminanceSmoothing={0} />

                <Noise
                    opacity={0.1}
                    premultiply // enables or disables noise premultiplication
                    blendFunction={BlendFunction.ADD} // blend mode
                />

                {/* <Godrays2 hue={hue} /> */}
                <CustomFluid2 hue={hue} />

                <Vignette
                    offset={0.5}
                    darkness={0.66}
                    eskil={false}
                    blendFunction={BlendFunction.NORMAL}
                />
            </EffectComposer>
    </>
  );

}