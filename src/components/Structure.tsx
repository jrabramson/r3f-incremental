import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { CuboidCollider, MeshCollider, RigidBody, RigidBodyProps } from "@react-three/rapier"

const Structure = (props: RigidBodyProps) => {
    // @ts-ignore
    const { nodes, materials } = useGLTF("/doomsday.glb");

    return (
        <RigidBody type="fixed" colliders={false} {...props} includeInvisible>
            <MeshCollider type="hull">
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.nav.geometry}
                    material={materials.Material}
                    visible={false}
                />
            </MeshCollider>
            <MeshCollider type="hull">

                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.nav001.geometry}
                    material={materials["Material.006"]}
                    visible={false}
                />
            </MeshCollider>
            <MeshCollider type="hull">
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.nav002.geometry}
                    material={materials["Material.006"]}
                    visible={false}
                />
            </MeshCollider>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane.geometry}
                material={materials["Material.006"]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane_1.geometry}
                material={materials.Material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane_2.geometry}
                material={materials["Material.007"]}
            />
        </RigidBody>
    );
}

useGLTF.preload("/doomsday.glb");

export default Structure;