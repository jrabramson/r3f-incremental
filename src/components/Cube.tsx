import { useRef, useEffect } from 'react'
import { InstancedMesh, Mesh } from 'three'
import { addObject, globalState } from '../state'
import { useSnapshot } from 'valtio'
import Cuttable from './parts/Cuttable'
import Valuable from './parts/Valuable'
import { useBox } from '@react-three/cannon'
import { useDragConstraint } from '../interaction'

type CubeProps = {
  i: number
}

const Cube = ({ i }: CubeProps) => {
  const name = 'cube' + i
  const position = useRef<number[]>([0, 0, 0])

  const { target, grabbed } = useSnapshot(globalState)

  const [dRef, dApi] = useBox<Mesh>(() => {
    const type = 'Dynamic'

    return {
      type: type,
      mass: 1,
      args: [0.8, 0.8, 0.8],
      position: [2, 2, 2],
    }
  })
  useEffect(() => {
    addObject(name)
  }, [])

  useEffect(() => dApi.position.subscribe((p) => (position.current = p)), [])

  const dragBind = useDragConstraint(name, dRef, dApi, target === name)

  return (
    <mesh
      name={name}
      ref={dRef}
      castShadow
      receiveShadow
      {...dragBind}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color={'mediumpurple'}
      />
      <Valuable parentName={name} />
      <Cuttable parentName={name} />
    </mesh>
  )
}

type InstancedGeometryProps = {
  number: number
}

const Cubes = ({ number }: InstancedGeometryProps) => {
  const [ref, { at }] = useBox(
    () => ({
      args: [0.8, 0.8, 0.8],
      mass: 1,
      position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
    }),
    useRef<InstancedMesh>(null),
  )
  // useFrame(() => at(Math.floor(Math.random() * number)).position.set(0, Math.random() * 2, 0))
  return (
    <instancedMesh receiveShadow castShadow ref={ref} args={[undefined, undefined, number]} name={`cube-${number}`} >
      {/* <Cube /> */}
      <boxBufferGeometry args={[0.8, 0.8, 0.8]}>
        {/* <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} /> */}
      </boxBufferGeometry>
      <meshLambertMaterial vertexColors />
    </instancedMesh>
  )
}

export { Cube, Cubes }
