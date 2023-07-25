import { useGLTF } from "@react-three/drei";
import { RigidBodyProps } from "@react-three/rapier";
import { usePlane } from "@react-three/cannon";
import { Mesh } from "three";

const Structure = (props: RigidBodyProps) => {
    const [floorRef] = usePlane<Mesh>(() => ({ rotation: [-Math.PI / 2, 0, 0], type: "Static" }))
    const [wall1Ref] = usePlane<Mesh>(() => ({ rotation: [0, 0, 0], position: [0, 5, -10], type: "Static" }))

    return (
        <group {...props} dispose={null}>
            <mesh
                ref={floorRef}
                castShadow
                receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="gray" />
            </mesh>
            <mesh
                ref={wall1Ref}
                castShadow
                receiveShadow>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="gray" />
            </mesh>
        </group>
    );
}

useGLTF.preload("/doomsday.glb");

export default Structure;