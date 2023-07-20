import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { subscribe, useSnapshot } from "valtio"
import { setKinematic, setTarget, state } from "../../state"
import { useRapier } from "@react-three/rapier"
import * as THREE from "three"
import { EquipRef } from "../../types"

type GrabberProps = {
    active: boolean
}

const Grabber = forwardRef<EquipRef, GrabberProps>(({ active }, ref) => {
    const groupRef = useRef<THREE.Group>(null)
    const { camera, scene } = useThree()

    const [dragging, setDragging] = useState(false);
    const [s] = useState<{ mouse: { x: number; y: number } | null }>({
        mouse: null
    });

    const { targetMesh } = useSnapshot(state)

    const target = useMemo(() => {
        if (targetMesh?.includes('valuable')) {
            return scene.getObjectByName(targetMesh)
        }
    }, [targetMesh])

    const grab = () => {
        target?.position.lerp(new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
        ), 2.0)
    }


    const onMouseUp = () => {
        setDragging(false);
    };

    const onMouseDown = () => {
        console.log(targetMesh)
        if (targetMesh === 'valuable') {
            grab();
        }
    };

    const onMouseMove = () => {

    }


    // useEffect(() => {
    //     if (dragging) {
    //         document.body.style.cursor = "grabbing";
    //     } else {
    //         document.body.style.cursor = "";
    //         s.mouse = null;
    //     }
    // }, [dragging]);

    // useEffect(() => {
    //     if (active && dragging) {
    //         setKinematic(true)
    //     } else {
    //         setKinematic(false)
    //     }
    // }, [active, dragging])

    useFrame(() => {
        if (!active) return;

        if (dragging) {
            console.log(target)
            const dir = new THREE.Vector3()
            const direction = camera.getWorldDirection(dir);

            target?.position.lerp(new THREE.Vector3(
                camera.position.x + direction.x * 5,
                camera.position.y + direction.y * 5,
                camera.position.z + direction.z * 5
            ), 0.2)
        }
    });

    useImperativeHandle(ref, () => ({
        group: groupRef.current,
        handlers: {
            onMouseDown,
            onMouseUp,
            onMouseMove
        }
    }), [targetMesh, active, dragging]);

    return active ? (
        <group ref={groupRef}>
            <mesh position={[0.3, -0.35, 0.5]}>
                <boxGeometry args={[0.1, 0.1, 0.5]} />
                <meshStandardMaterial color="yellow" />
            </mesh>
        </group>
    ) : <></>
})

export default Grabber