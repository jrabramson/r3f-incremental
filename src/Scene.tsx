import { PointerLockControls } from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useEffect, useRef } from 'react'
import { Cube } from './components/Cube'
import Structure from './components/Structure'
import { Physics } from '@react-three/cannon'
import Player from './Player'
import { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'
import { useSnapshot } from 'valtio'
import { globalState } from './state'
import Clamp from './components/objects/Clamp'

function Scene() {
  const lockControls = useRef<PointerLockControlsImpl>(null)

  const { target, lockCursor, isInspecting } = useSnapshot(globalState)

  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const { animate } = useControls('Cube', {
    animate: true,
  })

  useEffect(() => {
    if (isInspecting) {
      lockControls.current?.unlock()
      document.exitPointerLock()

    } else {
      lockControls.current?.lock()
    }
  }, [isInspecting, lockControls])

  return (
    <>
      {performance && <Perf position='top-left' />}

      {(lockCursor) ? null : <PointerLockControls ref={lockControls} makeDefault />}

      <directionalLight
        position={[-2, 2, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024 * 2, 1024 * 2]}
      />
      <ambientLight intensity={0.2} />

      <Physics gravity={[0, -60, 0]}>
        {/* <Debug color="black" scale={1.1}> */}
        <Structure />
        <Clamp />

        <Player isFocused={Boolean(target)} />
        <Cube i={0} />
        <Cube i={1} />
        <Cube i={2} />
        <Cube i={3} />

        {/* </Debug> */}
      </Physics>
    </>
  )
}

export { Scene }
