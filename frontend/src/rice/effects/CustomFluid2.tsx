// Sauce:
// https://github.com/whatisjery/react-fluid-distortion

import { Fluid } from '@whatisjery/react-fluid-distortion';
import { hsl } from '../HSL';

export function CustomFluid2({hue}: {hue: number})  {
  return <Fluid
    fluidColor={hsl(hue, 100, 10)}
    backgroundColor='#000000'

    intensity={2}
    force={1.1}
    distortion={0.4}
    curl={1.9}
    swirl={4}
    blend={5}
    showBackground={false}
    rainbow={false}
    pressure={0.8}
    densityDissipation={0.96}
    velocityDissipation={1.0}
    radius={0.1}
  />;

}