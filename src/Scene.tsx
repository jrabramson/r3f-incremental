import { OrbitControls, PointerLockControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { Cube } from './components/Cube'
import Ground from './components/Ground'
import { Sphere } from './components/Sphere'
import { Physics } from '@react-three/rapier'
import Player from './Player'

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const { animate } = useControls('Cube', {
    animate: true,
  })

  const cubeRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null)

  useFrame((_, delta) => {
    if (animate) {
      cubeRef.current!.rotation.y += delta / 3
    }
  })

  return (
    <>
      {performance && <Perf position='top-left' />}

      {/* <OrbitControls makeDefault /> */}
      <perspectiveCamera />
      <PointerLockControls makeDefault />

      <directionalLight
        position={[-2, 2, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024 * 2, 1024 * 2]}
      />
      <ambientLight intensity={0.2} />

      <Physics gravity={[0, -30, 0]}>
        <Player />
        <Ground />
      </Physics>
      <Cube ref={cubeRef} />
      {/* <Sphere /> */}
    </>
  )
}

export { Scene }
