import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier"
// import grass from "./assets/grass.jpg"

const Ground = (props: RigidBodyProps) => {
  // const texture = useTexture(grass)
  // texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  // map-repeat={[240, 240]}

  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  )
}

export default Ground