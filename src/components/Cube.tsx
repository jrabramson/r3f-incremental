import { forwardRef, useRef, useEffect, RefObject, useState, useMemo } from 'react'
import { Mesh, BoxGeometry, MeshBasicMaterial, Group, FrontSide, BackSide } from 'three'
import { TransformControls } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import { RapierRigidBody, RigidBody } from '@react-three/rapier'
import { state } from '../state'
import { useSnapshot } from 'valtio'
import { is } from '@react-spring/shared'
import Part from './parts/Part'
import Cuttable from './parts/Cuttable'
import Valuable from './parts/Valuable'

type CubeProps = {
  onClick: (mesh: RapierRigidBody | null, name: string | null) => void,
  onMissed: (e: MouseEvent) => void,
  // isFocused: boolean,
}

type CubeType = Mesh<BoxGeometry, MeshBasicMaterial>

const Cube = forwardRef<CubeType, CubeProps>(({ onClick, onMissed }: CubeProps, ref) => {
  const mesh = useRef<RapierRigidBody>(null)

  const [hovered, setHovered] = useState(false)

  const { target, isKinematic } = useSnapshot(state)

  const handleClick = (e: ThreeEvent<MouseEvent>, mesh: RapierRigidBody | null) => {
    e.stopPropagation()
    onClick(mesh, 'cube')
  }

  useEffect(() => {
    if (target === mesh.current) {
      // set a window event listener for pointerup
      const onMouseUp = (e: MouseEvent) => {
        onMissed(e)
      }
      window.addEventListener('pointerup', onMouseUp)
      return () => {
        window.removeEventListener('pointerup', onMouseUp)
      }
    }
  }, [target])

  const showHighlight = useMemo(() => {
    // console.log(hovered)
    // console.log(hovered)
    // console.log(hovered || target === mesh.current)
    return (hovered || target === mesh.current)
  }, [hovered, target, mesh])

  return (
    <RigidBody position={[-23, 12, 14]} ref={mesh} type={'dynamic'}>
      <mesh
        name="cube"
        ref={ref}
        castShadow
        onPointerDown={(e) => handleClick(e, mesh.current)}
        onPointerMissed={onMissed}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={(e) => target !== mesh.current && setHovered(false)}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color={'mediumpurple'}
          depthTest={target === mesh.current ? false : true}
        />
        {/* {showHighlight &&
          <mesh>
            <boxGeometry args={[1.51, 1.51, 1.51]} />
            <meshStandardMaterial transparent opacity={0.1} color={'red'} depthTest={target === mesh.current ? false : true} />
          </mesh>
        } */}
        {/* <Part inspecting={target === mesh.current} /> */}
        <Valuable inspecting={target === mesh.current} />
        <Cuttable inspecting={target === mesh.current} isCutting={false} />
      </mesh>
    </RigidBody>
  )
})

export { Cube }
