import { OrbitControls, PointerLockControls, TransformControls } from '@react-three/drei'
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { Cube } from './components/Cube'
import Structure from './components/Structure'
import { Sphere } from './components/Sphere'
import { Physics, RapierRigidBody } from '@react-three/rapier'
import Player from './Player'
import { PointerLockControls as PointerLockControlsImpl, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { useSnapshot } from 'valtio'
import { setTarget, state } from './state'

function Scene() {
  const lockControls = useRef<PointerLockControlsImpl>(null)
  const orbitControls = useRef<OrbitControlsImpl>(null)

  const snap = useSnapshot(state)

  const [isInspecting, setIsInspecting] = useState<Mesh<BoxGeometry, MeshBasicMaterial> | null>(null)

  const { camera, scene } = useThree()

  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const { animate } = useControls('Cube', {
    animate: true,
  })

  const cubeRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null)

  const selected = useMemo(() => {
    if (snap.target) {
      return snap.target
    }
    return null
  }, [snap])

  useFrame((_, delta) => {
    if (animate) {
      // cubeRef.current!.rotation.y += delta / 3
    }
  })

  useEffect(() => {
    if (snap.lockCursor) {
      // const bb = new THREE.Box3()
      // bb.setFromObject(isInspecting);
      // bb.getCenter(orbitControls.current!.target)

      // { selected && camera.lookAt(selected.position) }
      lockControls.current?.unlock()
      // document.exitPointerLock()

    } else {
      lockControls.current?.lock()
    }
  }, [snap, lockControls])

  const onClickCube = (mesh: RapierRigidBody | null, name: string | null) => {
    // setTarget(mesh, name)
  }

  const onMissCube = (e: MouseEvent) => {
    // setTarget(null, null)
  }

  return (
    <>
      {performance && <Perf position='top-left' />}

      {(snap.lockCursor) ? null : <PointerLockControls ref={lockControls} makeDefault />}
      {/* <OrbitControls ref={orbitControls} makeDefault={Boolean(isInspecting)} enabled={Boolean(isInspecting)} /> */}

      <directionalLight
        position={[-2, 2, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024 * 2, 1024 * 2]}
      />
      <ambientLight intensity={0.2} />
      {/* <pointLight castShadow shadow-mapSize={[1024 * 2, 1024 * 2]} intensity={0.8} position={[100, 100, 100]} /> */}

      <Physics>
        <Player isFocused={Boolean(snap.target)} />
        <Cube ref={cubeRef} onClick={onClickCube} onMissed={onMissCube} />
        <Structure />
      </Physics>

      {/* {snap.target && <TransformControls position={[10, -10, 0]} space="world" object={scene.getObjectByName(snap.target)} mode="rotate" />} */}
      {/* <Sphere /> */}
    </>
  )
}

export { Scene }
