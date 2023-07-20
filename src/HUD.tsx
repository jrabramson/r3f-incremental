import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Scene } from 'three'

const HUD = () => {
    const scene = useRef<Scene | null>(null)
    const { camera } = useThree()
    useFrame(({ gl }) => void ((gl.autoClear = false), gl.clearDepth(), gl.render(scene.current!, camera)), 10)
    return <scene ref={scene}>
        <perspectiveCamera position={[0, 0, 10]} />
        <mesh position={[0, 0, -5]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="red" />
        </mesh>
    </scene>
}

export default HUD