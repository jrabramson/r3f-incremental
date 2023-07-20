import * as THREE from "three";
import React, { forwardRef } from "react";
import { render } from "react-dom";
import { Canvas, useFrame, } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, GodRays, Noise, Sepia, Vignette } from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { Text } from "@react-three/drei";

const Effects = () => {
    return (
        <>
            <EffectComposer >
                <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
                {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
                {/* <Noise opacity={0.02} /> */}
                {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
                <Sepia
                    intensity={0.2} // sepia intensity
                    blendFunction={BlendFunction.NORMAL} // blend mode
                />
            </EffectComposer>
        </>
    );
}

export default Effects;